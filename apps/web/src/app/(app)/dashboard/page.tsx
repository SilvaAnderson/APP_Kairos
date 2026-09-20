import Link from "next/link";
import { StreakBadge } from "@/components/StreakBadge";
import { HeartsIndicator } from "@/components/HeartsIndicator";
import { mockUser, mockTrailToday, mockLeaderboard } from "@/lib/mock-data";

const LESSON_ICON: Record<string, string> = {
    PILL: "📖",
    QUIZ: "⚡",
    PRACTICAL_CHALLENGE: "🤝",
};

export default function DashboardPage() {
    return (
        <div className="flex flex-col gap-6 px-5 pt-8">
            <header className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-slate-500">Olá, {mockUser.name} 👋</p>
                    <p className="text-lg font-bold text-slate-900">{mockUser.group}</p>
                </div>
                <StreakBadge days={mockUser.currentStreak} />
            </header>

            <section className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm">
                <div>
                    <p className="text-xs text-slate-500">Vidas</p>
                    <HeartsIndicator hearts={mockUser.hearts} />
                </div>
                <div className="text-right">
                    <p className="text-xs text-slate-500">XP</p>
                    <p className="font-bold text-navy">{mockUser.xp}</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-slate-500">Moedas</p>
                    <p className="font-bold text-gold">{mockUser.coins} 🪙</p>
                </div>
            </section>

            <section>
                <h2 className="mb-3 text-base font-bold text-slate-900">Trilha do dia</h2>
                <ol className="flex flex-col gap-3">
                    {mockTrailToday.map((lesson) => (
                        <li key={lesson.id}>
                            <Link
                                href={`/trilha/${lesson.id}`}
                                className={`flex items-center gap-3 rounded-2xl border p-4 transition ${lesson.done
                                    ? "border-mint/40 bg-mint/10"
                                    : "border-slate-200 bg-white hover:border-navy/40"
                                    }`}
                            >
                                <span className="text-2xl">{LESSON_ICON[lesson.type]}</span>
                                <span className="flex-1 font-medium text-slate-800">{lesson.title}</span>
                                <span>{lesson.done ? "✅" : "▶️"}</span>
                            </Link>
                        </li>
                    ))}
                </ol>
            </section>

            <section className="rounded-2xl bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-base font-bold text-slate-900">Placar da semana</h2>
                    <Link href="/comunidade" className="text-sm font-medium text-navy">
                        Ver tudo
                    </Link>
                </div>
                <ol className="flex flex-col gap-2">
                    {mockLeaderboard.slice(0, 3).map((entry, i) => (
                        <li key={entry.name} className="flex items-center justify-between text-sm">
                            <span className="text-slate-700">
                                {i + 1}. {entry.name}
                            </span>
                            <span className="font-semibold text-slate-900">{entry.xp} XP</span>
                        </li>
                    ))}
                </ol>
            </section>
        </div>
    );
}
