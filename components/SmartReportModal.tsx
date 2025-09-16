import React from 'react';
import { SmartReport } from '../types';
import { SparklesIcon, XCircleIcon, SpinnerIcon, CheckCircleIcon, LightbulbIcon, ChartBarIcon } from './icons';

interface SmartReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    isLoading: boolean;
    report: SmartReport | null;
}

const ReportSection: React.FC<{ icon: React.ElementType; title: string; children: React.ReactNode; colorClass: string }> = ({ icon: Icon, title, children, colorClass }) => (
    <div>
        <h3 className={`font-semibold text-lg flex items-center mb-3 ${colorClass}`}>
            <Icon className="w-6 h-6 me-2" />
            {title}
        </h3>
        {children}
    </div>
);

const SmartReportModal: React.FC<SmartReportModalProps> = ({ isOpen, onClose, isLoading, report }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="smart-report-title"
                className="modal-content-container bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-start">
                    <h2 id="smart-report-title" className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center">
                        <SparklesIcon className="w-6 h-6 me-3 text-purple-500" />
                        AI-Powered Smart Report
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" aria-label="Close">
                        <XCircleIcon className="w-7 h-7" />
                    </button>
                </div>

                <div className="mt-6 flex-grow overflow-y-auto pr-4 -mr-4">
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <SpinnerIcon className="w-12 h-12 text-purple-500" />
                            <p className="mt-4 text-lg font-semibold">Generating Insights...</p>
                            <p className="text-slate-500 dark:text-slate-400">Our AI is analyzing your data to create a comprehensive report. This might take a moment.</p>
                        </div>
                    )}
                    {report && (
                        <div className="space-y-6">
                            <ReportSection icon={ChartBarIcon} title="Overall Performance Summary" colorClass="text-blue-600 dark:text-blue-400">
                                <p className="text-slate-600 dark:text-slate-300">{report.summary}</p>
                            </ReportSection>

                            <ReportSection icon={CheckCircleIcon} title="Key Strengths" colorClass="text-green-600 dark:text-green-400">
                                <ul className="space-y-2 list-inside list-disc text-slate-600 dark:text-slate-300">
                                    {report.strengths.map((item, index) => <li key={index}>{item}</li>)}
                                </ul>
                            </ReportSection>

                            <ReportSection icon={XCircleIcon} title="Areas for Improvement" colorClass="text-yellow-600 dark:text-yellow-400">
                                <ul className="space-y-2 list-inside list-disc text-slate-600 dark:text-slate-300">
                                    {report.areasForImprovement.map((item, index) => <li key={index}>{item}</li>)}
                                </ul>
                            </ReportSection>

                            <ReportSection icon={LightbulbIcon} title="Actionable Recommendations" colorClass="text-purple-600 dark:text-purple-400">
                                <ul className="space-y-3">
                                    {report.recommendations.map((item, index) => (
                                         <li key={index} className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg text-sm">{item}</li>
                                    ))}
                                </ul>
                            </ReportSection>
                        </div>
                    )}
                </div>

                <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-700 text-right">
                    <button onClick={onClose} className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-6 rounded-lg">
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SmartReportModal;