import { FastifyInstance } from "fastify";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@kairos/db";

const registerSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    groupId: z.string().optional(),
    engagementPace: z.enum(["TRANQUILO", "FIRME", "INTENSO"]).default("FIRME"),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

const SALT_ROUNDS = 12;

export async function authRoutes(app: FastifyInstance) {
    app.post("/register", async (request, reply) => {
        const body = registerSchema.parse(request.body);

        const existing = await prisma.user.findUnique({ where: { email: body.email } });
        if (existing) {
            return reply.code(409).send({ error: "E-mail já cadastrado" });
        }

        const user = await prisma.user.create({
            data: {
                name: body.name,
                email: body.email,
                passwordHash: await bcrypt.hash(body.password, SALT_ROUNDS),
                engagementPace: body.engagementPace,
                memberships: body.groupId
                    ? { create: { groupId: body.groupId } }
                    : undefined,
            },
        });

        const token = app.jwt.sign({ userId: user.id });
        return reply.code(201).send({ token, user: { id: user.id, name: user.name, email: user.email } });
    });

    app.post("/login", async (request, reply) => {
        const body = loginSchema.parse(request.body);

        const user = await prisma.user.findUnique({ where: { email: body.email } });
        if (!user?.passwordHash || !(await bcrypt.compare(body.password, user.passwordHash))) {
            return reply.code(401).send({ error: "Credenciais inválidas" });
        }

        const token = app.jwt.sign({ userId: user.id });
        return reply.send({ token, user: { id: user.id, name: user.name, email: user.email } });
    });
}
