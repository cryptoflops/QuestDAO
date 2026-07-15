'use client';

import React, { useState, useEffect } from 'react';
import Container from '@/components/ui/Container';
import PageHero from '@/components/PageHero';
import { fetchCallReadOnlyFunction, cvToJSON, uintCV, standardPrincipalCV } from '@/lib/stacks';
import { NETWORK, CONTRACT_ADDRESS, CONTRACTS, IS_MAINNET } from '@/lib/constants';
import { userSession } from '@/lib/stacks-session';
import { defaultResolver } from '@/lib/bns-resolver';

export default function LeaderboardContent() {
    const [userXP, setUserXP] = useState<number>(0);
    const [userBadges, setUserBadges] = useState<number>(0);
    const [userBnsName, setUserBnsName] = useState<string | null>(null);
    const [isBnsLoading, setIsBnsLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [hasMounted, setHasMounted] = useState(false);

    const REGISTRY_NAME = CONTRACTS.REGISTRY;

    const getUserAddress = () => {
        if (typeof window !== 'undefined' && userSession.isUserSignedIn()) {
            return userSession.loadUserData().profile.stxAddress[IS_MAINNET ? 'mainnet' : 'testnet'];
        }
        return null;
    };
    const userAddress = getUserAddress();

    useEffect(() => {
        setHasMounted(true);
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            if (typeof window === 'undefined' || !userSession.isUserSignedIn()) {
                setIsLoading(false);
                return;
            }

            const network = NETWORK;

            try {
                setError(null);
                const countResult = await fetchCallReadOnlyFunction({
                    contractAddress: CONTRACT_ADDRESS,
                    contractName: REGISTRY_NAME,
                    functionName: 'get-last-quest-id',
                    functionArgs: [],
                    network,
                    senderAddress: CONTRACT_ADDRESS
                });
                const countVal = cvToJSON(countResult).value;
                const count = typeof countVal === 'string' ? parseInt(countVal) : parseInt(countVal.value);

                let totalXP = 0;
                let totalBadges = 0;

                for (let i = 1; i <= count; i++) {
                    const progressResult = await fetchCallReadOnlyFunction({
                        contractAddress: CONTRACT_ADDRESS,
                        contractName: REGISTRY_NAME,
                        functionName: 'has-completed',
                        functionArgs: [standardPrincipalCV(userAddress!), uintCV(i)],
                        network,
                        senderAddress: CONTRACT_ADDRESS
                    });

                    if (cvToJSON(progressResult).value === true) {
                        const questResult = await fetchCallReadOnlyFunction({
                            contractAddress: CONTRACT_ADDRESS,
                            contractName: REGISTRY_NAME,
                            functionName: 'get-quest',
                            functionArgs: [uintCV(i)],
                            network,
                            senderAddress: CONTRACT_ADDRESS
                        });
                        const qData = cvToJSON(questResult).value?.value;
                        if (qData) {
                            totalXP += parseInt(qData['xp-reward'].value);
                            totalBadges += 1;
                        }
                    }
                }

                setUserXP(totalXP);
                setUserBadges(totalBadges);
            } catch (e) {
                console.error("Failed to fetch leaderboard data", e);
                setError("Failed to load leaderboard data. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
        if (userAddress) {
            setIsBnsLoading(true);
            defaultResolver.resolveName(userAddress).then(name => {
                setUserBnsName(name);
                setIsBnsLoading(false);
            });
        }
    }, [userAddress]);

    const legends = [
        { rank: 1, name: 'satoshi.btc', xp: 12500, badges: 12 },
        { rank: 2, name: 'clarity_king.stx', xp: 9800, badges: 8 },
        { rank: 3, name: 'web3_wizard.btc', xp: 8750, badges: 7 },
    ];

    return (
        <main id="main-content" className="min-h-dvh bg-transparent text-foreground pb-40">
            {/* Header */}
            <PageHero
                title="The"
                accent="Ranks."
                subtitle="Ranking is determined by XP earned through rigorous smart contract validation on Bitcoin."
            />

            <Container className="py-20">
                {error ? (
                    <div className="glass-card p-6 text-center text-red-500">
                        <p className="font-sans font-bold text-sm mb-4">{error}</p>
                        <button
                            onClick={() => { setError(null); }}
                            className="px-6 py-2 bg-primary text-white rounded-full font-sans font-bold text-xs uppercase tracking-[0.2em] hover:bg-primary/90 transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                ) : (
                <div className="bg-white/90 backdrop-blur-2xl border border-black/5 rounded-2xl overflow-hidden shadow-sm">
                    {/* Header */}
                    <div className="grid grid-cols-12 gap-4 px-10 py-6 bg-stacks-grey/50 border-b border-stacks-black/5 text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-stacks-black/60">
                        <div className="col-span-2">Rank</div>
                        <div className="col-span-6">Architect</div>
                        <div className="col-span-2 text-right">Badges</div>
                        <div className="col-span-2 text-right">XP</div>
                    </div>

                    {/* Legendary Rows */}
                    {legends.map((leader) => (
                        <div key={leader.rank} className="grid grid-cols-12 gap-4 px-10 py-8 border-b-[0.5px] border-black/5 items-center hover:bg-white transition-all duration-300 group">
                            <div className="col-span-2 font-serif text-4xl text-primary/40 group-hover:text-primary transition-colors">
                                #{leader.rank}
                            </div>
                            <div className="col-span-6 flex flex-col">
                                <span className="font-sans font-bold text-lg text-black">
                                    {leader.name}
                                </span>
                                <span className="text-[10px] text-primary font-bold font-sans uppercase tracking-widest mt-1">LEGENDARY ARCHITECT</span>
                            </div>
                            <div className="col-span-2 text-right font-sans font-bold text-black/60">
                                {leader.badges}
                            </div>
                            <div className="col-span-2 text-right font-sans font-bold text-black">
                                {leader.xp.toLocaleString()}
                            </div>
                        </div>
                    ))}

                    {/* User's Real Row */}
                    {hasMounted && userAddress && (
                        <div className="grid grid-cols-12 gap-4 px-10 py-12 bg-primary/[0.03] items-center border-l-8 border-l-primary relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <span className="font-serif italic text-6xl text-primary">YOU</span>
                            </div>
                            <div className="col-span-2 flex flex-col">
                                <span className="font-serif text-5xl text-primary leading-none tracking-tighter">
                                    {isLoading ? '-' : 'NEW'}
                                </span>
                                <span className="text-[8px] font-sans font-bold uppercase text-primary/60 mt-2 tracking-widest">Global Rank</span>
                            </div>
                            <div className="col-span-6 flex flex-col">
                                <span className="font-sans font-bold text-xl text-black truncate max-w-[200px] md:max-w-none">
                                    {isBnsLoading ? (
                                        <span className="inline-block w-32 h-4 bg-stacks-black/10 rounded animate-pulse" />
                                    ) : (
                                        userBnsName ?? userAddress
                                    )}
                                </span>
                                <span className="text-[10px] text-primary font-bold font-sans uppercase tracking-[0.2em] mt-2">
                                    ACTIVE ARCHITECT
                                </span>
                            </div>
                            <div className="col-span-2 text-right font-sans font-bold text-2xl text-black/80">
                                {isLoading ? '...' : userBadges}
                            </div>
                            <div className="col-span-2 text-right font-sans font-bold text-2xl text-black">
                                {isLoading ? '...' : userXP.toLocaleString()}
                            </div>
                        </div>
                    )}

                    {hasMounted && !userAddress && (
                        <div className="p-20 text-center border-t border-stacks-black/5 bg-stacks-grey/20 space-y-4">
                            <p className="text-stacks-black/60 font-sans font-bold text-[10px] uppercase tracking-[0.3em] animate-pulse">
                                [ Connect Wallet to synchronize ranking ]
                            </p>
                            <p className="text-stacks-black/60 font-sans text-xs">
                                Use the wallet button in the top navigation to join the ranks.
                            </p>
                        </div>
                    )}
                </div>
                )}
            </Container>
        </main>
    );
}
