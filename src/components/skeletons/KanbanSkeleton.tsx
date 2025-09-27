
import React from 'react';
import Skeleton from './Skeleton.tsx';

const KanbanSkeleton: React.FC = () => {
    return (
        <div className="flex space-x-6 overflow-x-auto pb-4 h-full">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="kanban-column bg-slate-100 dark:bg-slate-900/50 rounded-xl p-4 w-80 flex-shrink-0 flex flex-col">
                    <Skeleton className="h-6 w-3/4 mb-4" />
                    <div className="space-y-4">
                        <Skeleton className="h-24 w-full rounded-lg" />
                        <Skeleton className="h-24 w-full rounded-lg" />
                        <Skeleton className="h-24 w-full rounded-lg" />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default KanbanSkeleton;
