'use client';

import React, { useState } from 'react';
import Button from './ui/Button';
import * as StacksConnect from '@stacks/connect';
import { uintCV, stringAsciiCV } from '@stacks/transactions';
import { CONTRACT_ADDRESS, CONTRACTS } from '@/lib/constants';

interface CreateProposalModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreateProposalModal: React.FC<CreateProposalModalProps> = ({ isOpen, onClose }) => {
    const [title, setTitle] = useState('');
    const [duration, setDuration] = useState('144'); // ~1 day

    if (!isOpen) return null;

    // Hardcoded for Devnet/Testnet - using the SAME address we deployed to
    const CONTRACT_NAME = CONTRACTS.VOTING;

    const handleSubmit = () => {
        const sc = StacksConnect as any;

        const options = {
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACT_NAME,
            functionName: 'create-proposal',
            functionArgs: [
                stringAsciiCV(title),
                uintCV(parseInt(duration))
            ],
            appDetails: {
                name: 'QuestDAO',
                icon: window.location.origin + '/logo.png',
            },
            onFinish: (data: any) => {
                console.log('Proposal Created:', data);
                onClose();
            }
        };

        if (typeof sc.openContractCall === 'function') {
            sc.openContractCall(options);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-stacks-black/20 backdrop-blur-xl transition-all duration-500">
            <div className="bg-white/90 border border-stacks-black/5 w-full max-w-xl p-12 rounded-[2.5rem] relative shadow-2xl shadow-stacks-orange/10 transform transition-all">
                <button onClick={onClose} className="absolute top-8 right-8 text-foreground/20 hover:text-primary transition-colors">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h2 className="text-4xl font-serif text-foreground mb-10 tracking-tighter">Submit <br /><span className="text-primary">Proposal</span></h2>

                <div className="space-y-8">
                    <div className="space-y-3">
                        <label className="block text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-stacks-black/30">Proposal Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-muted border border-border p-5 text-foreground focus:border-primary outline-none rounded-2xl font-sans font-medium transition-all"
                            placeholder="e.g., SIP-015 Governance Upgrade"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="block text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-stacks-black/30">Duration (Blocks)</label>
                        <input
                            type="number"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            className="w-full bg-muted border border-border p-5 text-foreground focus:border-primary outline-none rounded-2xl font-sans font-medium transition-all"
                        />
                        <p className="text-[10px] text-stacks-black/20 font-sans font-bold uppercase tracking-widest px-1">144 blocks ≈ 1 day on mainnet</p>
                    </div>

                    <Button variant="signature" size="lg" fullWidth onClick={handleSubmit} className="mt-4">
                        Submit to Protocol
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CreateProposalModal;
