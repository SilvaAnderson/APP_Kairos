"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const GROUPS = [
    { id: "group-jovens-santa-cruz", name: "Jovens Santa Cruz" },
    { id: "group-crisma-2026", name: "Crisma 2026" },
    { id: "group-coral-jovem", name: "Coral Jovem" },
];

const PACES = [
    { id: "TRANQUILO", label: "Tranquilo", description: "1 lição/dia" },
    { id: "FIRME", label: "Firme", description: "3 lições/dia + 1 check-in" },
    { id: "INTENSO", label: "Intenso", description: "Missão completa + desafio com a comunidade" },
] as const;

export default function OnboardingPage() {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [groupId, setGroupId] = useState<string | null>(null);
    const [pace, setPace] = useState<(typeof PACES)[number]["id"] | null>(null);

    const steps = ["Paróquia", "Ritmo"];

    function next() {
        if (step < steps.length - 1) {
            setStep(step + 1);
        } else {
            // TODO: persistir escolhas via api.post("/groups/join") e salvar preferências do usuário
            router.push("/dashboard");
        }
    }

    return (
        <div className="mx-auto flex min-h-screen max-w-md flex-col justify-between bg-white px-6 py-10">
            <div>
                <div className="mb-8 flex gap-2">
                    {steps.map((_, i) => (
                        <div
                            key={i}
                            className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-navy" : "bg-slate-200"}`}
                        />
                    ))}
                </div>

                {step === 0 && (
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Qual é o seu grupo de jovens?</h1>
                        <p className="mt-1 text-slate-500">Isso alimenta o placar da sua comunidade.</p>
                        <div className="mt-6 flex flex-col gap-3">
                            {GROUPS.map((g) => (
                                <button
                                    key={g.id}
                                    onClick={() => setGroupId(g.id)}
                                    className={`rounded-2xl border px-4 py-3 text-left font-medium transition ${groupId === g.id
                                        ? "border-navy bg-navy/5 text-navy"
                                        : "border-slate-200 text-slate-700"
                                        }`}
                                >
                                    {g.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 1 && (
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Qual seu ritmo de engajamento esta semana?</h1>
                        <div className="mt-6 flex flex-col gap-3">
                            {PACES.map((p) => (
                                <button
                                    key={p.id}
                                    onClick={() => setPace(p.id)}
                                    className={`rounded-2xl border px-4 py-3 text-left transition ${pace === p.id
                                        ? "border-navy bg-navy/5"
                                        : "border-slate-200"
                                        }`}
                                >
                                    <div className="font-semibold text-slate-900">{p.label}</div>
                                    <div className="text-sm text-slate-500">{p.description}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <button
                onClick={next}
                disabled={(step === 0 && !groupId) || (step === 1 && !pace)}
                className="mt-8 rounded-full bg-navy px-6 py-3 font-semibold text-white transition disabled:opacity-40"
            >
                {step < steps.length - 1 ? "Continuar" : "Entrar no app"}
            </button>
        </div>
    );
}
