import { FastifyInstance } from "fastify";
import { prisma } from "@kairos/db";

// Endpoints de apoio ao painel de líderes (engajamento, temas populares, horários de pico, retenção).
// Em produção, o pipeline de ETL lê AnalyticsEvent e alimenta o modelo do Power BI Embedded;
// estes endpoints servem para visão rápida dentro do próprio app.
export async function analyticsRoutes(app: FastifyInstance) {
    app.get("/engagement-summary", { preHandler: [app.authenticate] }, async () => {
        const [totalUsers, activeLast7Days, totalLessonsCompleted] = await Promise.all([
            prisma.user.count(),
            prisma.user.count({
                where: { lastActivityAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
            }),
            prisma.lessonProgress.count({ where: { completedAt: { not: null } } }),
        ]);

        return { totalUsers, activeLast7Days, totalLessonsCompleted };
    });

    // Temas (trilhas) que mais geram engajamento, por número de lições concluídas
    app.get("/popular-themes", { preHandler: [app.authenticate] }, async () => {
        const progress = await prisma.lessonProgress.findMany({
            where: { completedAt: { not: null } },
            include: { lesson: { include: { module: { include: { trail: true } } } } },
        });

        const counts = new Map<string, number>();
        for (const p of progress) {
            const theme = p.lesson.module.trail.theme;
            counts.set(theme, (counts.get(theme) ?? 0) + 1);
        }

        return Array.from(counts.entries())
            .map(([theme, count]) => ({ theme, count }))
            .sort((a, b) => b.count - a.count);
    });

    // Horários de pico de acesso, baseado nos eventos de analytics registrados
    app.get("/peak-hours", { preHandler: [app.authenticate] }, async () => {
        const events = await prisma.analyticsEvent.findMany({ select: { createdAt: true } });
        const hourly = new Array(24).fill(0);
        for (const e of events) {
            hourly[e.createdAt.getHours()] += 1;
        }
        return hourly.map((count, hour) => ({ hour, count }));
    });

    app.post("/track", async (request, reply) => {
        const body = request.body as { userId?: string; eventType: string; metadata?: unknown };
        const event = await prisma.analyticsEvent.create({
            data: { userId: body.userId, eventType: body.eventType, metadata: body.metadata as any },
        });
        return reply.code(201).send(event);
    });
}
