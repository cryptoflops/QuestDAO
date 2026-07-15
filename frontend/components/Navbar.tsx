import Link from 'next/link';
import Image from 'next/image';
import ConnectWallet from './ConnectWallet';

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 h-20 border-b-[0.5px] border-black/5 bg-white/70 backdrop-blur-2xl">
            <div className="container mx-auto px-6 h-full flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group" aria-label="QuestDAO Home">
                    <div className="w-10 h-10 rounded-[10px] flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-500 shadow-lg shadow-orange-500/20 overflow-hidden">
                        <Image src="/qd-2.png" alt="QuestDAO" width={40} height={40} className="w-full h-full object-cover" priority />
                    </div>
                    <Image src="/qd-1.png" alt="" width={120} height={28} className="object-contain" priority />
                </Link>

                {/* Links */}
                <div className="hidden md:flex items-center gap-10">
                    <Link href="/manifesto" className="text-[12px] font-bold text-stacks-black/60 hover:text-primary transition-colors font-sans uppercase tracking-[0.2em]">
                        Manifesto
                    </Link>
                    <Link href="/quests" className="text-[12px] font-bold text-stacks-black/60 hover:text-primary transition-colors font-sans uppercase tracking-[0.2em]">
                        Learn
                    </Link>
                    <Link href="/leaderboard" className="text-[12px] font-bold text-stacks-black/60 hover:text-primary transition-colors font-sans uppercase tracking-[0.2em]">
                        Ranks
                    </Link>
                    <Link href="/governance" className="text-[12px] font-bold text-stacks-black/60 hover:text-primary transition-colors font-sans uppercase tracking-[0.2em]">
                        Council
                    </Link>
                </div>

                {/* Action */}
                <div className="flex items-center gap-4">
                    <ConnectWallet />
                </div>
            </div>
        </nav>
    );
}
