'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import dynamic from 'next/dynamic';

const WebGLBackground = dynamic(() => import('@/components/ui/WebGLBackground'), { ssr: false });
const AppKitInitializer = dynamic(() => import('@/components/AppKitInitializer'), { ssr: false });

// 4. Create QueryClient
const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <AppKitInitializer />
            <WebGLBackground />
            {children}
        </QueryClientProvider>
    );
}
