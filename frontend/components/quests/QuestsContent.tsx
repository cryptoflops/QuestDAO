'use client';

import { useState, useEffect } from 'react';
import {
    fetchCallReadOnlyFunction,
    cvToJSON,
    uintCV,
    standardPrincipalCV,
    contractPrincipalCV,
    boolCV,
    stringAsciiCV,
    PostConditionMode,
    bufferCV,
    hexToBytes
} from '@/lib/stacks';
import { NETWORK, CONTRACT_ADDRESS, CONTRACTS, IS_MAINNET, API_URL } from '@/lib/constants';
import { userSession } from '@/lib/stacks-session';
import Container from '@/components/ui/Container';
import QuestGrid from '@/components/QuestGrid';
import QuestCard, { QuestCardProps } from '@/components/QuestCard';
import * as StacksConnect from '@/lib/stacks';
import QuestModal from './QuestModal';
import { QUESTS_LEARNING_DATA } from '@/lib/quests.data';

export default function QuestsContent() {
    const [quests, setQuests] = useState<QuestCardProps[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [refreshCount, setRefreshCount] = useState(0);
    const [blockHeight, setBlockHeight] = useState<number>(0);
    const [hasMounted, setHasMounted] = useState(false);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedQuestId, setSelectedQuestId] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [userXP, setUserXP] = useState(0);

    const CONTRACT_NAME = CONTRACTS.REGISTRY;

    // Safety check for userSession
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

    // 1. Block Height Listener & Auto-Refresh
    useEffect(() => {
        const fetchBlockHeight = async () => {
            try {
                const response = await fetch(`${API_URL}/v2/info`);
                const data = await response.json();
                const newHeight = data.stacks_tip_height;
                if (newHeight !== blockHeight) {
                    setBlockHeight(newHeight);
                    if (blockHeight !== 0) {
                        setRefreshCount(prev => prev + 1);
                    }
                }
            } catch (e) {
                console.error("Failed to fetch block height", e);
            }
        };
        fetchBlockHeight();
        const interval = setInterval(fetchBlockHeight, 30000);
        return () => clearInterval(interval);
    }, [blockHeight]);

    const checkAuth = async () => {
        try {
            const authResult = await fetchCallReadOnlyFunction({
                contractAddress: CONTRACT_ADDRESS,
                contractName: 'soulbound-badge-v2',
                functionName: 'is-authorized',
                functionArgs: [contractPrincipalCV(CONTRACT_ADDRESS, CONTRACT_NAME)],
                network: NETWORK,
                senderAddress: CONTRACT_ADDRESS
            });
            setIsAuthorized(cvToJSON(authResult).value);
        } catch (e) {
            console.error("Auth check failed", e);
        }
    };

    useEffect(() => {
        const fetchQuests = async () => {
            setIsLoading(true);
            const network = NETWORK;

            try {
                const countResult = await fetchCallReadOnlyFunction({
                    contractAddress: CONTRACT_ADDRESS,
                    contractName: CONTRACT_NAME,
                    functionName: 'get-last-quest-id',
                    functionArgs: [],
                    network,
                    senderAddress: CONTRACT_ADDRESS
                });

                const countVal = cvToJSON(countResult).value;
                const count = typeof countVal === 'string' ? parseInt(countVal) : parseInt(countVal.value);

                const list: QuestCardProps[] = [];

                for (let i = 1; i <= count; i++) {
                    const questResult = await fetchCallReadOnlyFunction({
                        contractAddress: CONTRACT_ADDRESS,
                        contractName: CONTRACT_NAME,
                        functionName: 'get-quest',
                        functionArgs: [uintCV(BigInt(i))],
                        network,
                        senderAddress: CONTRACT_ADDRESS
                    });

                    const qData = cvToJSON(questResult).value?.value;
                    if (!qData) continue;

                    let isCompleted = false;
                    let uXP = 0;

                    if (userAddress) {
                        const progressResult = await fetchCallReadOnlyFunction({
                            contractAddress: CONTRACT_ADDRESS,
                            contractName: CONTRACT_NAME,
                            functionName: 'has-completed',
                            functionArgs: [standardPrincipalCV(userAddress), uintCV(BigInt(i))],
                            network,
                            senderAddress: CONTRACT_ADDRESS
                        });
                        isCompleted = cvToJSON(progressResult).value;

                        // Fetch User XP once
                        if (i === 1) {
                            const xpResult = await fetchCallReadOnlyFunction({
                                contractAddress: CONTRACT_ADDRESS,
                                contractName: CONTRACT_NAME,
                                functionName: 'get-user-xp',
                                functionArgs: [standardPrincipalCV(userAddress)],
                                network,
                                senderAddress: CONTRACT_ADDRESS
                            });
                            const xpVal = cvToJSON(xpResult).value;
                            uXP = typeof xpVal === 'string' ? parseInt(xpVal) : parseInt(xpVal.value);
                            setUserXP(uXP);
                        }
                    }

                    list.push({
                        id: i.toString(),
                        title: qData.title.value,
                        description: `A module covering ${qData.title.value}. Complete to earn XP and your Soulbound Badge.`,
                        difficulty: i === 1 ? 'Beginner' : i < 4 ? 'Intermediate' : 'Wizard',
                        reward: qData['xp-reward'].value,
                        status: isCompleted ? 'completed' : 'available'
                    });
                }
                setQuests(list);
                await checkAuth();
            } catch (e) {
                console.error("Failed to fetch quests", e);
            } finally {
                setIsLoading(false);
            }
        };

        fetchQuests();
    }, [refreshCount, userAddress]);

    const handleBeginQuest = (id: string) => {
        setSelectedQuestId(id);
        setIsModalOpen(true);
    };

    const handleCompleteQuest = async (proof: string) => {
        if (!selectedQuestId) return;
        setIsProcessing(true);

        const idNum = parseInt(selectedQuestId);
        const sc = StacksConnect as any;

        if (!userSession.isUserSignedIn()) {
            alert("Please connect your wallet first.");
            setIsProcessing(false);
            return;
        }

        const isIdentity = learningData?.type === 'identity';

        // Helper to parse BNS name
        const parseBNS = (full: string) => {
            const parts = full.split('.');
            return {
                name: parts[0] || '',
                namespace: parts[1] || ''
            };
        };

        const options = {
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACTS.REGISTRY,
            functionName: isIdentity ? 'claim-bns-quest' : 'complete-quest',
            functionArgs: isIdentity ? [
                uintCV(BigInt(idNum)),
                bufferCV(new TextEncoder().encode(parseBNS(proof).name)),
                bufferCV(new TextEncoder().encode(parseBNS(proof).namespace))
            ] : [
                uintCV(BigInt(idNum)),
                bufferCV(new TextEncoder().encode(proof.trim().toLowerCase()))
            ],
            postConditionMode: PostConditionMode.Allow,
            network: NETWORK,
            appDetails: {
                name: 'QuestDAO',
                icon: window.location.origin + '/logo.png',
            },
            onFinish: (data: any) => {
                console.log('Quest Completed:', data);
                setIsProcessing(false);
                setIsModalOpen(false);
                setRefreshCount(prev => prev + 1);
            },
            onCancel: () => {
                setIsProcessing(false);
            }
        };

        if (typeof sc.openContractCall === 'function') {
            sc.openContractCall(options);
        } else {
            console.error('openContractCall not found');
            setIsProcessing(false);
        }
    };

    const selectedQuestData = selectedQuestId ? quests.find(q => q.id === selectedQuestId) : null;
    const learningData = selectedQuestId ? QUESTS_LEARNING_DATA[parseInt(selectedQuestId)] : null;

    const checkRequirements = () => {
        if (!selectedQuestId || !learningData || !userAddress) return false;

        const id = parseInt(selectedQuestId);

        if (id === 1) {
            // Quest 1: BNS Name requirement
            // We can check if the user balance of names is > 0, but for now we look if they are signed in
            return !!userAddress;
        }

        if (id === 2) {
            return quests.find(q => q.id === "1")?.status === 'completed';
        }

        if (id === 3) {
            return quests.find(q => q.id === "2")?.status === 'completed';
        }

        if (id === 4) {
            return (quests.find(q => q.id === "3")?.status === 'completed') && (userXP >= 350);
        }

        return true;
    };

    const canComplete = checkRequirements();

    const getGridSpan = (index: number) => {
        const pattern = [
            'md:col-span-8',
            'md:col-span-4',
            'md:col-span-6',
            'md:col-span-6',
            'md:col-span-12'
        ];
        return pattern[index % pattern.length];
    };

    return (
        <>
            {/* Header */}
            <div className="pt-32 pb-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-stacks-orange/5 mix-blend-multiply"></div>
                <Container className="relative z-10">
                    <h1 className="text-7xl md:text-[10rem] font-serif text-black mb-10 tracking-tighter leading-[0.8] italic">
                        The <br />
                        <span className="text-[#FF4B12] not-italic">Curriculum.</span>
                    </h1>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                        <p className="md:col-span-8 text-2xl md:text-3xl text-stacks-black/80 font-sans font-semibold leading-tight max-w-2xl tracking-tight">
                            Master the architecture of Bitcoin layers. <br />
                            Complete modules to earn XP and Soulbound Badges.
                        </p>
                    </div>
                </Container>
            </div>

            {/* Grid */}
            <div className="py-20 relative px-6 md:px-0">
                <QuestGrid>
                    {isLoading ? (
                        <div className="col-span-12 p-40 text-center text-stacks-black/40 font-sans font-bold uppercase tracking-[0.3em] animate-pulse">
                            Loading Academy Data...
                        </div>
                    ) : quests.length === 0 ? (
                        <div className="col-span-12 p-40 text-center text-stacks-black/40 font-sans font-bold uppercase tracking-[0.3em]">
                            End of Records.
                        </div>
                    ) : (
                        quests.map((quest, index) => (
                            <div key={quest.id} className={`col-span-12 ${getGridSpan(index)}`}>
                                <QuestCard
                                    {...quest}
                                    onBegin={handleBeginQuest}
                                />
                            </div>
                        ))
                    )}
                </QuestGrid>
            </div>

            {/* Protocol Management (Temporary Dev Tools) */}
            {hasMounted && (
                <div className="py-24 border-t-[0.5px] border-black/10 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/[0.02]" />
                    <Container className="relative z-10">
                        <div className="bg-white/70 backdrop-blur-2xl p-12 rounded-[2.5rem] border-[0.5px] border-black/10 shadow-2xl shadow-black/5">
                            <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
                                <div>
                                    <h4 className="font-serif text-4xl text-black italic tracking-tighter">The Architect's Tools</h4>
                                    <p className="text-black/50 text-lg max-w-xl font-sans mt-4">
                                        Registry authorization required for the minting of Soulbound Badges.
                                    </p>
                                </div>
                                <div className="flex items-center gap-3 px-5 py-2 bg-[#F5F5F7] rounded-full border-[0.5px] border-black/10">
                                    <div className={`w-2 h-2 rounded-full ${isAuthorized ? 'bg-green-500' : 'bg-[#FF4B12] animate-pulse'}`}></div>
                                    <span className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-black/60">
                                        Link {isAuthorized ? 'Active' : 'Offline'}
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-6">
                                <button
                                    onClick={async () => {
                                        const sc = StacksConnect as any;
                                        sc.openContractCall({
                                            contractAddress: CONTRACT_ADDRESS,
                                            contractName: 'soulbound-badge-v2',
                                            functionName: 'set-authorized',
                                            functionArgs: [
                                                contractPrincipalCV(CONTRACT_ADDRESS, CONTRACTS.REGISTRY),
                                                boolCV(true)
                                            ],
                                            postConditionMode: PostConditionMode.Allow,
                                            network: NETWORK,
                                            appDetails: {
                                                name: 'QuestDAO Architect',
                                                icon: window.location.origin + '/logo.png',
                                            },
                                            onFinish: (data: any) => console.log('Registry V4 Authorized:', data)
                                        });
                                    }}
                                    className="group relative px-8 py-4 bg-black text-white rounded-full font-sans font-bold text-[10px] uppercase tracking-[0.2em] overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-lg"
                                >
                                    <span className="relative z-10">1. Authorize Registry V4</span>
                                    <div className="absolute inset-0 bg-[#FF4B12] translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                </button>

                                <button
                                    onClick={async () => {
                                        const curriculum = [
                                            { title: "Clarity Fundamentals", xp: 100, fee: 100000, hash: "ea6ad5037a5b193695c6a21d05145683584850c8e64ccd21a31e546fc05f7089" },
                                            { title: "Smart Contract Safety", xp: 250, fee: 200000, hash: "939b1976d4ab93c672610bf736d583ee2f630d365705b1a4813e4b5dc8ef6962" },
                                            { title: "SIP-009 NFT Mastery", xp: 500, fee: 500000, hash: "b8cc5a06fb3b0fc8d54505e891cab710d9220d2c47cc67bc3a4b2e9df53bb7dd" },
                                            { title: "DAO Architect Suite", xp: 1000, fee: 1000000, hash: "7f66aa19767c0461cbf7cb755b8e222e0de892f243854d9fbbc627395828033f" },
                                            { title: "BNS Identity Verification", xp: 300, fee: 50000, hash: "0000000000000000000000000000000000000000000000000000000000000000" } // Identity quests don't use hash logic but signature needs it
                                        ];

                                        const nextIdx = quests.length;
                                        const questToSeed = curriculum[nextIdx] || { title: `Advanced Module ${nextIdx + 1}`, xp: 1500, fee: 2000000, hash: "0000000000000000000000000000000000000000000000000000000000000000" };

                                        const sc = StacksConnect as any;
                                        console.log('Seeding questToSeed:', questToSeed);

                                        sc.openContractCall({
                                            contractAddress: CONTRACT_ADDRESS,
                                            contractName: CONTRACTS.REGISTRY,
                                            functionName: 'create-quest',
                                            functionArgs: [
                                                stringAsciiCV(questToSeed.title),
                                                uintCV(BigInt(questToSeed.xp)),
                                                uintCV(BigInt(questToSeed.fee)),
                                                bufferCV(hexToBytes(questToSeed.hash))
                                            ],
                                            postConditionMode: PostConditionMode.Allow,
                                            network: NETWORK,
                                            appDetails: {
                                                name: 'QuestDAO Architect',
                                                icon: window.location.origin + '/logo.png',
                                            },
                                            onFinish: (data: any) => console.log('Quest Seeded:', data)
                                        });
                                    }}
                                    className="group relative px-8 py-4 bg-black text-white rounded-full font-sans font-bold text-[10px] uppercase tracking-[0.2em] overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-lg"
                                >
                                    <span className="relative z-10">2. Seed Next Curriculum Quest ({quests.length + 1})</span>
                                    <div className="absolute inset-0 bg-[#FF4B12] translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                </button>
                            </div>
                        </div>
                    </Container>
                </div>
            )}

            <QuestModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                content={learningData || null}
                onComplete={handleCompleteQuest}
                isProcessing={isProcessing}
                title={selectedQuestData?.title || ''}
                canComplete={canComplete}
            />
        </>
    );
}
