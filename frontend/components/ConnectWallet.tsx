'use client';

import * as StacksConnect from '@stacks/connect';
import { AppConfig, UserSession } from '@stacks/connect';
import { useState, useEffect } from 'react';
import { IS_MAINNET } from '@/lib/constants';

// SSR-safe UserSession initialization
const appConfig = new AppConfig(['store_write', 'publish_data']);
export const userSession = typeof window !== 'undefined'
    ? new UserSession({ appConfig })
    : { isUserSignedIn: () => false, signUserOut: () => { }, loadUserData: () => ({ profile: { stxAddress: {} } }) } as any;

export default function ConnectWallet() {
    const [mounted, setMounted] = useState(false);
    const [address, setAddress] = useState<string | null>(null);

    useEffect(() => {
        setMounted(true);
        if (userSession.isUserSignedIn()) {
            setAddress(userSession.loadUserData().profile.stxAddress[IS_MAINNET ? 'mainnet' : 'testnet']);
        }
    }, []);

    const handleConnect = () => {
        const options = {
            appDetails: {
                name: 'QuestDAO',
                icon: window.location.origin + '/logo.png',
            },
            redirectTo: '/',
            onFinish: () => {
                setAddress(userSession.loadUserData().profile.stxAddress[IS_MAINNET ? 'mainnet' : 'testnet']);
            },
            userSession: userSession,
        };

        if (typeof StacksConnect.showConnect === 'function') {
            StacksConnect.showConnect(options);
        } else if (typeof StacksConnect.authenticate === 'function') {
            console.log('Falling back to authenticate');
            StacksConnect.authenticate(options);
        } else {
            console.error('No connect method found in @stacks/connect');
        }
    };

    const handleDisconnect = () => {
        userSession.signUserOut();
        setAddress(null);
    };

    if (!mounted) return null;

    if (address) {
        return (
            <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                    <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-stacks-black/20">Active</span>
                    <span className="text-[12px] font-bold text-stacks-black font-sans">
                        {address.slice(0, 6)}...{address.slice(-4)}
                    </span>
                </div>
                <button
                    onClick={handleDisconnect}
                    className="w-10 h-10 rounded-full bg-stacks-grey border border-stacks-black/5 flex items-center justify-center hover:bg-stacks-orange hover:text-white transition-all duration-300"
                    title="Sign Out"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={handleConnect}
            className="px-8 py-3 bg-primary text-white font-sans text-[12px] font-bold uppercase tracking-[0.2em] hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/20 transition-all duration-300 rounded-full"
        >
            Connect Wallet
        </button>
    );
}
