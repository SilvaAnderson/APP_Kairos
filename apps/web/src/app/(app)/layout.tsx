import { BottomNav } from "@/components/BottomNav";

export default function AppShellLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-slate-50 pb-20">
            {children}
            <BottomNav />
        </div>
    );
}
