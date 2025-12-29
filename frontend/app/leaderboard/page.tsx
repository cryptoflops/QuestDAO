'use client';

import dynamic from 'next/dynamic';

const LeaderboardContent = dynamic(() => import('@/components/leaderboard/LeaderboardContent'), {
    ssr: false,
    loading: () => (
        <div className="min-h-screen bg-transparent flex items-center justify-center">
            <div className="text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-stacks-black/40 animate-pulse">
                Consulting the Great Ledger...
            </div>
        </div>
    )
});

export default function LeaderboardPage() {
    return <LeaderboardContent />;
}
