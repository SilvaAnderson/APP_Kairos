import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "@kairos/db";

const joinSchema = z.object({ groupId: z.string() });

export async function groupRoutes(app: FastifyInstance) {
    // Lista grupos de uma paróquia (para escolha no onboarding)
    app.get("/", async (request) => {
        const query = z.object({ parishId: z.string().optional() }).parse(request.query);
        return prisma.group.findMany({
            where: query.parishId ? { parishId: query.parishId } : undefined,
            include: { parish: true },
        });
    });

    app.post("/join", { preHandler: [app.authenticate] }, async (request, reply) => {
        const { userId } = request.user as { userId: string };
        const body = joinSchema.parse(request.body);

        const membership = await prisma.groupMembership.upsert({
            where: { userId_groupId: { userId, groupId: body.groupId } },
            update: {},
            create: { userId, groupId: body.groupId },
        });

        return reply.code(201).send(membership);
    });
}
