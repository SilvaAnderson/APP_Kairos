const engagement = { totalUsers: 86, activeLast7Days: 61, totalLessonsCompleted: 512 };

const popularThemes = [
    { theme: "LITURGIA_DIARIA", count: 210 },
    { theme: "SANTOS", count: 140 },
    { theme: "CATEQUESE", count: 95 },
    { theme: "DOUTRINA_SOCIAL", count: 47 },
    { theme: "ORACOES", count: 20 },
];

const peakHours = [7, 12, 19, 20, 21].map((h) => ({ hour: h, count: [12, 8, 40, 55, 30][[7, 12, 19, 20, 21].indexOf(h)] }));

const retention = [
    { week: "Sem 1", pct: 100 },
    { week: "Sem 2", pct: 78 },
    { week: "Sem 3", pct: 65 },
    { week: "Sem 4", pct: 58 },
];

export default function PainelPage() {
    const maxTheme = Math.max(...popularThemes.map((t) => t.count));
    const maxHour = Math.max(...peakHours.map((h) => h.count));

    return (
        <div className="flex flex-col gap-6 px-5 pt-8">
            <header>
                <h1 className="text-xl font-bold text-slate-900">Painel de Engajamento</h1>
                <p className="text-sm text-slate-500">
                    Visão dos líderes: os dados detalhados vivem no Power BI Embedded, alimentado pelo pipeline de analytics.
                </p>
            </header>

            <section className="grid grid-cols-3 gap-3">
                <div className="rounded-2xl bg-white p-3 text-center shadow-sm">
                    <p className="text-2xl font-bold text-navy">{engagement.totalUsers}</p>
                    <p className="text-xs text-slate-500">Jovens cadastrados</p>
                </div>
                <div className="rounded-2xl bg-white p-3 text-center shadow-sm">
                    <p className="text-2xl font-bold text-mint">{engagement.activeLast7Days}</p>
                    <p className="text-xs text-slate-500">Ativos (7 dias)</p>
                </div>
                <div className="rounded-2xl bg-white p-3 text-center shadow-sm">
                    <p className="text-2xl font-bold text-gold">{engagement.totalLessonsCompleted}</p>
                    <p className="text-xs text-slate-500">Lições concluídas</p>
                </div>
            </section>

            <section className="rounded-2xl bg-white p-4 shadow-sm">
                <h2 className="mb-3 text-base font-bold text-slate-900">Temas mais engajantes</h2>
                <div className="flex flex-col gap-2">
                    {popularThemes.map((t) => (
                        <div key={t.theme} className="flex items-center gap-3">
                            <span className="w-32 shrink-0 text-xs text-slate-600">{t.theme.replaceAll("_", " ")}</span>
                            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                                <div
                                    className="h-full rounded-full bg-navy"
                                    style={{ width: `${(t.count / maxTheme) * 100}%` }}
                                />
                            </div>
                            <span className="w-8 text-right text-xs text-slate-500">{t.count}</span>
                        </div>
                    ))}
                </div>
            </section>

            <section className="rounded-2xl bg-white p-4 shadow-sm">
                <h2 className="mb-3 text-base font-bold text-slate-900">Horários de pico</h2>
                <div className="flex items-end gap-2">
                    {peakHours.map((h) => (
                        <div key={h.hour} className="flex flex-1 flex-col items-center gap-1">
                            <div
                                className="w-full rounded-t-md bg-gold"
                                style={{ height: `${(h.count / maxHour) * 80}px` }}
                            />
                            <span className="text-xs text-slate-500">{h.hour}h</span>
                        </div>
                    ))}
                </div>
            </section>

            <section className="rounded-2xl bg-white p-4 shadow-sm">
                <h2 className="mb-3 text-base font-bold text-slate-900">Retenção ao longo do tempo</h2>
                <div className="flex items-end gap-3">
                    {retention.map((r) => (
                        <div key={r.week} className="flex flex-1 flex-col items-center gap-1">
                            <div className="w-full rounded-t-md bg-mint" style={{ height: `${r.pct}px` }} />
                            <span className="text-xs text-slate-500">{r.week}</span>
                            <span className="text-xs font-medium text-slate-700">{r.pct}%</span>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
