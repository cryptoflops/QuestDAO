'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import dynamic from 'next/dynamic';

const WebGLBackground = dynamic(() => import('@/components/ui/WebGLBackground'), { ssr: false });
const AppKitInitializer = dynamic(() => import('@/components/AppKitInitializer'), { ssr: false });
const Navbar = dynamic(() => import('@/components/Navbar'), { ssr: false });
const MobileNav = dynamic(() => import('@/components/MobileNav'), { ssr: false });

// 4. Create QueryClient
const queryClient = new QueryClient();

// Add polyfills for Web3 libraries
if (typeof window !== 'undefined') {
    (window as any).global = window;
    if (!(window as any).Buffer) {
        import('buffer').then(({ Buffer }) => {
            (window as any).Buffer = Buffer;
        });
    }
}

export function Providers({ children }: { children: ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <AppKitInitializer />
            <WebGLBackground />
            <Navbar />
            {children}
            <MobileNav />
        </QueryClientProvider>
    );
}
