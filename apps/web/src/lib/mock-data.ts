// Dados de demonstração usados nas telas enquanto a integração completa com a API não está plugada na UI.
export const mockUser = {
    name: "Maria",
    group: "Jovens Santa Cruz",
    currentStreak: 6,
    hearts: 4,
    xp: 320,
    coins: 45,
};

export const mockTrailToday = [
    { id: "l1", type: "PILL" as const, title: "Evangelho de hoje", done: true },
    { id: "l2", type: "QUIZ" as const, title: "Quiz: Santo do dia", done: true },
    { id: "l3", type: "PRACTICAL_CHALLENGE" as const, title: "Desafio: mande uma mensagem de apoio", done: false },
    { id: "l4", type: "QUIZ" as const, title: "Quiz: Doutrina Social", done: false },
];

export const mockLeaderboard = [
    { name: "João", xp: 540 },
    { name: "Maria", xp: 320 },
    { name: "Pedro", xp: 290 },
    { name: "Ana", xp: 210 },
    { name: "Lucas", xp: 180 },
];

export const mockMissions = [
    { id: "m1", title: "Arrecadar 50kg de alimentos", currentValue: 32, goalValue: 50, unit: "kg" },
    { id: "m2", title: "Levar um amigo novo ao grupo", currentValue: 1, goalValue: 3, unit: "amigos" },
];

export const mockPosts = [
    {
        id: "p1",
        title: "Inscrições abertas: Acampamento de Jovens 2026",
        body: "Inscreva-se até 20/09 na secretaria da paróquia.",
        pinned: true,
    },
    {
        id: "p2",
        title: "Retiro de Crisma - Novembro",
        body: "Encontro preparatório todo sábado às 15h.",
        pinned: false,
    },
];

export const mockEvents = [
    {
        id: "e1",
        title: "Missa Jovem de Domingo",
        startsAt: "2026-09-13T19:00:00",
        rsvpSummary: { GOING: 42, MAYBE: 8, NOT_GOING: 3 },
    },
    {
        id: "e2",
        title: "Mutirão Social - Doação de Agasalhos",
        startsAt: "2026-09-20T09:00:00",
        rsvpSummary: { GOING: 25, MAYBE: 5, NOT_GOING: 1 },
    },
];

export const mockBadges = [
    { code: "GUERREIRO_DA_ORACAO", name: "Guerreiro da Oração", earned: true },
    { code: "ANFITRIAO", name: "Anfitrião", earned: false },
    { code: "MAO_NA_MASSA", name: "Mão na Massa", earned: true },
];
export const mockLessonDetails: Record<
    string,
    | { type: "PILL"; title: string; topics: string[] }
    | {
        type: "QUIZ";
        title: string;
        question: string;
        choices: { id: string; text: string; correct: boolean; explanation?: string }[];
    }
    | { type: "PRACTICAL_CHALLENGE"; title: string; description: string }
> = {
    l1: {
        type: "PILL",
        title: "Evangelho de hoje",
        topics: [
            "Jesus ensina a parábola do bom samaritano.",
            "O verdadeiro próximo é quem pratica a misericórdia.",
            "Somos chamados a agir, não apenas a sentir compaixão.",
        ],
    },
    l2: {
        type: "QUIZ",
        title: "Quiz: Santo do dia",
        question: "Qual santo é celebrado hoje pela sua simplicidade e amor à natureza?",
        choices: [
            {
                id: "c1",
                text: "São Francisco de Assis",
                correct: true,
                explanation: "Isso mesmo! São Francisco é lembrado por sua pobreza voluntária e amor à criação.",
            },
            {
                id: "c2",
                text: "São Jorge",
                correct: false,
                explanation: "Na verdade, o santo de hoje é São Francisco de Assis, conhecido por seu amor à natureza.",
            },
        ],
    },
    l3: {
        type: "PRACTICAL_CHALLENGE",
        title: "Desafio: mande uma mensagem de apoio",
        description:
            "Envie uma mensagem de incentivo para alguém do seu grupo de jovens hoje. Depois, volte aqui e confirme para ganhar XP!",
    },
    l4: {
        type: "QUIZ",
        title: "Quiz: Doutrina Social",
        question: "Qual é um dos princípios centrais da Doutrina Social da Igreja?",
        choices: [
            {
                id: "c1",
                text: "Dignidade da pessoa humana",
                correct: true,
                explanation: "Exato! A dignidade da pessoa humana é o fundamento de toda a Doutrina Social.",
            },
            {
                id: "c2",
                text: "Competição individual",
                correct: false,
                explanation: "Não é isso — a Doutrina Social valoriza a solidariedade e o bem comum.",
            },
        ],
    },
};