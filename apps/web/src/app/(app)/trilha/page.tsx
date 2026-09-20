import Link from "next/link";
import { mockTrailToday } from "@/lib/mock-data";

const LESSON_ICON: Record<string, string> = {
    PILL: "📖",
    QUIZ: "⚡",
    PRACTICAL_CHALLENGE: "🤝",
};

export default function TrilhaPage() {
    return (
        <div className="flex flex-col gap-6 px-5 pt-8">
            <header>
                <h1 className="text-xl font-bold text-slate-900">Trilhas de conteúdo</h1>
                <p className="text-sm text-slate-500">Liturgia Diária, Catequese, Santos, Doutrina Social e Orações.</p>
            </header>

            <ol className="relative flex flex-col gap-4 pl-6">
                <div className="absolute bottom-4 left-2 top-4 w-0.5 bg-slate-200" />
                {mockTrailToday.map((lesson) => (
                    <li key={lesson.id} className="relative">
                        <span
                            className={`absolute -left-6 top-1 flex h-8 w-8 items-center justify-center rounded-full text-sm ${lesson.done ? "bg-mint text-navy" : "bg-white text-slate-400 ring-2 ring-slate-200"
                                }`}
                        >
                            {lesson.done ? "✓" : "•"}
                        </span>
                        <Link
                            href={`/trilha/${lesson.id}`}
                            className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 hover:border-navy/40"
                        >
                            <span className="text-2xl">{LESSON_ICON[lesson.type]}</span>
                            <span className="font-medium text-slate-800">{lesson.title}</span>
                        </Link>
                    </li>
                ))}
            </ol>
        </div>
    );
}
