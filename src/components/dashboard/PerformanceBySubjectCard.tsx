import React from 'react';
// FIX: Update import path for types to remove .ts extension.
import { PerformanceBySubject } from '../../types';

interface PerformanceBySubjectCardProps {
    performanceData: PerformanceBySubject[];
}

const PerformanceBySubjectCard: React.FC<PerformanceBySubjectCardProps> = ({ performanceData }) => {
    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg h-full">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Performance by Subject</h3>
            <div className="space-y-4">
                {performanceData.map((item, index) => (
                    <div key={index}>
                        <div className="flex justify-between mb-1">
                            <span className="text-base font-medium text-slate-700 dark:text-slate-200">{item.subject}</span>
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{item.averageScore}%</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                            <div className="h-2.5 rounded-full" style={{ width: `${item.averageScore}%`, backgroundColor: item.color }}></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PerformanceBySubjectCard;