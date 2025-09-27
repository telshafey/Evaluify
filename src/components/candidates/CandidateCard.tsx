import React from 'react';
import { Candidate } from '../../types.ts';
import { UsersIcon, SparklesIcon } from '../icons.tsx';

interface CandidateCardProps {
    candidate: Candidate;
    onDragStart: (e: React.DragEvent<HTMLDivElement>, candidateId: string) => void;
    onAnalyzeCv: () => void;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, onDragStart, onAnalyzeCv }) => {
    
    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-500 bg-green-100 dark:bg-green-900/50';
        if (score >= 60) return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/50';
        return 'text-red-500 bg-red-100 dark:bg-red-900/50';
    };

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
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                        <UsersIcon className="w-6 h-6 text-slate-500" />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800 dark:text-slate-100">{candidate.name}</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{candidate.role}</p>
                    </div>
                </div>
                {candidate.matchScore != null && (
                    <div className={`text-sm font-bold px-2 py-1 rounded-full ${getScoreColor(candidate.matchScore)}`}>
                        {candidate.matchScore}%
                    </div>
                )}
            </div>
            <div className="mt-3 flex justify-between items-center text-xs text-slate-400 dark:text-slate-500">
                <span>Last activity: {candidate.lastActivity}</span>
                {candidate.matchScore == null && (
                    <button onClick={onAnalyzeCv} className="text-purple-500 hover:text-purple-600 font-semibold flex items-center text-xs">
                        <SparklesIcon className="w-4 h-4 mr-1" />
                        Analyze CV
                    </button>
                )}
            </div>
        </div>
    );
};

export default CandidateCard;