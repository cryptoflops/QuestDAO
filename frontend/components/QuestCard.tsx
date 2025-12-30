'use client';

import React, { useState } from 'react';
import Button from './ui/Button';
import * as StacksConnect from '@/lib/stacks';
import { userSession } from '@/lib/stacks-session';
import { uintCV, PostConditionMode } from '@/lib/stacks';
import { CONTRACT_ADDRESS, CONTRACTS } from '@/lib/constants';

export interface QuestCardProps {
    id: string;
    title: string;
    description: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Wizard';
    reward: string;
    status: 'locked' | 'available' | 'completed';
    className?: string;
    onBegin?: (id: string) => void;
}

const QuestCard: React.FC<QuestCardProps> = ({
    id,
    title,
    description,
    difficulty,
    reward,
    status,
    className = '',
    onBegin
}) => {
    const isLocked = status === 'locked';
    const isCompleted = status === 'completed';

    const handleAction = () => {
        if (onBegin) onBegin(id);
    };

    return (
        <div className={`
            group relative p-10 h-full flex flex-col justify-between
            border-[0.5px] border-black/10 bg-white/70 backdrop-blur-2xl
            rounded-[2rem] transition-all duration-700 ease-in-out
            hover:bg-white hover:shadow-[0_20px_50px_rgba(255,100,0,0.15)] hover:-translate-y-2
            ${className}
            ${isLocked ? 'opacity-40 grayscale pointer-events-none' : ''}
        `}>

            {/* Editorial Header */}
            <div>
                <div className="flex items-center gap-3 mb-8">
                    <span className="px-3 py-1 rounded-full bg-[#F5F5F7] font-sans text-[9px] font-bold uppercase tracking-[0.2em] text-black/50">
                        {difficulty}
                    </span>
                    <span className="font-sans text-[9px] font-bold uppercase tracking-[0.2em] text-[#FF4B12]">
                        {reward} XP
                    </span>
                </div>

                <h3 className="text-4xl font-serif text-black leading-[0.9] mb-6 tracking-tighter">
                    {title}
                </h3>

                <p className="text-black/60 font-sans text-sm leading-relaxed max-w-sm mb-10">
                    {description}
                </p>
            </div>

            {/* Footer / Status Action */}
            <div className="flex items-center justify-between pt-6 border-t-[0.5px] border-black/5">
                {status === 'available' && (
                    <button
                        onClick={handleAction}
                        className="group relative px-6 py-3 bg-black text-white rounded-full font-sans font-bold text-xs uppercase tracking-[0.2em] overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-lg"
                    >
                        <span className="relative z-10">Begin Module</span>
                        <div className="absolute inset-0 bg-[#FF4B12] translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    </button>
                )}

                {isLocked && (
                    <div className="flex items-center text-stacks-black/30 font-sans text-[10px] font-bold uppercase tracking-widest gap-2">
                        <span>🔒</span> Restricted
                    </div>
                )}

                {isCompleted && (
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-[10px] font-bold text-green-600 font-sans uppercase tracking-widest">Mastered</span>
                    </div>
                )}
            </div>

        </div>
    );
};

export default QuestCard;
