'use client';

import { createAppKit } from '@reown/appkit/react';
import { mainnet } from '@reown/appkit/networks';
import { useEffect } from 'react';

const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || 'ad6eb7e430d2520405cc22b11451e738';

const metadata = {
    name: 'QuestDAO',
    description: 'Reputation-based Education Protocol',
    url: typeof window !== 'undefined' ? window.location.origin : 'https://questdao.stack',
    icons: ['https://avatars.githubusercontent.com/u/37784886']
};

let appKitInitialized = false;

export default function AppKitInitializer() {
    useEffect(() => {
        if (!appKitInitialized && projectId && projectId !== 'YOUR_PROJECT_ID') {
            try {
                createAppKit({
                    networks: [mainnet],
                    projectId,
                    metadata,
                    features: {
                        analytics: true
                    }
                });
                appKitInitialized = true;
            } catch (e) {
                console.warn('AppKit initialization failed:', e);
            }
        }
    }, []);

    return null;
}
