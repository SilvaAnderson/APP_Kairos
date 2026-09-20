import { mockMissions, mockBadges } from "@/lib/mock-data";

export default function MissoesPage() {
    return (
        <div className="flex flex-col gap-6 px-5 pt-8">
            <header>
                <h1 className="text-xl font-bold text-slate-900">Missões e Engajamento</h1>
                <p className="text-sm text-slate-500">Desafios práticos para viver a fé em comunidade.</p>
            </header>

            <section className="flex flex-col gap-4">
                {mockMissions.map((mission) => {
                    const pct = Math.min(100, Math.round((mission.currentValue / mission.goalValue) * 100));
                    return (
                        <div key={mission.id} className="rounded-2xl bg-white p-4 shadow-sm">
                            <p className="font-semibold text-slate-800">{mission.title}</p>
                            <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                                <div className="h-full rounded-full bg-navy" style={{ width: `${pct}%` }} />
                            </div>
                            <p className="mt-1 text-xs text-slate-500">
                                {mission.currentValue} / {mission.goalValue} {mission.unit}
                            </p>
                        </div>
                    );
                })}
            </section>

            <section>
                <h2 className="mb-3 text-base font-bold text-slate-900">Conquistas</h2>
                <div className="grid grid-cols-3 gap-3">
                    {mockBadges.map((badge) => (
                        <div
                            key={badge.code}
                            className={`flex flex-col items-center gap-1 rounded-2xl p-3 text-center ${badge.earned ? "bg-gold/10" : "bg-slate-100 opacity-50"
                                }`}
                        >
                            <span className="text-3xl">🏅</span>
                            <span className="text-xs font-medium text-slate-700">{badge.name}</span>
                        </div>
                    ))}
                </div>
            </section>

            <section className="rounded-2xl bg-white p-4 shadow-sm">
                <h2 className="mb-2 text-base font-bold text-slate-900">Check-in na Missa</h2>
                <p className="mb-3 text-sm text-slate-500">
                    Confirme sua presença por geolocalização ou QR Code na entrada da igreja para ganhar um bônus de pontos.
                </p>
                <button className="w-full rounded-full bg-navy px-6 py-3 font-semibold text-white">
                    Fazer check-in
                </button>
            </section>
        </div>
    );
}
