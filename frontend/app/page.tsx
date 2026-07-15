import Link from 'next/link';
import Button from '@/components/ui/Button';
import PageHero from '@/components/PageHero';

export default function Home() {
  return (
    <main id="main-content" className="min-h-dvh relative overflow-hidden">

      {/* Hero Content */}
      <PageHero
        title="Build on"
        accent="Bitcoin."
        subtitle={<>The first meritocratic Stacks academy. <br className="hidden md:block" /> Master Clarity. Earn Soulbound Badges.</>}
        centered
      >
        <div className="inline-flex items-center gap-3 px-6 py-2 border border-primary/20 rounded-full bg-white/50 backdrop-blur-xl shadow-xl shadow-primary/5 animate-fade-in mb-10">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          <span className="text-[11px] font-bold font-sans text-primary uppercase tracking-[0.3em]">Protocol Academy Open 2025</span>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-16">
          <Link href="/quests">
            <button className="group relative px-14 py-6 bg-secondary text-white rounded-full font-sans font-bold text-sm uppercase tracking-[0.2em] overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl">
              <span className="relative z-10">Start Your Journey</span>
              <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 group-active:translate-y-0 transition-transform duration-300"></div>
            </button>
          </Link>
          <Link href="/manifesto">
            <button className="px-12 py-5 bg-transparent text-black/70 hover:text-black rounded-full font-sans font-bold text-sm uppercase tracking-[0.2em] hover:underline underline-offset-4 transition-all">
              Read Manifesto
            </button>
          </Link>
        </div>

        {/* Asymmetric sub-element — left-aligned on wider screens */}
        <div className="hidden md:block absolute left-10 bottom-24 text-left">
          <p className="font-sans text-xs font-bold uppercase tracking-[0.3em] text-stacks-black/60 max-w-[180px] leading-relaxed" aria-hidden="true">
            Verifiable skill on the only ledger that matters.
          </p>
        </div>
      </PageHero>

      {/* Decorative Strip */}
      <div className="absolute bottom-10 left-0 right-0 z-20">
        <div className="container mx-auto px-10 flex justify-between items-center text-stacks-black/60 font-mono text-[10px] uppercase tracking-[0.4em] font-bold" aria-hidden="true">
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
