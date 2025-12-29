'use client';

import React, { useState, useEffect } from 'react';
import Container from '@/components/ui/Container';
import { fetchCallReadOnlyFunction, cvToJSON, uintCV, standardPrincipalCV } from '@stacks/transactions';
import { NETWORK, CONTRACT_ADDRESS, CONTRACTS, IS_MAINNET } from '@/lib/constants';
import { userSession } from '@/components/ConnectWallet';

export default function LeaderboardContent() {
    const [userXP, setUserXP] = useState<number>(0);
    const [userBadges, setUserBadges] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(true);
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
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [userAddress]);

    const legends = [
        { rank: 1, name: 'satoshi.btc', xp: 12500, badges: 12 },
        { rank: 2, name: 'clarity_king.stx', xp: 9800, badges: 8 },
        { rank: 3, name: 'web3_wizard.btc', xp: 8750, badges: 7 },
    ];

    return (
        <main className="min-h-screen bg-transparent text-stacks-black pb-40">
            {/* Header */}
            <div className="pt-32 pb-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-[#FF4B12]/5 mix-blend-multiply"></div>
                <Container className="relative z-10">
                    <h1 className="text-7xl md:text-[10rem] font-serif text-black mb-10 tracking-tighter leading-[0.8] italic">
                        The <br />
                        <span className="text-[#FF4B12] not-italic">Ranks.</span>
                    </h1>
                    <p className="text-2xl md:text-3xl text-black/80 font-sans font-semibold leading-tight max-w-2xl tracking-tight">
                        Ranking is determined by XP earned through rigorous smart contract validation on Bitcoin.
                    </p>
                </Container>
            </div>

            <Container className="py-20">
                <div className="bg-white/70 backdrop-blur-2xl border-[0.5px] border-black/10 rounded-3xl overflow-hidden shadow-2xl shadow-black/5">
                    {/* Header */}
                    <div className="grid grid-cols-12 gap-4 px-10 py-6 bg-stacks-grey/50 border-b border-stacks-black/5 text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-stacks-black/30">
                        <div className="col-span-2">Rank</div>
                        <div className="col-span-6">Architect</div>
                        <div className="col-span-2 text-right">Badges</div>
                        <div className="col-span-2 text-right">XP</div>
                    </div>

                    {/* Legendary Rows */}
                    {legends.map((leader) => (
                        <div key={leader.rank} className="grid grid-cols-12 gap-4 px-10 py-8 border-b-[0.5px] border-black/5 items-center hover:bg-white transition-all duration-500 group">
                            <div className="col-span-2 font-serif text-4xl text-[#FF4B12]/40 group-hover:text-[#FF4B12] transition-colors">
                                #{leader.rank}
                            </div>
                            <div className="col-span-6 flex flex-col">
                                <span className="font-sans font-bold text-lg text-black">
                                    {leader.name}
                                </span>
                                <span className="text-[10px] text-[#FF4B12] font-bold font-sans uppercase tracking-widest mt-1">LEGENDARY ARCHITECT</span>
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
                        <div className="grid grid-cols-12 gap-4 px-10 py-12 bg-[#FF4B12]/[0.03] items-center border-l-8 border-l-[#FF4B12] relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <span className="font-serif italic text-6xl text-[#FF4B12]">YOU</span>
                            </div>
                            <div className="col-span-2 flex flex-col">
                                <span className="font-serif text-5xl text-[#FF4B12] leading-none tracking-tighter">
                                    {isLoading ? '-' : 'NEW'}
                                </span>
                                <span className="text-[8px] font-sans font-bold uppercase text-[#FF4B12]/60 mt-2 tracking-widest">Global Rank</span>
                            </div>
                            <div className="col-span-6 flex flex-col">
                                <span className="font-sans font-bold text-xl text-black truncate max-w-[200px] md:max-w-none">
                                    {userAddress}
                                </span>
                                <span className="text-[10px] text-[#FF4B12] font-bold font-sans uppercase tracking-[0.2em] mt-2">
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
                        <div className="p-20 text-center border-t border-stacks-black/5 bg-stacks-grey/20">
                            <p className="text-stacks-black/40 font-sans font-bold text-[10px] uppercase tracking-[0.3em] animate-pulse">
                                [ Connect Wallet to synchronize ranking ]
                            </p>
                        </div>
                    )}
                </div>
            </Container>
        </main>
    );
}
