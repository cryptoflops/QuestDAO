'use client';

import { AppKitProvider as ReownAppKit, createAppKit } from '@reown/appkit/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { STACKS_MOCKNET, STACKS_TESTNET, STACKS_MAINNET } from '@stacks/network';
import { mainnet } from '@reown/appkit/networks';

// 1. Get projectId at https://cloud.reown.com
const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || 'ad6eb7e430d2520405cc22b11451e738';

// 2. Create a metadata object
const metadata = {
    name: 'QuestDAO',
    description: 'Cyber-Scholastic Educational Platform',
    url: 'https://questdao.stack', // origin must match your domain & subdomain
    icons: ['https://avatars.githubusercontent.com/u/37784886']
}

// 3. Create the AppKit instance (Optional - only if valid ID is provided)
if (projectId && projectId !== 'YOUR_PROJECT_ID') {
    try {
        createAppKit({
            networks: [mainnet],
            projectId,
            metadata,
            features: {
                analytics: true
            }
        });
    } catch (e) {
        console.warn('AppKit initialization failed:', e);
    }
}

// 4. Create QueryClient
const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}
