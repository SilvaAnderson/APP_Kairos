import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "@kairos/db";

const answerSchema = z.object({ choiceId: z.string() });

function isSameDay(a: Date, b: Date) {
    return a.toDateString() === b.toDateString();
}

function isYesterday(a: Date, b: Date) {
    const yesterday = new Date(b);
    yesterday.setDate(yesterday.getDate() - 1);
    return isSameDay(a, yesterday);
}

async function updateStreak(userId: string) {
    const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
    const now = new Date();

    let currentStreak = user.currentStreak;
    if (!user.lastActivityAt) {
        currentStreak = 1;
    } else if (isSameDay(user.lastActivityAt, now)) {
        // já contabilizado hoje
    } else if (isYesterday(user.lastActivityAt, now)) {
        currentStreak += 1;
    } else {
        currentStreak = 1;
    }

    await prisma.user.update({
        where: { id: userId },
        data: {
            currentStreak,
            longestStreak: Math.max(currentStreak, user.longestStreak),
            lastActivityAt: now,
        },
    });
}

export async function trailRoutes(app: FastifyInstance) {
    // Lista trilhas disponíveis com módulos e lições (estrutura da "trilha do dia")
    app.get("/", async () => {
        return prisma.trail.findMany({
            orderBy: { order: "asc" },
            include: {
                modules: {
                    orderBy: { order: "asc" },
                    include: { lessons: { orderBy: { order: "asc" } } },
                },
            },
        });
    });

    app.get("/lessons/:lessonId", async (request) => {
        const { lessonId } = z.object({ lessonId: z.string() }).parse(request.params);
        return prisma.lesson.findUniqueOrThrow({
            where: { id: lessonId },
            include: { questions: { include: { choices: true } } },
        });
    });

    // Responde uma pergunta de quiz: retorna feedback imediato + perde coração se errar
    app.post(
        "/questions/:questionId/answer",
        { preHandler: [app.authenticate] },
        async (request, reply) => {
            const { userId } = request.user as { userId: string };
            const { questionId } = z.object({ questionId: z.string() }).parse(request.params);
            const body = answerSchema.parse(request.body);

            const choice = await prisma.choice.findUniqueOrThrow({
                where: { id: body.choiceId },
                include: { question: { include: { choices: true } } },
            });

            if (choice.questionId !== questionId) {
                return reply.code(400).send({ error: "Escolha não pertence a esta pergunta" });
            }

            if (!choice.isCorrect) {
                const user = await prisma.user.update({
                    where: { id: userId },
                    data: { hearts: { decrement: 1 } },
                });
                const correct = choice.question.choices.find((c) => c.isCorrect);
                return reply.send({
                    correct: false,
                    heartsRemaining: Math.max(user.hearts, 0),
                    explanation: correct?.explanation ?? "Continue estudando, você vai chegar lá!",
                });
            }

            return reply.send({ correct: true, explanation: choice.explanation });
        }
    );

    // Marca lição como concluída: dá XP, moedas e atualiza streak
    app.post(
        "/lessons/:lessonId/complete",
        { preHandler: [app.authenticate] },
        async (request, reply) => {
            const { userId } = request.user as { userId: string };
            const { lessonId } = z.object({ lessonId: z.string() }).parse(request.params);

            const lesson = await prisma.lesson.findUniqueOrThrow({ where: { id: lessonId } });

            const progress = await prisma.lessonProgress.upsert({
                where: { userId_lessonId: { userId, lessonId } },
                update: { completedAt: new Date(), xpEarned: lesson.xpReward },
                create: {
                    userId,
                    lessonId,
                    completedAt: new Date(),
                    xpEarned: lesson.xpReward,
                },
            });

            await prisma.user.update({
                where: { id: userId },
                data: { xp: { increment: lesson.xpReward }, coins: { increment: 1 } },
            });

            await updateStreak(userId);

            await prisma.analyticsEvent.create({
                data: { userId, eventType: "LESSON_COMPLETED", metadata: { lessonId } },
            });

            return reply.send(progress);
        }
    );
}
