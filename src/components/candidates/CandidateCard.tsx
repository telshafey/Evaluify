import React from 'react';
import { Candidate } from '../../types.ts';
import { UsersIcon } from '../icons.tsx';

interface CandidateCardProps {
    candidate: Candidate;
    onDragStart: (e: React.DragEvent<HTMLDivElement>, candidateId: string) => void;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, onDragStart }) => {
    return (
        <div
            draggable
            onDragStart={(e) => {
                e.currentTarget.classList.add('dragging');
                onDragStart(e, candidate.id);
            }}
            onDragEnd={(e) => {
                e.currentTarget.classList.remove('dragging');
            }}
            className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4 border-l-4 border-primary-500 cursor-grab active:cursor-grabbing"
        >
            <div className="flex items-center space-x-3">
                {/* Using an icon instead of an image URL for simplicity */}
                <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                    <UsersIcon className="w-6 h-6 text-slate-500" />
                </div>
                <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-100">{candidate.name}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{candidate.role}</p>
                </div>
            </div>
            <div className="mt-3 text-xs text-slate-400 dark:text-slate-500">
                <span>Last activity: {candidate.lastActivity}</span>
            </div>
        </div>
    );
};

export default CandidateCard;
