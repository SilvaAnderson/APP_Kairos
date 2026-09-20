export function StreakBadge({ days }: { days: number }) {
    return (
        <div className="flex items-center gap-1.5 rounded-full bg-gold/10 px-3 py-1.5 text-gold">
            <span className="text-lg">🔥</span>
            <span className="text-sm font-semibold">{days} dias</span>
        </div>
    );
}
