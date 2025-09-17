import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout.tsx';
import useNavLinks from '../hooks/useNavLinks.ts';
import { ChartBarIcon, UsersIcon, VideoCameraIcon, SparklesIcon, DocumentReportIcon } from '../components/icons.tsx';
import { useNotification } from '../contexts/NotificationContext.tsx';
import { generateSmartReportWithAI } from '../services/mockApi.ts';
import { SmartReport } from '../types.ts';
import SmartReportModal from '../components/SmartReportModal.tsx';

interface ReportTypeCardProps {
    icon: React.FC<{ className?: string }>;
    title: string;
    description: string;
    color: 'blue' | 'green' | 'purple' | 'yellow';
}

const ReportTypeCard: React.FC<ReportTypeCardProps> = ({ icon: Icon, title, description, color }) => {
    return (
        <div className={`p-6 rounded-2xl bg-gradient-to-br from-${color}-50 to-${color}-100 dark:from-slate-800 dark:to-slate-800 border-l-4 border-${color}-500`}>
            <Icon className={`w-8 h-8 text-${color}-500 mb-3`} />
            <h4 className="text-lg font-bold">{title}</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{description}</p>
        </div>
    );
};

const TeacherReportsPage: React.FC = () => {
    const navLinks = useNavLinks();
    const { addNotification } = useNotification();

    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);
    const [smartReport, setSmartReport] = useState<SmartReport | null>(null);

    const handleGenerateSmartReport = async () => {
        setIsReportModalOpen(true);
        setIsGeneratingReport(true);
        setSmartReport(null);
        try {
            // In a real app, we'd pass the current user's ID
            const report = await generateSmartReportWithAI('teacher-1');
            setSmartReport(report);
        } catch (error) {
            addNotification("Failed to generate AI report.", "error");
            setIsReportModalOpen(false); // Close modal on error
        } finally {
            setIsGeneratingReport(false);
        }
    };

    const headerActions = (
        <button onClick={handleGenerateSmartReport} className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg flex items-center">
            <SparklesIcon className="w-5 h-5 mr-2" />
            Generate Smart Report
        </button>
    );

    return (
        <>
            <DashboardLayout navLinks={navLinks} pageTitle="Reports & Statistics" headerActions={headerActions}>
                {/* Report Types */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <ReportTypeCard icon={ChartBarIcon} title="Performance Report" description="Overall hiring and assessment performance." color="blue" />
                    <ReportTypeCard icon={UsersIcon} title="Candidates Report" description="Detailed statistics on candidates and evaluations." color="green" />
                    <ReportTypeCard icon={VideoCameraIcon} title="Interviews Report" description="Analysis of interviews and success rates." color="purple" />
                    <ReportTypeCard icon={SparklesIcon} title="AI Insights" description="Smart analysis and future trend predictions." color="yellow" />
                </div>

                {/* Executive Dashboard */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg mb-8">
                    <h3 className="text-xl font-bold mb-4">Executive Summary</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        <div className="text-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                            <div className="text-3xl font-bold text-blue-600">2,847</div>
                            <div className="text-sm">Total Candidates</div>
                        </div>
                        <div className="text-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                            <div className="text-3xl font-bold text-green-600">1,247</div>
                            <div className="text-sm">Assessments Done</div>
                        </div>
                         <div className="text-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                            <div className="text-3xl font-bold text-purple-600">847</div>
                            <div className="text-sm">Interviews Done</div>
                        </div>
                        <div className="text-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                            <div className="text-3xl font-bold text-yellow-600">234</div>
                            <div className="text-sm">Successful Hires</div>
                        </div>
                         <div className="text-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                            <div className="text-3xl font-bold text-red-600">18</div>
                            <div className="text-sm">Avg. Days to Hire</div>
                        </div>
                         <div className="text-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                            <div className="text-3xl font-bold text-teal-600">89%</div>
                            <div className="text-sm">Satisfaction Rate</div>
                        </div>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Reports */}
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
                        <h3 className="text-xl font-bold mb-4">Recent Reports</h3>
                        {/* List of recent reports would go here */}
                        <div className="text-center py-10 text-slate-500">
                            <DocumentReportIcon className="w-12 h-12 mx-auto mb-2 text-slate-400"/>
                            <p>Generated reports will appear here.</p>
                        </div>
                    </div>
                    {/* Report Builder */}
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
                        <h3 className="text-xl font-bold mb-4">Custom Report Builder</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Report Type</label>
                                <select className="w-full p-2 bg-slate-100 dark:bg-slate-700 rounded-md">
                                    <option>Comprehensive Report</option>
                                    <option>Performance Report</option>
                                </select>
                            </div>
                             <div>
                                <label className="block text-sm font-medium mb-1">Date Range</label>
                                <input type="date" className="w-full p-2 bg-slate-100 dark:bg-slate-700 rounded-md" />
                            </div>
                            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg">
                                Generate Report
                            </button>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
            <SmartReportModal
                isOpen={isReportModalOpen}
                onClose={() => setIsReportModalOpen(false)}
                isLoading={isGeneratingReport}
                report={smartReport}
            />
        </>
    );
};

export default TeacherReportsPage;
