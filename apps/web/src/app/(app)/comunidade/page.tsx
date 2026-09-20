"use client";

import { useState } from "react";
import { mockLeaderboard } from "@/lib/mock-data";

const PERIODS = [
    { id: "weekly", label: "Semanal" },
    { id: "monthly", label: "Mensal" },
] as const;

export default function ComunidadePage() {
    const [period, setPeriod] = useState<(typeof PERIODS)[number]["id"]>("weekly");

    return (
        <div className="flex flex-col gap-6 px-5 pt-8">
            <header>
                <h1 className="text-xl font-bold text-slate-900">Placar da Comunidade</h1>
                <p className="text-sm text-slate-500">Quem mais participou dos quizzes, missas e mutirões.</p>
            </header>

            <div className="flex gap-2">
                {PERIODS.map((p) => (
                    <button
                        key={p.id}
                        onClick={() => setPeriod(p.id)}
                        className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${period === p.id ? "bg-navy text-white" : "bg-white text-slate-600"
                            }`}
                    >
                        {p.label}
                    </button>
                ))}
            </div>

            <ol className="flex flex-col gap-2">
                {mockLeaderboard.map((entry, i) => (
                    <li
                        key={entry.name}
                        className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm"
                    >
                        <div className="flex items-center gap-3">
                            <span className="w-6 text-center font-bold text-slate-400">{i + 1}</span>
                            <span className="font-medium text-slate-800">{entry.name}</span>
                        </div>
                        <span className="font-bold text-navy">{entry.xp} XP</span>
                    </li>
                ))}
            </ol>
        </div>
    );
}
