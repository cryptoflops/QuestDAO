'use client';

import dynamic from 'next/dynamic';

const QuestsContent = dynamic(() => import('@/components/quests/QuestsContent'), {
    ssr: false,
    loading: () => (
        <div className="min-h-screen bg-transparent flex items-center justify-center">
            <div className="text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-stacks-black/40 animate-pulse">
                Unrolling Academy Scrolls...
            </div>
        </div>
    )
});

export default function QuestsPage() {
    return <QuestsContent />;
}
