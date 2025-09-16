import React from 'react';
import { Candidate, CandidateStatus } from '../../types';
import CandidateCard from '../candidates/CandidateCard';

interface KanbanStage {
    key: CandidateStatus;
    title: string;
}

interface KanbanBoardProps {
    candidates: Candidate[];
    stages: KanbanStage[];
    onStatusChange: (candidateId: string, newStatus: CandidateStatus) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ candidates, stages, onStatusChange }) => {
    
    const handleDragStart = (e: React.DragEvent, candidateId: string) => {
        e.dataTransfer.setData('candidateId', candidateId);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent, newStatus: CandidateStatus) => {
        e.preventDefault();
        const candidateId = e.dataTransfer.getData('candidateId');
        const candidate = candidates.find(c => c.id === candidateId);
        if (candidate && candidate.stage !== newStatus) {
            onStatusChange(candidateId, newStatus);
        }
        (e.currentTarget as HTMLDivElement).classList.remove('drag-over');
    };
    
    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        (e.currentTarget as HTMLDivElement).classList.add('drag-over');
    };
    const handleDragLeave = (e: React.DragEvent) => {
        (e.currentTarget as HTMLDivElement).classList.remove('drag-over');
    };


    return (
        <div className="flex space-x-6 overflow-x-auto pb-4 h-full">
            {stages.map(stage => (
                <div 
                    key={stage.key}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, stage.key)}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    className="kanban-column bg-slate-100 dark:bg-slate-900/50 rounded-xl p-4 w-80 flex-shrink-0 flex flex-col transition-colors"
                >
                    <h3 className="font-bold text-lg mb-4 px-2">{stage.title} ({candidates.filter(c => c.stage === stage.key).length})</h3>
                    <div className="space-y-4 overflow-y-auto h-full pr-2">
                        {candidates
                            .filter(candidate => candidate.stage === stage.key)
                            .map(candidate => (
                                <CandidateCard 
                                    key={candidate.id} 
                                    candidate={candidate} 
                                    onDragStart={handleDragStart} 
                                />
                            ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default KanbanBoard;