import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "@kairos/db";

const createPostSchema = z.object({
    title: z.string().min(2),
    body: z.string().min(2),
    groupId: z.string().optional(),
    pinned: z.boolean().default(false),
    expiresAt: z.string().datetime().optional(),
});

export async function postRoutes(app: FastifyInstance) {
    // Mural de avisos interativo (prazos de inscrição, horários de encontros)
    app.get("/", async (request) => {
        const query = z.object({ groupId: z.string().optional() }).parse(request.query);
        return prisma.post.findMany({
            where: {
                groupId: query.groupId ?? undefined,
                OR: [{ expiresAt: null }, { expiresAt: { gte: new Date() } }],
            },
            orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
        });
    });

    app.post("/", { preHandler: [app.authenticate] }, async (request, reply) => {
        const { userId } = request.user as { userId: string };
        const body = createPostSchema.parse(request.body);

        const post = await prisma.post.create({
            data: {
                authorId: userId,
                title: body.title,
                body: body.body,
                groupId: body.groupId,
                pinned: body.pinned,
                expiresAt: body.expiresAt ? new Date(body.expiresAt) : undefined,
            },
        });

        return reply.code(201).send(post);
    });
}
