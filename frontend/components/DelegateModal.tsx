'use client';

import React, { useState } from 'react';
import Button from './ui/Button';
import * as StacksConnect from '@/lib/stacks';
import { standardPrincipalCV } from '@/lib/stacks';
import { CONTRACT_ADDRESS, CONTRACTS, IS_MAINNET } from '@/lib/constants';

interface DelegateModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const DelegateModal: React.FC<DelegateModalProps> = ({ isOpen, onClose }) => {
    const [delegatee, setDelegatee] = useState('');

    if (!isOpen) return null;

    const CONTRACT_NAME = CONTRACTS.VOTING;

    const handleSubmit = () => {
        const sc = StacksConnect as any;

        // Basic validation
        const prefix = IS_MAINNET ? 'SP' : 'ST';
        if (!delegatee.startsWith(prefix)) {
            alert(`Please enter a valid Stacks ${IS_MAINNET ? 'Mainnet (SP)' : 'Testnet (ST)'} address`);
            return;
        }

        const options = {
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACT_NAME,
            functionName: 'delegate',
            functionArgs: [
                standardPrincipalCV(delegatee)
            ],
            appDetails: {
                name: 'QuestDAO',
                icon: window.location.origin + '/logo.png',
            },
            onFinish: (data: any) => {
                console.log('Delegated:', data);
                onClose();
            }
        };

        if (typeof sc.openContractCall === 'function') {
            sc.openContractCall(options);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-stacks-black/20 backdrop-blur-xl transition-all duration-500">
            <div className="bg-white/90 border border-stacks-black/5 w-full max-w-xl p-12 rounded-[2.5rem] relative shadow-2xl shadow-stacks-orange/10">
                <button onClick={onClose} className="absolute top-8 right-8 text-foreground/20 hover:text-primary transition-colors">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h2 className="text-4xl font-serif text-foreground mb-6 tracking-tighter">Delegate <br /><span className="text-primary">Voting Power</span></h2>
                <p className="text-[14px] text-stacks-black/60 mb-10 font-sans font-medium leading-relaxed">
                    Assign your voting weight to another trusted principal. You retain your Soulbound Badge, but they will cast votes on your behalf across the protocol.
                </p>

                <div className="space-y-8">
                    <div className="space-y-3">
                        <label className="block text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-stacks-black/30">Delegate Principal</label>
                        <input
                            type="text"
                            value={delegatee}
                            onChange={(e) => setDelegatee(e.target.value)}
                            className="w-full bg-muted border border-border p-5 text-foreground focus:border-primary outline-none rounded-2xl font-mono text-[13px] transition-all"
                            placeholder="ST..."
                        />
                    </div>

                    <Button variant="secondary" size="lg" fullWidth onClick={handleSubmit}>
                        Authorize Delegation
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default DelegateModal;
