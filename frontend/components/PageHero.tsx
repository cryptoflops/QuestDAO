import React from 'react';
import Container from '@/components/ui/Container';

interface PageHeroProps {
    title: string;
    accent: string;
    subtitle: React.ReactNode;
    centered?: boolean;
    children?: React.ReactNode;
}

export default function PageHero({ title, accent, subtitle, centered = false, children }: PageHeroProps) {
    if (centered) {
        return (
            <div className="relative z-10 container mx-auto px-6 pt-32 pb-24 flex flex-col items-center text-center">
                <h1 className="text-balance text-[clamp(3.5rem,10vw,10rem)] font-serif font-bold text-black tracking-tighter leading-[0.8] italic">
                    {title} <br />
                    <span className="text-primary not-italic">{accent}</span>
                </h1>
                <div className="text-balance text-xl md:text-4xl text-stacks-black/70 max-w-3xl mx-auto font-sans font-semibold leading-tight tracking-tight mt-10">
                    {subtitle}
                </div>
                {children}
            </div>
        );
    }

    return (
        <div className="pt-32 pb-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/5 mix-blend-multiply"></div>
            <Container className="relative z-10">
                <h1 className="text-balance text-7xl md:text-[clamp(4rem,10vw,10rem)] font-serif text-black mb-10 tracking-tighter leading-[0.8] italic">
                    {title} <br />
                    <span className="text-primary not-italic">{accent}</span>
                </h1>
                <div className="text-2xl md:text-3xl text-stacks-black/80 font-sans font-semibold leading-tight max-w-2xl tracking-tight">
                    {subtitle}
                </div>
                {children}
            </Container>
        </div>
    );
}
