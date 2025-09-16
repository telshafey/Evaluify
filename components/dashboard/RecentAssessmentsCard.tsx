
import React from 'react';
import { RecentAssessment } from '../../types';

interface RecentAssessmentsCardProps {
    assessments: RecentAssessment[];
}

const RecentAssessmentsCard: React.FC<RecentAssessmentsCardProps> = ({ assessments }) => {
    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg h-full">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Recent Assessments</h3>
            <div className="space-y-4">
                {assessments.map((assessment, index) => (
                    <div key={index} className="flex items-center">
                        <div className={`w-10 h-10 rounded-full ${assessment.avatarColor} flex items-center justify-center text-white font-bold`}>
                            {assessment.avatar}
                        </div>
                        <div className="ml-4 flex-grow">
                            <p className="font-semibold text-slate-800 dark:text-slate-100">{assessment.name}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{assessment.test}</p>
                        </div>
                        <div className="text-right">
                            <p className={`font-bold text-lg ${assessment.score >= 80 ? 'text-green-500' : 'text-yellow-500'}`}>
                                {assessment.score}%
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentAssessmentsCard;
