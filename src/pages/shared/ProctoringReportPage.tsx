import React, { useState, useEffect } from 'react';
// Fix: Corrected react-router-dom import syntax.
import { useParams, Link } from "react-router-dom";
import DashboardLayout from '../../components/DashboardLayout.tsx';
import useNavLinks from '../../hooks/useNavLinks.ts';
import { getExamResultDetails } from '../../services/mockApi.ts';
import { ExamResult, ProctoringEvent } from '../../types.ts';
import LoadingSpinner from '../../components/LoadingSpinner.tsx';
import { ShieldCheckIcon, ClockIcon } from '../../components/icons.tsx';

const eventDetails: Record<ProctoringEvent['type'], { title: string; description: string; icon: string; }> = {
    tab_switch: {
        title: 'Tab Switch Detected',
        description: 'The user switched to a different browser tab or application.',
        icon: '🖥️',
    },
    paste_content: {
        title: 'Paste Detected',
        description: 'Content was pasted into an answer field, potentially from an external source.',
        icon: '📋',
    },
    face_detection: {
        title: 'Face Anomaly',
        description: 'Multiple faces were detected, or the primary user was not visible.',
        icon: '👥',
    },
    noise_detection: {
        title: 'Noise Detected',
        description: 'Significant background noise or talking was detected.',
        icon: '🔊',
    }
};

const severityColors: Record<ProctoringEvent['severity'] & string, string> = {
    low: 'border-yellow-500',
    medium: 'border-orange-500',
    high: 'border-red-500',
};


const ProctoringReportPage: React.FC = () => {
    const { resultId } = useParams<{ resultId: string }>();
    const navLinks = useNavLinks();
    const [result, setResult] = useState<ExamResult | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            if (!resultId) return;
            try {
                const data = await getExamResultDetails(resultId);
                setResult(data?.result || null);
            } catch (error) {
                console.error("Failed to fetch result details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [resultId]);

    const formatTimestamp = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };
    
    if (loading) {
        return <DashboardLayout navLinks={navLinks} pageTitle="Loading Report..."><div className="flex justify-center items-center h-full"><LoadingSpinner /></div></DashboardLayout>;
    }

    if (!result) {
        return <DashboardLayout navLinks={navLinks} pageTitle="Error"><p className="text-center">Report not found.</p></DashboardLayout>;
    }
    
    const highRiskEvents = result.proctoringEvents?.filter(e => e.severity === 'high').length ?? 0;
    const mediumRiskEvents = result.proctoringEvents?.filter(e => e.severity === 'medium').length ?? 0;
    const lowRiskEvents = result.proctoringEvents?.filter(e => e.severity === 'low').length ?? 0;
    const totalEvents = highRiskEvents + mediumRiskEvents + lowRiskEvents;
    
    const riskLevel = totalEvents > 5 || highRiskEvents > 0 ? 'High' : totalEvents > 2 || mediumRiskEvents > 0 ? 'Medium' : 'Low';
    const riskColor = riskLevel === 'High' ? 'bg-red-500' : riskLevel === 'Medium' ? 'bg-orange-500' : 'bg-green-500';

    return (
        <DashboardLayout
            navLinks={navLinks}
            pageTitle={`AI Proctoring Report: ${result.userName}`}
        >
            <div className="mb-4">
                <Link to={`/results/${result.id}`} className="text-primary-500 hover:underline">
                    &larr; Back to Result Summary
                </Link>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
                    <h3 className="text-xl font-bold mb-4">Event Timeline</h3>
                    <div className="relative border-l-2 border-slate-200 dark:border-slate-700 pl-6 space-y-6">
                        {result.proctoringEvents?.length === 0 && <p className="text-slate-500">No proctoring events were recorded.</p>}
                        {result.proctoringEvents?.map((event, index) => {
                             const details = eventDetails[event.type];
                             const color = severityColors[event.severity || 'low'];
                             return (
                                <div key={index} className={`relative p-4 rounded-lg border-l-4 ${color} bg-slate-50 dark:bg-slate-700/50`}>
                                     <div className="absolute -left-8 top-5 w-4 h-4 bg-primary-500 rounded-full border-4 border-white dark:border-slate-800"></div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <span className="text-2xl mr-3">{details.icon}</span>
                                            <div>
                                                <h4 className="font-bold text-slate-800 dark:text-slate-100">{details.title}</h4>
                                                <p className="text-sm text-slate-600 dark:text-slate-400">{details.description}</p>
                                            </div>
                                        </div>
                                        <div className="text-sm font-mono text-slate-500 dark:text-slate-300 flex items-center">
                                            <ClockIcon className="w-4 h-4 mr-1"/>
                                            {formatTimestamp(event.timestamp)}
                                        </div>
                                    </div>
                                </div>
                             )
                        })}
                    </div>
                </div>
                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
                        <h3 className="text-xl font-bold mb-4 flex items-center"><ShieldCheckIcon className="w-6 h-6 mr-2" /> Overall Integrity Score</h3>
                        <div className="text-center">
                             <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center text-white text-3xl font-bold ${riskColor}`}>
                                {riskLevel}
                            </div>
                            <p className="mt-4 text-slate-600 dark:text-slate-400">
                                Based on {totalEvents} potential integrity flags.
                            </p>
                        </div>
                    </div>
                     <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
                        <h3 className="text-xl font-bold mb-4">Event Summary</h3>
                         <div className="space-y-2 text-sm">
                             <div className="flex justify-between"><span>High Risk Events:</span><span className="font-bold text-red-500">{highRiskEvents}</span></div>
                             <div className="flex justify-between"><span>Medium Risk Events:</span><span className="font-bold text-orange-500">{mediumRiskEvents}</span></div>
                             <div className="flex justify-between"><span>Low Risk Events:</span><span className="font-bold text-yellow-500">{lowRiskEvents}</span></div>
                         </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ProctoringReportPage;