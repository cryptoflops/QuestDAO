'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import Button from './ui/Button';
import * as StacksConnect from '@/lib/stacks';
import { uintCV, stringAsciiCV } from '@/lib/stacks';
import { CONTRACT_ADDRESS, CONTRACTS } from '@/lib/constants';

interface CreateProposalModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreateProposalModal: React.FC<CreateProposalModalProps> = ({ isOpen, onClose }) => {
    const [title, setTitle] = useState('');
    const [duration, setDuration] = useState('144'); // ~1 day
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && modalRef.current) {
            modalRef.current.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

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
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-stacks-black/20 backdrop-blur-xl transition-all duration-500"
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-proposal-title"
        >
            <div
                ref={modalRef}
                tabIndex={-1}
                className="bg-white/90 border border-stacks-black/5 w-full max-w-xl p-12 rounded-[2.5rem] relative shadow-2xl shadow-stacks-orange/10 transform transition-all"
            >
                <button onClick={onClose} className="absolute top-8 right-8 p-2 hover:bg-black/5 rounded-full transition-colors" aria-label="Close">
                    <X size={20} />
                </button>

                <h2 id="create-proposal-title" className="text-4xl font-serif text-foreground mb-10 tracking-tighter">Submit <br /><span className="text-primary">Proposal</span></h2>

                <div className="space-y-8">
                    <div className="space-y-3">
                        <label className="block text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-stacks-black/60">Proposal Title</label>
                        <label htmlFor="proposal-title" className="sr-only">Proposal title</label>
                        <input
                            id="proposal-title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-muted border border-border p-5 text-foreground focus:border-primary outline-none rounded-2xl font-sans font-medium transition-all"
                            placeholder="e.g., SIP-015 Governance Upgrade"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="block text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-stacks-black/60">Duration (Blocks)</label>
                        <label htmlFor="proposal-duration" className="sr-only">Duration (blocks)</label>
                        <input
                            id="proposal-duration"
                            type="number"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            className="w-full bg-muted border border-border p-5 text-foreground focus:border-primary outline-none rounded-2xl font-sans font-medium transition-all"
                        />
                        <p className="text-[10px] text-stacks-black/60 font-sans font-bold uppercase tracking-widest px-1">144 blocks ≈ 1 day on mainnet</p>
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
