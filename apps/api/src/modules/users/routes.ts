import { FastifyInstance } from "fastify";
import { prisma } from "@kairos/db";

export async function userRoutes(app: FastifyInstance) {
    // Perfil do usuário autenticado: XP, streak, corações, badges
    app.get("/me", { preHandler: [app.authenticate] }, async (request) => {
        const { userId } = request.user as { userId: string };

        const user = await prisma.user.findUniqueOrThrow({
            where: { id: userId },
            include: {
                badges: { include: { badge: true } },
                memberships: { include: { group: true } },
            },
        });

        return {
            id: user.id,
            name: user.name,
            xp: user.xp,
            coins: user.coins,
            hearts: user.hearts,
            currentStreak: user.currentStreak,
            longestStreak: user.longestStreak,
            engagementPace: user.engagementPace,
            groups: user.memberships.map((m) => ({ id: m.group.id, name: m.group.name })),
            badges: user.badges.map((b) => ({ code: b.badge.code, name: b.badge.name })),
        };
    });
}
