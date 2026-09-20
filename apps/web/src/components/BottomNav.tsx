"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
    { href: "/dashboard", label: "Início", icon: "🏠" },
    { href: "/trilha", label: "Trilha", icon: "🛤️" },
    { href: "/missoes", label: "Missões", icon: "🎯" },
    { href: "/comunidade", label: "Comunidade", icon: "🏆" },
    { href: "/mural", label: "Mural", icon: "📌" },
];

export function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-slate-200 bg-white/95 backdrop-blur">
            <ul className="mx-auto flex max-w-md justify-between px-2 py-2">
                {NAV_ITEMS.map((item) => {
                    const active = pathname?.startsWith(item.href);
                    return (
                        <li key={item.href} className="flex-1">
                            <Link
                                href={item.href}
                                className={`flex flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 text-xs font-medium transition ${active ? "text-navy" : "text-slate-500"
                                    }`}
                            >
                                <span className="text-lg">{item.icon}</span>
                                {item.label}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
