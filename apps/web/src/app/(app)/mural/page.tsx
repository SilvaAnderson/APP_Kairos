"use client";

import { useState } from "react";
import { mockPosts, mockEvents } from "@/lib/mock-data";

export default function MuralPage() {
    const [rsvp, setRsvp] = useState<Record<string, "GOING" | "MAYBE" | "NOT_GOING">>({});

    function respond(eventId: string, status: "GOING" | "MAYBE" | "NOT_GOING") {
        // TODO: chamar api.post(`/events/${eventId}/rsvp`, { status })
        setRsvp((prev) => ({ ...prev, [eventId]: status }));
    }

    return (
        <div className="flex flex-col gap-6 px-5 pt-8">
            <header>
                <h1 className="text-xl font-bold text-slate-900">Mural de Avisos</h1>
                <p className="text-sm text-slate-500">Acampamentos, retiros e horários de encontros.</p>
            </header>

            <section className="flex flex-col gap-3">
                {mockPosts.map((post) => (
                    <div
                        key={post.id}
                        className={`rounded-2xl p-4 shadow-sm ${post.pinned ? "border border-gold/50 bg-gold/10" : "bg-white"}`}
                    >
                        {post.pinned && <p className="mb-1 text-xs font-semibold text-gold">📌 Fixado</p>}
                        <p className="font-semibold text-slate-900">{post.title}</p>
                        <p className="mt-1 text-sm text-slate-600">{post.body}</p>
                    </div>
                ))}
            </section>

            <section>
                <h2 className="mb-3 text-base font-bold text-slate-900">Próximos eventos</h2>
                <div className="flex flex-col gap-4">
                    {mockEvents.map((event) => {
                        const total =
                            event.rsvpSummary.GOING + event.rsvpSummary.MAYBE + event.rsvpSummary.NOT_GOING;
                        return (
                            <div key={event.id} className="rounded-2xl bg-white p-4 shadow-sm">
                                <p className="font-semibold text-slate-900">{event.title}</p>
                                <p className="text-sm text-slate-500">
                                    {new Date(event.startsAt).toLocaleString("pt-BR", {
                                        weekday: "short",
                                        day: "2-digit",
                                        month: "2-digit",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </p>

                                <div className="mt-3 flex h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                                    <div
                                        className="h-full bg-mint"
                                        style={{ width: `${(event.rsvpSummary.GOING / total) * 100}%` }}
                                    />
                                    <div
                                        className="h-full bg-gold"
                                        style={{ width: `${(event.rsvpSummary.MAYBE / total) * 100}%` }}
                                    />
                                    <div
                                        className="h-full bg-slate-300"
                                        style={{ width: `${(event.rsvpSummary.NOT_GOING / total) * 100}%` }}
                                    />
                                </div>
                                <p className="mt-1 text-xs text-slate-500">
                                    {event.rsvpSummary.GOING} vão · {event.rsvpSummary.MAYBE} talvez · {event.rsvpSummary.NOT_GOING} não vão
                                </p>

                                <div className="mt-3 flex gap-2">
                                    {(["GOING", "MAYBE", "NOT_GOING"] as const).map((status) => (
                                        <button
                                            key={status}
                                            onClick={() => respond(event.id, status)}
                                            className={`flex-1 rounded-full px-3 py-1.5 text-xs font-medium transition ${rsvp[event.id] === status
                                                ? "bg-navy text-white"
                                                : "bg-slate-100 text-slate-600"
                                                }`}
                                        >
                                            {status === "GOING" ? "Vou" : status === "MAYBE" ? "Talvez" : "Não vou"}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}
