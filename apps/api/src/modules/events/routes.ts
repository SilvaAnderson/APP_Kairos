import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "@kairos/db";

const rsvpSchema = z.object({ status: z.enum(["GOING", "MAYBE", "NOT_GOING"]) });

const geoCheckInSchema = z.object({
    method: z.literal("GEOLOCATION"),
    latitude: z.number(),
    longitude: z.number(),
});

const qrCheckInSchema = z.object({
    method: z.literal("QR_CODE"),
    qrCodeToken: z.string(),
});

const checkInSchema = z.discriminatedUnion("method", [geoCheckInSchema, qrCheckInSchema]);

const CHECKIN_XP_BONUS = 50;

// Distância em metros entre duas coordenadas (fórmula de Haversine)
function distanceInMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371000;
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function eventRoutes(app: FastifyInstance) {
    // Mural de eventos: missas, retiros, acampamentos, encontros
    app.get("/", async (request) => {
        const query = z.object({ parishId: z.string().optional() }).parse(request.query);
        return prisma.event.findMany({
            where: query.parishId ? { parishId: query.parishId } : undefined,
            orderBy: { startsAt: "asc" },
        });
    });

    // Confirmação de presença (RSVP), usada nos gráficos em tempo real da coordenação
    app.post(
        "/:eventId/rsvp",
        { preHandler: [app.authenticate] },
        async (request, reply) => {
            const { userId } = request.user as { userId: string };
            const { eventId } = z.object({ eventId: z.string() }).parse(request.params);
            const body = rsvpSchema.parse(request.body);

            const rsvp = await prisma.rSVP.upsert({
                where: { eventId_userId: { eventId, userId } },
                update: { status: body.status, respondedAt: new Date() },
                create: { eventId, userId, status: body.status },
            });

            await prisma.analyticsEvent.create({
                data: { userId, eventType: "RSVP", metadata: { eventId, status: body.status } },
            });

            return reply.send(rsvp);
        }
    );

    // Resumo de RSVPs por status, para o dashboard da coordenação
    app.get("/:eventId/rsvp-summary", async (request) => {
        const { eventId } = z.object({ eventId: z.string() }).parse(request.params);
        const grouped = await prisma.rSVP.groupBy({
            by: ["status"],
            where: { eventId },
            _count: { status: true },
        });
        return grouped.map((g) => ({ status: g.status, count: g._count.status }));
    });

    // Check-in por geolocalização (raio da igreja) ou QR Code lido pelo coordenador
    app.post(
        "/:eventId/check-in",
        { preHandler: [app.authenticate] },
        async (request, reply) => {
            const { userId } = request.user as { userId: string };
            const { eventId } = z.object({ eventId: z.string() }).parse(request.params);
            const body = checkInSchema.parse(request.body);

            const event = await prisma.event.findUniqueOrThrow({ where: { id: eventId } });

            if (body.method === "QR_CODE") {
                if (!event.qrCodeToken || event.qrCodeToken !== body.qrCodeToken) {
                    return reply.code(400).send({ error: "QR Code inválido para este evento" });
                }
            } else {
                if (event.latitude == null || event.longitude == null) {
                    return reply.code(400).send({ error: "Evento sem localização cadastrada" });
                }
                const distance = distanceInMeters(event.latitude, event.longitude, body.latitude, body.longitude);
                if (distance > event.radiusMeters) {
                    return reply.code(400).send({ error: "Você está fora do raio da igreja" });
                }
            }

            const checkIn = await prisma.checkIn.upsert({
                where: { eventId_userId: { eventId, userId } },
                update: {},
                create: {
                    eventId,
                    userId,
                    method: body.method,
                    latitude: body.method === "GEOLOCATION" ? body.latitude : undefined,
                    longitude: body.method === "GEOLOCATION" ? body.longitude : undefined,
                    xpAwarded: CHECKIN_XP_BONUS,
                },
            });

            await prisma.user.update({
                where: { id: userId },
                data: { xp: { increment: CHECKIN_XP_BONUS } },
            });

            await prisma.analyticsEvent.create({
                data: { userId, eventType: "CHECKIN", metadata: { eventId, method: body.method } },
            });

            return reply.code(201).send(checkIn);
        }
    );
}
