"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { HeartsIndicator } from "@/components/HeartsIndicator";
import { mockLessonDetails, mockUser } from "@/lib/mock-data";

export function LessonPageClient() {
    const params = useParams<{ lessonId: string }>();
    const router = useRouter();
    const lesson = mockLessonDetails[params.lessonId];

    const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
    const [hearts, setHearts] = useState(mockUser.hearts);
    const [challengeDone, setChallengeDone] = useState(false);

    if (!lesson) {
        return <div className="px-5 pt-8 text-slate-500">Lição não encontrada.</div>;
    }

    const selected = lesson.type === "QUIZ" ? lesson.choices.find((c) => c.id === selectedChoice) : null;

    function answerQuiz(choiceId: string) {
        if (lesson.type !== "QUIZ" || selectedChoice) return;
        setSelectedChoice(choiceId);
        const choice = lesson.choices.find((c) => c.id === choiceId);
        if (!choice?.correct) setHearts((h) => Math.max(h - 1, 0));
    }

    return (
        <div className="flex flex-col gap-6 px-5 pt-8">
            <div className="flex items-center justify-between">
                <button onClick={() => router.back()} className="text-slate-500">
                    ← Voltar
                </button>
                <HeartsIndicator hearts={hearts} />
            </div>

            <h1 className="text-xl font-bold text-slate-900">{lesson.title}</h1>

            {lesson.type === "PILL" && (
                <div className="flex flex-col gap-3">
                    {lesson.topics.map((topic, i) => (
                        <div key={i} className="rounded-2xl bg-white p-4 shadow-sm">
                            <span className="mr-2 font-bold text-navy">{i + 1}.</span>
                            {topic}
                        </div>
                    ))}
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="mt-2 rounded-full bg-navy px-6 py-3 font-semibold text-white"
                    >
                        Concluir lição (+10 XP)
                    </button>
                </div>
            )}

            {lesson.type === "QUIZ" && (
                <div className="flex flex-col gap-3">
                    <p className="font-medium text-slate-800">{lesson.question}</p>
                    {lesson.choices.map((choice) => {
                        const isSelected = selectedChoice === choice.id;
                        const showState = Boolean(selectedChoice);

                        return (
                            <button
                                key={choice.id}
                                onClick={() => answerQuiz(choice.id)}
                                disabled={showState}
                                className={`rounded-2xl border p-4 text-left transition ${showState && choice.correct
                                        ? "border-mint bg-mint/10"
                                        : showState && isSelected && !choice.correct
                                            ? "border-rose-400 bg-rose-50"
                                            : "border-slate-200 bg-white"
                                    }`}
                            >
                                {choice.text}
                            </button>
                        );
                    })}
                    {selected && (
                        <div
                            className={`rounded-2xl p-4 text-sm ${selected.correct ? "bg-mint/15 text-navy" : "bg-rose-100 text-rose-800"
                                }`}
                        >
                            {selected.correct ? "Você acertou! 🎉" : "Não foi dessa vez."} {selected.explanation}
                        </div>
                    )}
                    {selectedChoice && (
                        <button
                            onClick={() => router.push("/dashboard")}
                            className="mt-2 rounded-full bg-navy px-6 py-3 font-semibold text-white"
                        >
                            Continuar
                        </button>
                    )}
                </div>
            )}

            {lesson.type === "PRACTICAL_CHALLENGE" && (
                <div className="flex flex-col gap-4">
                    <p className="rounded-2xl bg-white p-4 text-slate-700 shadow-sm">{lesson.description}</p>
                    <button
                        onClick={() => setChallengeDone(true)}
                        disabled={challengeDone}
                        className="rounded-full bg-navy px-6 py-3 font-semibold text-white disabled:opacity-50"
                    >
                        {challengeDone ? "Desafio concluído ✅" : "Marcar como concluído"}
                    </button>
                </div>
            )}
        </div>
    );
}
