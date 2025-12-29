'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MobileNav() {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden pb-safe">
            <div className="bg-charcoal/90 backdrop-blur-xl border-t border-bone/10 px-6 py-4 flex justify-between items-center">

                <Link href="/" className={`flex flex-col items-center gap-1 ${isActive('/') ? 'text-gold' : 'text-slate'}`}>
                    <span className="text-xl">⌂</span>
                    <span className="text-[9px] uppercase tracking-widest font-mono">Home</span>
                </Link>

                <Link href="/quests" className={`flex flex-col items-center gap-1 ${isActive('/quests') ? 'text-gold' : 'text-slate'}`}>
                    <span className="text-xl">❖</span>
                    <span className="text-[9px] uppercase tracking-widest font-mono">Quests</span>
                </Link>

                <Link href="/leaderboard" className={`flex flex-col items-center gap-1 ${isActive('/leaderboard') ? 'text-gold' : 'text-slate'}`}>
                    <span className="text-xl">Ξ</span>
                    <span className="text-[9px] uppercase tracking-widest font-mono">Top</span>
                </Link>

                <Link href="/governance" className={`flex flex-col items-center gap-1 ${isActive('/governance') ? 'text-gold' : 'text-slate'}`}>
                    <span className="text-xl">⚖</span>
                    <span className="text-[9px] uppercase tracking-widest font-mono">Vote</span>
                </Link>

            </div>
        </div>
    );
}
