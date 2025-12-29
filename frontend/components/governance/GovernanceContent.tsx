'use client';

import { useState, useEffect } from 'react';
import Container from '@/components/ui/Container';
import ProposalRow, { ProposalRowProps } from '@/components/ProposalRow';
import Button from '@/components/ui/Button';
import CreateProposalModal from '@/components/CreateProposalModal';
import DelegateModal from '@/components/DelegateModal';
import { fetchCallReadOnlyFunction, cvToJSON, uintCV } from '@stacks/transactions';
import { NETWORK, CONTRACT_ADDRESS, CONTRACTS, API_URL } from '@/lib/constants';

export default function GovernanceContent() {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isDelegateOpen, setIsDelegateOpen] = useState(false);
    const [proposals, setProposals] = useState<ProposalRowProps[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshCount, setRefreshCount] = useState(0);
    const [blockHeight, setBlockHeight] = useState<number>(0);

    const CONTRACT_NAME = CONTRACTS.VOTING;

    // 1. Block Height Listener & Auto-Refresh
    useEffect(() => {
        const fetchBlockHeight = async () => {
            try {
                const response = await fetch(`${API_URL}/v2/info`);
                const data = await response.json();
                const newHeight = data.stacks_tip_height;
                if (newHeight !== blockHeight) {
                    console.log(`[Nodes] New block detected: ${newHeight}`);
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
        const interval = setInterval(fetchBlockHeight, 30000); // 30s polling
        return () => clearInterval(interval);
    }, [blockHeight]);

    // 2. Proposal Fetcher
    useEffect(() => {
        const fetchProposals = async () => {
            setIsLoading(true);
            const network = NETWORK;

            try {
                const countResult = await fetchCallReadOnlyFunction({
                    contractAddress: CONTRACT_ADDRESS,
                    contractName: CONTRACT_NAME,
                    functionName: 'get-last-proposal-id',
                    functionArgs: [],
                    network,
                    senderAddress: CONTRACT_ADDRESS
                });

                const countVal = cvToJSON(countResult).value;
                const count = typeof countVal === 'string' ? parseInt(countVal) : parseInt(countVal.value);

                const newProposals: ProposalRowProps[] = [];

                for (let i = count; i >= 1; i--) {
                    const propResult = await fetchCallReadOnlyFunction({
                        contractAddress: CONTRACT_ADDRESS,
                        contractName: CONTRACT_NAME,
                        functionName: 'get-proposal',
                        functionArgs: [uintCV(i)],
                        network,
                        senderAddress: CONTRACT_ADDRESS
                    });

                    const json = cvToJSON(propResult);
                    const propData = json.value?.value;

                    if (propData) {
                        newProposals.push({
                            id: i.toString(),
                            title: propData.title.value,
                            votesFor: parseInt(propData['yes-votes'].value),
                            votesAgainst: parseInt(propData['no-votes'].value),
                            votesAbstain: parseInt(propData['abstain-votes'].value),
                            endDate: `Block ${propData['end-block'].value}`,
                            status: 'active'
                        });
                    }
                }
                setProposals(newProposals);

            } catch (e) {
                console.error("Failed to fetch proposals", e);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProposals();
    }, [refreshCount]);

    return (
        <>
            {/* Header */}
            <div className="pt-32 pb-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-[#FF4B12]/5 mix-blend-multiply"></div>
                <Container className="relative z-10">
                    <h1 className="text-7xl md:text-[10rem] font-serif text-black mb-10 tracking-tighter leading-[0.8] italic">
                        The <br />
                        <span className="text-[#FF4B12] not-italic">Council.</span>
                    </h1>
                    <p className="text-2xl md:text-3xl text-black/80 font-sans font-semibold mb-16 leading-tight max-w-2xl tracking-tight">
                        Governance is restricted to certified members. <br />
                        Decisions made here are executed on-chain.
                    </p>

                    <div className="flex flex-col md:flex-row gap-6">
                        <Button
                            variant="signature"
                            size="lg"
                            className="px-12"
                            onClick={() => setIsCreateOpen(true)}
                        >
                            Submit Proposal
                        </Button>

                        <Button
                            variant="ghost"
                            size="lg"
                            className="px-12 bg-white/60 backdrop-blur-md border border-border hover:bg-white/90"
                            onClick={() => setIsDelegateOpen(true)}
                        >
                            Delegate Votes
                        </Button>
                    </div>
                </Container>
            </div>

            <CreateProposalModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
            <DelegateModal isOpen={isDelegateOpen} onClose={() => setIsDelegateOpen(false)} />

            {/* Ledger */}
            <div className="py-20 relative">
                <Container>
                    <div className="flex items-center justify-between mb-12">
                        <div className="flex items-center gap-6">
                            <h2 className="text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-stacks-black/40">
                                Active Docket
                            </h2>
                            <button
                                onClick={() => setRefreshCount(prev => prev + 1)}
                                className="text-[10px] font-sans font-bold text-stacks-orange hover:underline uppercase tracking-[0.2em]"
                                disabled={isLoading}
                            >
                                {isLoading ? '[ Syncing... ]' : '[ Refresh ]'}
                            </button>
                        </div>
                        <span className="text-[10px] font-sans font-bold text-stacks-black/20 uppercase tracking-widest">
                            Block Height: {blockHeight || 'Syncing...'}
                        </span>
                    </div>

                    <div className="bg-white/70 backdrop-blur-2xl border-[0.5px] border-black/10 rounded-3xl p-6 md:p-12 shadow-2xl shadow-black/5">
                        <div className="hidden md:grid grid-cols-12 gap-4 pb-8 border-b border-stacks-black/5 text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-stacks-black/30">
                            <div className="col-span-2">Status</div>
                            <div className="col-span-6">Proposal</div>
                            <div className="col-span-2">Tally</div>
                            <div className="col-span-2 text-right">Action</div>
                        </div>

                        <div>
                            {isLoading ? (
                                <div className="p-20 text-center text-stacks-black/40 font-sans font-bold uppercase tracking-[0.3em] animate-pulse">
                                    Extracting Ledger Data...
                                </div>
                            ) : proposals.length === 0 ? (
                                <div className="p-20 text-center text-stacks-black/40 font-sans font-bold uppercase tracking-[0.3em]">
                                    Docket is Empty.
                                </div>
                            ) : (
                                proposals.map((prop) => (
                                    <ProposalRow key={prop.id} {...prop} />
                                ))
                            )}
                        </div>
                    </div>
                </Container>
            </div>
        </>
    );
}
