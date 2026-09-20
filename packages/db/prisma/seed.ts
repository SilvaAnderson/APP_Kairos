import { PrismaClient, TrailTheme, LessonType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const parish = await prisma.parish.upsert({
        where: { id: "parish-santa-cruz" },
        update: {},
        create: {
            id: "parish-santa-cruz",
            name: "Paróquia Santa Cruz",
        },
    });

    const group = await prisma.group.upsert({
        where: { id: "group-jovens-santa-cruz" },
        update: {},
        create: {
            id: "group-jovens-santa-cruz",
            name: "Jovens Santa Cruz",
            type: "JPA",
            parishId: parish.id,
        },
    });

    const trail = await prisma.trail.upsert({
        where: { id: "trail-liturgia-diaria" },
        update: {},
        create: {
            id: "trail-liturgia-diaria",
            title: "Liturgia Diária",
            description: "O Evangelho do dia mastigado em poucos minutos",
            theme: TrailTheme.LITURGIA_DIARIA,
            modules: {
                create: [
                    {
                        title: "Semana 1",
                        order: 1,
                        lessons: {
                            create: [
                                {
                                    title: "Pílula: Evangelho de hoje",
                                    type: LessonType.PILL,
                                    order: 1,
                                    content: { topics: ["Ponto 1", "Ponto 2", "Ponto 3"] },
                                },
                                {
                                    title: "Quiz Relâmpago: Santo do dia",
                                    type: LessonType.QUIZ,
                                    order: 2,
                                    questions: {
                                        create: [
                                            {
                                                text: "Quem é o santo celebrado hoje?",
                                                order: 1,
                                                choices: {
                                                    create: [
                                                        { text: "São Francisco de Assis", isCorrect: true },
                                                        { text: "São Jorge", isCorrect: false },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    });

    await prisma.badge.createMany({
        data: [
            {
                code: "GUERREIRO_DA_ORACAO",
                name: "Guerreiro da Oração",
                description: "Completou 7 dias seguidos de evangelho",
            },
            {
                code: "ANFITRIAO",
                name: "Anfitrião",
                description: "Levou 3 amigos aos encontros",
            },
            {
                code: "MAO_NA_MASSA",
                name: "Mão na Massa",
                description: "Participou de mutirões sociais",
            },
        ],
        skipDuplicates: true,
    });

    console.log("Seed concluído:", { parish: parish.id, group: group.id, trail: trail.id });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
