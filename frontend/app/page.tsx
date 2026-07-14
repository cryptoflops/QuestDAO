import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function Home() {
  return (
    <main className="min-h-dvh relative overflow-hidden">

      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-6 pt-32 pb-40 flex flex-col items-center text-center">

        <div className="space-y-10 max-w-6xl">
          <div className="inline-flex items-center gap-3 px-6 py-2 border border-primary/20 rounded-full bg-white/50 backdrop-blur-xl shadow-xl shadow-primary/5 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="text-[11px] font-bold font-sans text-primary uppercase tracking-[0.3em]">Protocol Academy Open 2025</span>
          </div>

          <h1 className="text-balance text-[clamp(3.5rem,10vw,10rem)] font-serif font-bold text-black tracking-tighter leading-[0.8] italic">
            Build on <br />
            <span className="text-primary not-italic">Bitcoin.</span>
          </h1>

          <p className="text-balance text-xl md:text-4xl text-stacks-black/70 max-w-3xl mx-auto font-sans font-semibold leading-tight tracking-tight">
            The first meritocratic Stacks academy. <br className="hidden md:block" />
            Master Clarity. Earn Soulbound Badges.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-16">
          <Link href="/quests">
            <button className="group relative px-12 py-5 bg-secondary text-white rounded-full font-sans font-bold text-sm uppercase tracking-[0.2em] overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl">
              <span className="relative z-10">Start Your Journey</span>
              <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 group-active:translate-y-0 transition-transform duration-300"></div>
            </button>
          </Link>
          <Link href="/manifesto">
            <button className="px-12 py-5 bg-white/70 backdrop-blur-md border border-black/10 text-black rounded-full font-sans font-bold text-sm uppercase tracking-[0.2em] hover:bg-white/90 active:scale-[0.98] transition-all shadow-xl">
              Read Manifesto
            </button>
          </Link>
        </div>

        {/* Asymmetric sub-element — left-aligned on wider screens */}
        <div className="hidden md:block absolute left-10 bottom-24 text-left">
          <p className="font-sans text-xs font-bold uppercase tracking-[0.3em] text-stacks-black/30 max-w-[180px] leading-relaxed">
            Verifiable skill on the only ledger that matters.
          </p>
        </div>
      </div>

      {/* Decorative Strip */}
      <div className="absolute bottom-10 left-0 right-0 z-20">
        <div className="container mx-auto px-10 flex justify-between items-center text-stacks-black/40 font-mono text-[10px] uppercase tracking-[0.4em] font-bold">
          <div className="flex items-center gap-4">
            <div className="w-1 h-1 bg-primary"></div>
            <span>Stacks Protocol Certified</span>
          </div>
          <span className="hidden md:block opacity-20">///</span>
          <div className="flex items-center gap-4">
            <span>Proof of Skill // 2025</span>
            <div className="w-1 h-1 bg-primary"></div>
          </div>
        </div>
      </div>

    </main>
  );
}
