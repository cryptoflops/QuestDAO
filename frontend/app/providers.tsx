'use client';

import { AppKitProvider as ReownAppKit, createAppKit } from '@reown/appkit/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useEffect } from 'react';
import { mainnet } from '@reown/appkit/networks';
import dynamic from 'next/dynamic';

const WebGLBackground = dynamic(() => import('@/components/ui/WebGLBackground'), { ssr: false });

// 1. Get projectId at https://cloud.reown.com
const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || 'ad6eb7e430d2520405cc22b11451e738';

// 2. Create a metadata object
const metadata = {
    name: 'QuestDAO',
    description: 'Reputation-based Education Protocol',
    url: typeof window !== 'undefined' ? window.location.origin : 'https://questdao.stack',
    icons: ['https://avatars.githubusercontent.com/u/37784886']
}

// 4. Create QueryClient
const queryClient = new QueryClient();

let appKitInitialized = false;

export function Providers({ children }: { children: ReactNode }) {
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

    return (
        <QueryClientProvider client={queryClient}>
            <WebGLBackground />
            {children}
        </QueryClientProvider>
    );
}
