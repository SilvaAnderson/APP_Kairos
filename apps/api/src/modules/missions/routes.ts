import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "@kairos/db";

const progressSchema = z.object({ increment: z.number().int().positive().default(1) });

export async function missionRoutes(app: FastifyInstance) {
    // Missões ativas (individuais e coletivas), com barra de progresso
    app.get("/", async (request) => {
        const query = z.object({ groupId: z.string().optional() }).parse(request.query);
        const now = new Date();

        const missions = await prisma.mission.findMany({
            where: {
                startDate: { lte: now },
                endDate: { gte: now },
                ...(query.groupId ? { OR: [{ groupId: query.groupId }, { groupId: null }] } : {}),
            },
            include: { progress: true },
        });

        return missions.map((m) => ({
            id: m.id,
            title: m.title,
            description: m.description,
            type: m.type,
            goalValue: m.goalValue,
            currentValue: m.progress.reduce((sum, p) => sum + p.currentValue, 0),
            endDate: m.endDate,
        }));
    });

    // Atualiza progresso de uma missão para o usuário autenticado
    app.post(
        "/:missionId/progress",
        { preHandler: [app.authenticate] },
        async (request) => {
            const { userId } = request.user as { userId: string };
            const { missionId } = z.object({ missionId: z.string() }).parse(request.params);
            const body = progressSchema.parse(request.body);

            const progress = await prisma.missionProgress.upsert({
                where: { missionId_userId: { missionId, userId } },
                update: { currentValue: { increment: body.increment } },
                create: { missionId, userId, currentValue: body.increment },
            });

            await prisma.analyticsEvent.create({
                data: { userId, eventType: "MISSION_PROGRESS", metadata: { missionId, increment: body.increment } },
            });

            return progress;
        }
    );
}
