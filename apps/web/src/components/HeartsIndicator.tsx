export function HeartsIndicator({ hearts, max = 5 }: { hearts: number; max?: number }) {
    return (
        <div className="flex items-center gap-0.5" aria-label={`${hearts} de ${max} vidas`}>
            {Array.from({ length: max }).map((_, i) => (
                <span key={i} className={i < hearts ? "text-rose-500" : "text-slate-200"}>
                    ♥
                </span>
            ))}
        </div>
    );
}
