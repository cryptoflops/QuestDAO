import Link from 'next/link';
import ConnectWallet from './ConnectWallet';

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 h-20 border-b-[0.5px] border-black/10 bg-white/60 backdrop-blur-2xl">
            <div className="container mx-auto px-6 h-full flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 rounded-lg bg-[#FF4B12] flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-500 shadow-lg shadow-orange-500/20">
                        <span className="font-bold text-white text-xl font-serif">Q</span>
                    </div>
                    <span className="text-2xl font-bold tracking-tighter text-black transition-colors font-serif">
                        QuestDAO
                    </span>
                </Link>

                {/* Links */}
                <div className="hidden md:flex items-center gap-10">
                    <Link href="/manifesto" className="text-[12px] font-bold text-stacks-black/60 hover:text-stacks-orange transition-colors font-sans uppercase tracking-[0.2em]">
                        Manifesto
                    </Link>
                    <Link href="/quests" className="text-[12px] font-bold text-stacks-black/60 hover:text-stacks-orange transition-colors font-sans uppercase tracking-[0.2em]">
                        Learn
                    </Link>
                    <Link href="/leaderboard" className="text-[12px] font-bold text-stacks-black/60 hover:text-stacks-orange transition-colors font-sans uppercase tracking-[0.2em]">
                        Ranks
                    </Link>
                    <Link href="/governance" className="text-[12px] font-bold text-stacks-black/60 hover:text-stacks-orange transition-colors font-sans uppercase tracking-[0.2em]">
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
