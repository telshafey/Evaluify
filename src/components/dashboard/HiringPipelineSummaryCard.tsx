
import React, { useMemo } from 'react';
import { Candidate, CandidateStatus } from '../../types.ts';
import { useLanguage } from '../../App.tsx';

interface HiringPipelineSummaryCardProps {
    candidates: Candidate[];
}

const translations = {
    en: {
        title: "Hiring Pipeline",
        stages: {
            [CandidateStatus.Applied]: 'Applied',
            [CandidateStatus.Screening]: 'Screening',
            [CandidateStatus.Assessment]: 'Assessment',
            [CandidateStatus.Interview]: 'Interview',
            [CandidateStatus.Offer]: 'Offer',
            [CandidateStatus.Hired]: 'Hired',
        }
    },
    ar: {
        title: "مسار التوظيف",
        stages: {
            [CandidateStatus.Applied]: 'المتقدمون',
            [CandidateStatus.Screening]: 'الفرز',
            [CandidateStatus.Assessment]: 'التقييم',
            [CandidateStatus.Interview]: 'المقابلة',
            [CandidateStatus.Offer]: 'العرض',
            [CandidateStatus.Hired]: 'تم التوظيف',
        }
    }
};

const stageColors = {
    [CandidateStatus.Applied]: 'bg-slate-400',
    [CandidateStatus.Screening]: 'bg-blue-400',
    [CandidateStatus.Assessment]: 'bg-purple-400',
    [CandidateStatus.Interview]: 'bg-yellow-400',
    [CandidateStatus.Offer]: 'bg-orange-400',
    [CandidateStatus.Hired]: 'bg-green-400',
};


const HiringPipelineSummaryCard: React.FC<HiringPipelineSummaryCardProps> = ({ candidates }) => {
    const { lang } = useLanguage();
    const t = translations[lang];

    const stageCounts = useMemo(() => {
        const counts = new Map<CandidateStatus, number>();
        for (const status of Object.values(CandidateStatus)) {
            counts.set(status, 0);
        }
        candidates.forEach(c => {
            counts.set(c.stage, (counts.get(c.stage) || 0) + 1);
        });
        return Array.from(counts.entries());
    }, [candidates]);
    
    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg h-full">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">{t.title}</h3>
            <div className="space-y-4">
                {stageCounts.map(([status, count]) => (
                    <div key={status}>
                        <div className="flex justify-between mb-1">
                            <span className="text-base font-medium text-slate-700 dark:text-slate-200">{t.stages[status]}</span>
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{count}</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                            <div className={`h-2.5 rounded-full ${stageColors[status]}`} style={{ width: `${(count / candidates.length) * 100}%` }}></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HiringPipelineSummaryCard;
