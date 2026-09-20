import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "@kairos/db";

function startOfWeek(date: Date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // segunda-feira
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
}

function startOfMonth(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}

export async function leaderboardRoutes(app: FastifyInstance) {
    // Placar da comunidade: ranking por grupo, período semanal ou mensal
    app.get("/", async (request) => {
        const query = z
            .object({
                groupId: z.string().optional(),
                period: z.enum(["weekly", "monthly", "all"]).default("weekly"),
            })
            .parse(request.query);

        const since =
            query.period === "weekly"
                ? startOfWeek(new Date())
                : query.period === "monthly"
                    ? startOfMonth(new Date())
                    : undefined;

        const members = await prisma.groupMembership.findMany({
            where: query.groupId ? { groupId: query.groupId } : undefined,
            include: { user: true },
        });

        const rankings = await Promise.all(
            members.map(async (m) => {
                const xpSince = since
                    ? await prisma.lessonProgress.aggregate({
                        where: { userId: m.userId, completedAt: { gte: since } },
                        _sum: { xpEarned: true },
                    })
                    : null;

                return {
                    userId: m.user.id,
                    name: m.user.name,
                    xp: since ? xpSince?._sum.xpEarned ?? 0 : m.user.xp,
                    currentStreak: m.user.currentStreak,
                };
            })
        );

        return rankings.sort((a, b) => b.xp - a.xp);
    });
}
