import React from 'react';
import { CvAnalysisResult } from '../types.ts';
import { CheckCircleIcon, XCircleIcon, LightbulbIcon, SparklesIcon } from './icons.tsx';

interface CvAnalysisResultModalProps {
    isOpen: boolean;
    onClose: () => void;
    result: CvAnalysisResult | null;
}

const CvAnalysisResultModal: React.FC<CvAnalysisResultModalProps> = ({ isOpen, onClose, result }) => {
    if (!isOpen || !result) return null;

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-500';
        if (score >= 60) return 'text-yellow-500';
        return 'text-red-500';
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="cv-analysis-title"
                className="modal-content-container bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-start">
                    <h2 id="cv-analysis-title" className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center">
                        <SparklesIcon className="w-6 h-6 me-3 text-blue-500" />
                        CV Analysis Report
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" aria-label="Close">
                        <XCircleIcon className="w-7 h-7" />
                    </button>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    <div className="md:col-span-1 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-700/50 p-6 rounded-xl">
                        <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Match Score</p>
                        <p className={`text-7xl font-extrabold ${getScoreColor(result.matchScore)}`}>
                            {result.matchScore}
                            <span className="text-4xl">%</span>
                        </p>
                    </div>
                    <div className="md:col-span-2">
                        <p className="text-slate-600 dark:text-slate-300">{result.summary}</p>
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="font-semibold text-lg flex items-center mb-3">
                            <CheckCircleIcon className="w-6 h-6 me-2 text-green-500" />
                            Key Strengths
                        </h3>
                        <ul className="space-y-2 list-inside list-disc text-slate-600 dark:text-slate-300">
                            {result.strengths.map((item, index) => <li key={index}>{item}</li>)}
                        </ul>
                    </div>
                     <div>
                        <h3 className="font-semibold text-lg flex items-center mb-3">
                            <XCircleIcon className="w-6 h-6 me-2 text-yellow-500" />
                            Potential Gaps
                        </h3>
                        <ul className="space-y-2 list-inside list-disc text-slate-600 dark:text-slate-300">
                            {result.weaknesses.map((item, index) => <li key={index}>{item}</li>)}
                        </ul>
                    </div>
                </div>

                <div className="mt-8">
                    <h3 className="font-semibold text-lg flex items-center mb-3">
                        <LightbulbIcon className="w-6 h-6 me-2 text-purple-500" />
                        Suggested Interview Questions
                    </h3>
                    <div className="space-y-3">
                        {result.suggestedQuestions.map((q, index) => (
                            <div key={index} className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg text-sm">
                                <p>{q}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-8 text-right">
                    <button onClick={onClose} className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-6 rounded-lg">
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CvAnalysisResultModal;
