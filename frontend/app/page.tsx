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

      {/* Learning Path */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-serif italic text-center mb-10">Your path to Clarity mastery</h2>
        <div className="space-y-4">
          {[
            { step: "01", title: "Clarity Fundamentals", desc: "Learn syntax, types, and basic contract structure. Write your first smart contract.", badge: "Beginner" },
            { step: "02", title: "Smart Contract Safety", desc: "Understand access controls, reentrancy protection, and security patterns used by top protocols.", badge: "Intermediate" },
            { step: "03", title: "SIP-009 NFT Mastery", desc: "Build NFT contracts that follow the Stacks token standard. Deploy your own collection.", badge: "Intermediate" },
            { step: "04", title: "DAO Architecture", desc: "Design decentralized governance. Build proposal systems, voting mechanisms, and treasury management.", badge: "Wizard" },
            { step: "05", title: "BNS Identity", desc: "Integrate Bitcoin Name System for on-chain identity. Verify users and build reputation systems.", badge: "Verification" },
          ].map((item) => (
            <div key={item.step} className="flex items-center gap-6 p-5 bg-white/90 border border-black/5 rounded-2xl hover:border-[#F04A10]/30 transition-all">
              <span className="text-2xl font-bold text-[#F04A10] font-mono w-12 shrink-0">{item.step}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold text-stacks-black">{item.title}</h3>
                  <span className="text-[10px] uppercase tracking-wider bg-[#F04A10]/10 text-[#F04A10] px-2 py-0.5 rounded-lg">{item.badge}</span>
                </div>
                <p className="text-stacks-black/60 text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* What builders say */}
      <section className="bg-stacks-grey/30 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-serif italic text-center mb-10">What builders say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Sarah K.", role: "Clarity Developer", quote: "QuestDAO gave me the structure I needed to go from zero to deploying my first contract. The knowledge checks actually test understanding." },
              { name: "Marcus K.", role: "Full Stack Engineer", quote: "I tried docs and tutorials for weeks. QuestDAO's hands-on approach with real contract deployment was what finally clicked." },
              { name: "Priya N.", role: "Web3 Builder", quote: "The Soulbound Badges are verifiable proof of skill. I share mine in job applications and it actually gets noticed." },
            ].map((t) => (
              <div key={t.name} className="bg-white/90 border border-black/5 rounded-2xl p-6">
                <p className="text-stacks-black/70 text-sm italic mb-4 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                <p className="text-stacks-black font-bold text-sm">{t.name}</p>
                <p className="text-stacks-black/40 text-xs">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

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
