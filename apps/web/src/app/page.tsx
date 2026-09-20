import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-1 flex-col items-center justify-between bg-gradient-to-b from-navy to-navy-light px-8 py-16 text-white">
      <div className="mt-12 flex flex-col items-center gap-4 text-center">
        <Image
          src="/kairos-logo.jpg"
          alt="Kairós - Grupo de Jovens"
          width={140}
          height={140}
          priority
          className="h-[140px] w-[140px] rounded-full shadow-lg ring-2 ring-gold"
        />
        <h1 className="text-3xl font-bold tracking-tight">Kairós</h1>
        <p className="max-w-xs text-white/80">
          Sua fé, um passo por dia. Trilhas, quizzes e desafios com a galera do seu grupo de jovens.
        </p>
      </div>

      <div className="flex w-full max-w-xs flex-col gap-3">
        <Link
          href="/onboarding"
          className="rounded-full bg-gold px-6 py-3 text-center font-semibold text-navy shadow-lg transition hover:brightness-105"
        >
          Começar agora
        </Link>
        <Link
          href="/dashboard"
          className="rounded-full border border-white/40 px-6 py-3 text-center font-semibold text-white transition hover:bg-white/10"
        >
          Já tenho conta
        </Link>
      </div>
    </div>
  );
}


