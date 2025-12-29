'use client';

import React from 'react';
import Button from './ui/Button';
import * as StacksConnect from '@/lib/stacks';
import { uintCV, boolCV, stringAsciiCV } from '@/lib/stacks';
import { CONTRACT_ADDRESS, CONTRACTS } from '@/lib/constants';

export interface ProposalRowProps {
    id: string;
    title: string;
    status: 'active' | 'passed' | 'rejected' | 'pending';
    votesFor: number;
    votesAgainst: number;
    votesAbstain: number;
    endDate: string;
}

const ProposalRow: React.FC<ProposalRowProps> = ({
    id,
    title,
    status,
    votesFor,
    votesAgainst,
    votesAbstain,
    endDate,
}) => {

    const statusColors = {
        active: 'bg-stacks-orange',
        passed: 'bg-green-500',
        rejected: 'bg-red-500',
        pending: 'bg-stacks-black/20',
    };

    const statusLabels = {
        active: 'In Session',
        passed: 'Ratified',
        rejected: 'Dismissed',
        pending: 'Docketed',
    };

    // Hardcoded for Devnet/Testnet
    const CONTRACT_NAME = CONTRACTS.VOTING;

    const handleVote = (voteFor: string) => {

        const sc = StacksConnect as any;

        const options = {
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACT_NAME,
            functionName: 'vote',
            functionArgs: [
                uintCV(parseInt(id)),
                stringAsciiCV(voteFor)
            ],
            appDetails: {
                name: 'QuestDAO',
                icon: window.location.origin + '/logo.png',
            },
            onFinish: (data: any) => {
                console.log('Vote Transaction:', data);
            }
        };

        if (typeof sc.openContractCall === 'function') {
            sc.openContractCall(options);
        } else {
            console.error('openContractCall not found');
        }
    }

    return (
        <div className="group grid grid-cols-1 md:grid-cols-12 gap-8 py-10 border-b-[0.5px] border-black/5 items-center hover:bg-white/50 transition-all px-6 -mx-6 rounded-2xl">

            {/* ID & Status */}
            <div className="md:col-span-2 flex items-center gap-4">
                <span className="font-sans font-bold text-[10px] text-black/20 tracking-tighter">#{id.padStart(3, '0')}</span>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5F5F7] border-[0.5px] border-black/5">
                    <span className={`w-1.5 h-1.5 rounded-full ${status === 'active' ? 'bg-[#FF4B12] animate-pulse' : status === 'passed' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    <span className="text-[9px] uppercase tracking-[0.2em] text-black/60 font-bold font-sans">
                        {statusLabels[status]}
                    </span>
                </div>
            </div>

            {/* Title */}
            <div className="md:col-span-6">
                <h3 className="font-serif text-2xl text-stacks-black leading-tight group-hover:text-stacks-orange transition-colors tracking-tight">
                    {title}
                </h3>
                <p className="text-[10px] text-stacks-black/30 mt-2 font-bold font-sans uppercase tracking-[0.1em]">
                    Closing at Block {endDate.replace('Block ', '')}
                </p>
            </div>

            {/* Votes */}
            <div className="md:col-span-2 flex flex-col gap-2">
                <div className="flex justify-between text-[10px] font-sans font-bold text-stacks-black/40 uppercase tracking-widest">
                    <span>Yes</span>
                    <span className="text-stacks-black">{votesFor}</span>
                </div>
                <div className="flex justify-between text-[10px] font-sans font-bold text-stacks-black/40 uppercase tracking-widest">
                    <span>No</span>
                    <span className="text-stacks-black">{votesAgainst}</span>
                </div>
            </div>

            {/* Action */}
            <div className="md:col-span-2 flex flex-col gap-3">
                {status === 'active' ? (
                    <div className="flex flex-col gap-2">
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => handleVote("yes")}
                                className="group relative px-4 py-2 bg-secondary text-white rounded-full font-sans font-bold text-[10px] uppercase tracking-[0.2em] overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-md"
                            >
                                <span className="relative z-10">Yes</span>
                                <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                            </button>
                            <button
                                onClick={() => handleVote("no")}
                                className="px-4 py-2 bg-muted border border-border text-foreground rounded-full font-sans font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-white transition-all shadow-sm"
                            >
                                No
                            </button>
                        </div>
                        <button
                            onClick={() => handleVote("abstain")}
                            className="px-4 py-2 bg-transparent text-foreground/40 rounded-full font-sans font-bold text-[9px] uppercase tracking-[0.2em] hover:text-primary transition-colors"
                        >
                            Abstain
                        </button>
                    </div>
                ) : (
                    <button className="px-4 py-2 bg-white/30 backdrop-blur-sm border border-black/5 text-black/40 rounded-full font-sans font-bold text-[9px] uppercase tracking-[0.2em] cursor-not-allowed">
                        View Audit
                    </button>
                )}
            </div>

        </div>
    );
};

export default ProposalRow;
