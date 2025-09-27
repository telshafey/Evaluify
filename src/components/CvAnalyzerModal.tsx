
import React, { useState, ChangeEvent } from 'react';
import { Candidate, CvAnalysisResult } from '../types.ts';
import { analyzeCvWithAI } from '../services/mockApi.ts';
import { useNotification } from '../contexts/NotificationContext.tsx';
import { XCircleIcon, SparklesIcon, SpinnerIcon } from './icons.tsx';

interface CvAnalyzerModalProps {
    isOpen: boolean;
    onClose: () => void;
    candidate: Candidate | null;
    onAnalysisComplete: (candidateId: string, result: CvAnalysisResult) => void;
}

const CvAnalyzerModal: React.FC<CvAnalyzerModalProps> = ({ isOpen, onClose, candidate, onAnalysisComplete }) => {
    const [cvFile, setCvFile] = useState<File | null>(null);
    const [jobDescription, setJobDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { addNotification } = useNotification();

    if (!isOpen || !candidate) return null;

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.type === 'text/plain') {
                setCvFile(file);
            } else {
                addNotification("For this demo, please upload a .txt file.", "error");
                e.target.value = '';
            }
        }
    };

    const handleAnalyze = () => {
        if (!cvFile || !jobDescription.trim()) {
            addNotification("Please provide both a CV file and a job description.", "error");
            return;
        }

        const reader = new FileReader();
        reader.onload = async (e) => {
            const cvText = e.target?.result as string;
            if (!cvText) {
                addNotification("Could not read the CV file.", "error");
                return;
            }
            setIsLoading(true);
            try {
                const result = await analyzeCvWithAI(cvText, jobDescription);
                onAnalysisComplete(candidate.id, result);
                onClose(); // Close this modal, parent will show results
            } catch (error) {
                addNotification("AI Analysis failed. Please try again.", "error");
            } finally {
                setIsLoading(false);
            }
        };
        reader.readAsText(cvFile);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="cv-analyzer-title"
                className="modal-content-container bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 w-full max-w-lg"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-start">
                    <h2 id="cv-analyzer-title" className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center">
                        <SparklesIcon className="w-6 h-6 me-3 text-blue-500" />
                        Analyze CV for {candidate.name}
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" aria-label="Close">
                        <XCircleIcon className="w-7 h-7" />
                    </button>
                </div>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Analyzing for role: {candidate.role}</p>

                <div className="mt-6 space-y-4">
                    <div>
                        <label htmlFor="job-description-modal" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Job Description</label>
                        <textarea
                            id="job-description-modal"
                            rows={5}
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            placeholder="Paste the job description here..."
                            className="w-full p-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm"
                        />
                    </div>
                    <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-4 text-center">
                        <label htmlFor="cv-upload-modal" className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 inline-block">
                            📎 Choose CV File (.txt)
                        </label>
                        <input id="cv-upload-modal" type="file" accept=".txt" className="hidden" onChange={handleFileChange} />
                        {cvFile && <p className="text-sm text-slate-500 mt-2">Selected: {cvFile.name}</p>}
                    </div>
                </div>

                <div className="mt-8 flex justify-end gap-4">
                    <button onClick={onClose} className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-500 font-bold py-2 px-6 rounded-lg">Cancel</button>
                    <button
                       onClick={handleAnalyze}
                       disabled={isLoading}
                       className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg flex items-center justify-center disabled:opacity-50 min-w-[120px]"
                    >
                       {isLoading ? <SpinnerIcon className="w-5 h-5"/> : 'Analyze'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CvAnalyzerModal;
