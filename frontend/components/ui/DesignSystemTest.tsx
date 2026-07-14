import React from 'react';
import Container from './Container';

const DesignSystemTest = () => {
    return (
        <Container className="py-20 space-y-20">

            {/* Typography Section */}
            <section className="space-y-8">
                <div className="border-b border-border pb-4 mb-8">
                    <p className="font-mono text-sm text-muted-foreground uppercase tracking-widest">Typography</p>
                </div>

                <div className="space-y-6">
                    <h1 className="text-6xl md:text-8xl font-serif text-foreground">
                        Editorial Luxury.
                    </h1>
                    <h2 className="text-4xl md:text-5xl font-serif text-foreground/90">
                        The Meritocratic Academy
                    </h2>
                    <h3 className="text-3xl font-serif text-muted-foreground">
                        QuestDAO Typography Standard
                    </h3>
                    <p className="text-xl md:text-2xl leading-relaxed text-muted-foreground max-w-2xl">
                        This is an example of the body text. It uses the Sans-Serif font (Manrope or Inter) to contrast with the rich Serif headings.
                        The goal is maximum readability with a premium "printed page" feel.
                    </p>
                </div>
            </section>

            {/* Colors Section */}
            <section className="space-y-8">
                <div className="border-b border-border pb-4 mb-8">
                    <p className="font-mono text-sm text-muted-foreground uppercase tracking-widest">Color Palette</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">

                    <div className="space-y-3">
                        <div className="h-32 w-full rounded-lg bg-stacks-black border border-border"></div>
                        <div className="space-y-1">
                            <p className="font-medium text-foreground">Black</p>
                            <p className="text-xs text-muted-foreground">bg-stacks-black</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="h-32 w-full rounded-lg bg-stacks-dark border border-border"></div>
                        <div className="space-y-1">
                            <p className="font-medium text-foreground">Dark</p>
                            <p className="text-xs text-muted-foreground">bg-stacks-dark</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="h-32 w-full rounded-lg bg-stacks-grey border border-border"></div>
                        <div className="space-y-1">
                            <p className="font-medium text-foreground">Grey</p>
                            <p className="text-xs text-muted-foreground">bg-stacks-grey</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="h-32 w-full rounded-lg bg-primary border border-0"></div>
                        <div className="space-y-1">
                            <p className="font-medium text-primary">Orange</p>
                            <p className="text-xs text-muted-foreground">bg-primary</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="h-32 w-full rounded-lg bg-background border border-border"></div>
                        <div className="space-y-1">
                            <p className="font-medium text-foreground">Background</p>
                            <p className="text-xs text-muted-foreground">bg-background</p>
                        </div>
                    </div>

                </div>
            </section>

            {/* Components Section */}
            <section className="space-y-8">
                <div className="border-b border-border pb-4 mb-8">
                    <p className="font-mono text-sm text-muted-foreground uppercase tracking-widest">Base Components</p>
                </div>

                <div className="grid md:grid-cols-2 gap-12">

                    {/* Card */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-mono text-muted-foreground">Card / Surface</h4>
                        <div className="p-8 bg-white border border-border rounded-2xl space-y-6">
                            <div className="flex justify-between items-start">
                                <div className="w-12 h-12 bg-primary/10 flex items-center justify-center rounded-lg">
                                    <div className="w-6 h-6 bg-primary mask-icon"></div>
                                </div>
                                <span className="text-xs font-mono border border-primary/30 text-primary px-2 py-1 rounded-lg">MINTED</span>
                            </div>
                            <div>
                                <h3 className="text-2xl font-serif text-card-foreground mb-2">Build a Stacks Smart Contract</h3>
                                <p className="text-muted-foreground">Learn the fundamentals of Clarity language and deploy your first contract to the testnet.</p>
                            </div>
                            <button className="w-full py-4 bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity">
                                Start Quest
                            </button>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-mono text-muted-foreground">Input / Interactive</h4>
                        <div className="space-y-6 max-w-md">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                                <input
                                    type="email"
                                    placeholder="member@questdao.org"
                                    className="w-full bg-input border-b border-black/20 px-0 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
                                />
                            </div>

                            <div className="flex gap-4">
                                <button className="px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-colors">
                                    Primary
                                </button>
                                <button className="px-8 py-3 border border-white/20 text-white font-semibold rounded-full hover:bg-white/5 transition-colors">
                                    Secondary
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

        </Container>
    );
};

export default DesignSystemTest;
