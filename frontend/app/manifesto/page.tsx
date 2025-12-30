'use client';

import Link from 'next/link';

export default function ManifestoPage() {
    return (
        <main className="min-h-screen bg-[#FDFCFB] text-[#1A1A1A] py-32 px-6">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <header className="mb-24 animate-fade-in">
                    <Link href="/" className="inline-block mb-12 text-sm font-bold uppercase tracking-[0.3em] text-[#FF4B12] hover:opacity-70 transition-opacity">
                        ← Back to Terminal
                    </Link>
                    <h1 className="text-7xl md:text-9xl font-serif font-bold tracking-tighter leading-[0.85] mb-8 italic">
                        QuestDAO <br />
                        <span className="not-italic text-[#FF4B12]">Manifesto.</span>
                    </h1>
                    <div className="h-px w-24 bg-[#FF4B12] mb-8"></div>
                    <p className="text-xl md:text-2xl font-sans font-medium text-black/60 leading-relaxed italic">
                        Defining the hard bedrock of digital sovereignty on Bitcoin.
                    </p>
                </header>

                {/* Content */}
                <article className="space-y-20 font-serif text-lg md:text-xl leading-relaxed text-black/80">

                    <section className="space-y-6">
                        <h2 className="text-3xl font-bold tracking-tight text-black flex items-center gap-4">
                            <span className="text-[#FF4B12] text-sm font-mono tracking-widest font-normal uppercase">01</span>
                            Hard BitBedrock
                        </h2>
                        <p>
                            L1 Bitcoin is the only ledger that matters. Everything else is just noise or a temporary experiment. We don&apos;t build on Stacks because it&apos;s convenient; we build here because it&apos;s the only way to anchor high-logic Clarity contracts to the security of the prime chain.
                        </p>
                        <p>
                            QuestDAO isn&apos;t a social experiment. It’s a guild for people who actually care about <code className="bg-black/5 px-1.5 py-0.5 rounded font-mono text-sm text-[#FF4B12]">post-conditions</code>, state transitions, and things that don&apos;t break when the hype dies.
                        </p>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-3xl font-bold tracking-tight text-black flex items-center gap-4">
                            <span className="text-[#FF4B12] text-sm font-mono tracking-widest font-normal uppercase">02</span>
                            Code or GTFO
                        </h2>
                        <p>
                            Stop talking about &quot;mastery&quot; and start committing code. In this guild, your status is a direct reflection of your ability to handle traits, implement SIP-010 standards, and manage complex <code className="bg-black/5 px-1.5 py-0.5 rounded font-mono text-sm text-[#FF4B12]">read-only</code> functions without tripping.
                        </p>
                        <p>
                            You don&apos;t buy your way in. You don&apos;t tweet your way in. You prove your competence by successfully calling the <code className="bg-black/5 px-1.5 py-0.5 rounded font-mono text-sm text-[#FF4B12]">quest-registry-v4</code> and minting your own reputation. If the contract rejects your transaction, you aren&apos;t ready. Simple as that.
                        </p>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-3xl font-bold tracking-tight text-black flex items-center gap-4">
                            <span className="text-[#FF4B12] text-sm font-mono tracking-widest font-normal uppercase">03</span>
                            The Architect&apos;s Reality
                        </h2>
                        <p>
                            We don&apos;t ask for permission. We build. In QuestDAO, the individual is the only unit of progress that counts. We use Clarity because its decidability means we actually know what the code will do before we run it.
                        </p>
                        <p>
                            No surprises. No &quot;move fast and break things.&quot; Just rigorous, predictable engineering for an economy that demands integrity. If you can&apos;t audit the contract, you&apos;re just a tourist.
                        </p>
                    </section>

                    <section className="space-y-12 bg-black/5 p-10 md:p-16 rounded-2xl border border-black/5">
                        <h2 className="text-4xl font-bold tracking-tighter text-black italic">
                            Operation Rules
                        </h2>

                        <div className="space-y-10">
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold tracking-tight uppercase text-[#FF4B12]">Reputation is Non-Transferable</h3>
                                <p className="text-base md:text-lg">
                                    Your Soulbound Badges aren&apos;t NFTs to be flipped on Gamma. They&apos;re non-fungible proof of your technical sweat. We use <code className="bg-black/5 px-1.5 py-0.5 rounded font-mono text-sm text-[#FF4B12]">SIP-009</code> extensions with a hard burn-on-transfer rule. You want the status? Do the work. You can&apos;t delegate your knowledge to someone else&apos;s wallet.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xl font-bold tracking-tight uppercase text-[#FF4B12]">Power Follows Proven Merit</h3>
                                <p className="text-base md:text-lg">
                                    One-token-one-vote is a failure. It’s just plutocracy with a better UI. In the Council, we weight votes by your <code className="bg-black/5 px-1.5 py-0.5 rounded font-mono text-sm text-[#FF4B12]">architect-level</code>. Those who have cleared the most difficult quests and contributed the most secure code have the loudest voice. We trust the people who have shipped, not the people who have the most capital.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xl font-bold tracking-tight uppercase text-[#FF4B12]">Longevity by Design</h3>
                                <p className="text-base md:text-lg">
                                    Our smart contracts are built for a ten-year horizon, not a ten-day pump. We prioritize security and readable logic over gas optimization hacks that hide vulnerabilities. We&apos;re building the infrastructure for the sovereign individual. That requires an obsession with quality that borders on the fanatical.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-8 pt-10 border-t border-black/10">
                        <h2 className="text-5xl font-serif font-bold tracking-tighter italic">
                            The Threshold
                        </h2>
                        <p className="text-xl">
                            The curriculum is brutal by design. Most people will drop out after the first module. Good. QuestDAO is for the few who are willing to spend their nights debugging <code className="bg-black/5 px-1.5 py-0.5 rounded font-mono text-sm text-[#FF4B12]">unwrap!</code> calls and mapping out complex DAO voting logic.
                        </p>

                        <div className="pt-8">
                            <p className="font-bold text-2xl tracking-tight text-black">
                                Build for Truth. Architect for Eternity.
                            </p>
                            <footer className="mt-4 text-sm text-black/40 uppercase tracking-widest font-sans font-bold">
                                Authored by the QuestDAO Architects
                            </footer>
                        </div>
                    </section>
                </article>

                {/* CTA */}
                <footer className="mt-32 border-t border-black/10 pt-20 flex flex-col items-center">
                    <Link href="/quests">
                        <button className="group relative px-16 py-6 bg-[#000000] text-white rounded-full font-sans font-bold text-sm uppercase tracking-[0.3em] overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl">
                            <span className="relative z-10">Enter the Academy</span>
                            <div className="absolute inset-0 bg-[#FF4B12] translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                        </button>
                    </Link>
                </footer>
            </div>
        </main>
    );
}
