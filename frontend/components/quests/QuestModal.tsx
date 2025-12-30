'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { QuestContent } from '@/lib/quests.data';

interface QuestModalProps {
    isOpen: boolean;
    onClose: () => void;
    content: QuestContent | null;
    onComplete: (proof: string) => void;
    isProcessing: boolean;
    title: string;
    canComplete: boolean;
}

const QuestModal: React.FC<QuestModalProps> = ({
    isOpen,
    onClose,
    content,
    onComplete,
    isProcessing,
    title,
    canComplete
}) => {
    const [proof, setProof] = React.useState('');

    if (!isOpen || !content) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-xl animate-fade-in"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-5xl h-full max-h-[90vh] bg-white rounded-[3rem] shadow-2xl flex flex-col overflow-hidden border border-black/5 animate-scale-in">

                {/* Header */}
                <div className="px-8 md:px-16 pt-12 pb-8 border-b border-black/5 flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="px-3 py-1 rounded-full bg-stacks-orange/10 text-stacks-orange font-mono text-[10px] uppercase tracking-widest font-bold">
                                Module {content.id}
                            </span>
                            <span className="text-black/40 font-sans text-[10px] uppercase tracking-widest font-bold">
                                {content.readingTime} Reading
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-serif text-black tracking-tighter italic leading-none">
                            {title}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-12 h-12 rounded-full border border-black/5 flex items-center justify-center hover:bg-black/5 transition-colors"
                    >
                        <span className="text-2xl">×</span>
                    </button>
                </div>

                {/* Sub-Header: Objectives */}
                <div className="px-8 md:px-16 py-6 bg-[#F5F5F7]/30 flex flex-wrap gap-8 items-center border-b border-black/5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-black/30">Objectives:</span>
                    {content.objectives.map((obj, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-stacks-orange"></div>
                            <span className="text-xs font-sans font-bold text-black/60 capitalize">{obj}</span>
                        </div>
                    ))}
                </div>

                {/* Body: Markdown scrollable */}
                <div className="flex-1 overflow-y-auto px-8 md:px-16 py-12 scrollbar-hide">
                    <div className="prose prose-lg max-w-none prose-serif">
                        <ReactMarkdown
                            components={{
                                h1: ({ ...props }) => <h1 className="text-4xl font-serif mb-8 text-black" {...props} />,
                                h2: ({ ...props }) => <h2 className="text-2xl font-serif mt-12 mb-6 text-black border-b border-black/5 pb-2" {...props} />,
                                h3: ({ ...props }) => <h3 className="text-xl font-bold mt-8 mb-4 text-black" {...props} />,
                                p: ({ ...props }) => <p className="text-black/70 mb-6 leading-relaxed" {...props} />,
                                code: ({ ...props }) => (
                                    <code className="bg-black/5 text-[#FF4B12] px-1.5 py-0.5 rounded font-mono text-sm" {...props} />
                                ),
                                pre: ({ ...props }) => (
                                    <pre className="bg-black text-white p-6 rounded-2xl font-mono text-sm overflow-x-auto my-8 shadow-xl" {...props} />
                                )
                            }}
                        >
                            {content.content}
                        </ReactMarkdown>
                    </div>
                </div>

                {/* Knowledge Check Section */}
                <div className="px-8 md:px-16 py-8 bg-black/[0.02] border-t border-black/5">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-4 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF4B12]"></span>
                        {content.type === 'identity' ? 'Identity Verification' : 'Knowledge Check'}
                    </h4>
                    <p className="text-sm font-sans font-bold text-black mb-4">
                        {content.knowledgeCheck}
                    </p>
                    <input
                        type="text"
                        value={proof}
                        onChange={(e) => setProof(e.target.value)}
                        placeholder={content.type === 'identity' ? "e.g. architect.btc" : "Enter the secret proof..."}
                        className="w-full bg-white border border-black/10 rounded-2xl px-6 py-4 font-mono text-sm focus:outline-none focus:border-[#FF4B12] transition-colors shadow-inner"
                    />
                </div>

                {/* Footer Action */}
                <div className="px-8 md:px-16 py-10 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-6 bg-white shrink-0">
                    <div className="flex flex-col gap-2">
                        <p className="text-xs font-sans font-bold text-black/40 uppercase tracking-widest text-center md:text-left">
                            Proof of Logic Required:
                        </p>
                        <div className="flex items-center gap-3 text-center md:text-left">
                            <div className={`w-1.5 h-1.5 rounded-full ${canComplete ? 'bg-green-500' : 'bg-[#FF4B12]'}`}></div>
                            <span className={`text-[10px] font-bold uppercase tracking-[0.1em] ${canComplete ? 'text-black/60' : 'text-[#FF4B12]'}`}>
                                {content.requirement}: {content.requirementDescription}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={() => onComplete(proof)}
                        disabled={isProcessing || !canComplete || !proof.trim()}
                        className={`group relative px-12 py-5 rounded-full font-sans font-bold text-[10px] uppercase tracking-[0.3em] overflow-hidden transition-all shadow-2xl w-full md:w-auto
                            ${(canComplete && proof.trim()) ? 'bg-black text-white hover:scale-110 active:scale-95' : 'bg-black/5 text-black/20 cursor-not-allowed'}
                        `}
                    >
                        <span className="relative z-10">{isProcessing ? 'Verifying...' : content.type === 'identity' ? 'Verify Identity & Claim XP' : 'Mint Badge (on-chain proof)'}</span>
                        {(canComplete && proof.trim()) && <div className="absolute inset-0 bg-[#FF4B12] translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuestModal;
