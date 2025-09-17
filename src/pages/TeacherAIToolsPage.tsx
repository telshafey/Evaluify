import React, { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import useNavLinks from '../hooks/useNavLinks';
import { SparklesIcon, UploadIcon, VideoCameraIcon, ChartBarIcon, SpinnerIcon } from '../components/icons';
import { analyzeCvWithAI, addQuestionToBank } from '../services/mockApi';
import { CvAnalysisResult, Question } from '../types';
import { useNotification } from '../contexts/NotificationContext';
import CvAnalysisResultModal from '../components/CvAnalysisResultModal';
import { AIQuestionGeneratorModal } from '../components/AIQuestionGeneratorModal';


interface ToolCardProps {
    icon: React.FC<{ className?: string }>;
    title: string;
    children: React.ReactNode;
    color: 'purple' | 'blue' | 'green';
}

const ToolCard: React.FC<ToolCardProps> = ({ icon: Icon, title, children, color }) => {
    const colorClasses = {
        purple: 'border-purple-500 shadow-purple-500/10',
        blue: 'border-blue-500 shadow-blue-500/10',
        green: 'border-green-500 shadow-green-500/10',
    };
    return (
        <div className={`bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border-t-4 ${colorClasses[color]}`}>
            <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center">
                    <Icon className={`w-6 h-6 text-${color}-500`} />
                </div>
                <div>
                    <h4 className="text-lg font-bold">{title}</h4>
                </div>
            </div>
            {children}
        </div>
    );
};

// New component for the CV Analyzer logic
const CvAnalyzer: React.FC = () => {
    const [cvFile, setCvFile] = useState<File | null>(null);
    const [jobDescription, setJobDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<CvAnalysisResult | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { addNotification } = useNotification();

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            // For demo purposes, we'll only accept .txt files to avoid complex parsing.
            if (file.type === 'text/plain') {
                 setCvFile(file);
            } else {
                addNotification("For this demo, please upload a .txt file.", "error");
                e.target.value = ''; // Reset file input
            }
        }
    };

    const handleAnalyze = () => {
        if (!cvFile) {
            addNotification("Please select a CV file.", "error");
            return;
        }
        if (!jobDescription.trim()) {
            addNotification("Please enter a job description.", "error");
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
            setAnalysisResult(null);
            try {
                const result = await analyzeCvWithAI(cvText, jobDescription);
                setAnalysisResult(result);
                setIsModalOpen(true);
            } catch (error) {
                addNotification("AI Analysis failed. Please try again.", "error");
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        reader.readAsText(cvFile);
    };

    return (
        <>
            <ToolCard icon={UploadIcon} title="CV / Resume Analyzer" color="blue">
                 <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Upload a CV and job description to get an AI-powered analysis and match score.</p>
                 <div className="space-y-4">
                     <div>
                         <label htmlFor="job-description" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Job Description</label>
                         <textarea
                             id="job-description"
                             rows={4}
                             value={jobDescription}
                             onChange={(e) => setJobDescription(e.target.value)}
                             placeholder="Paste the job description here..."
                             className="w-full p-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm"
                         />
                     </div>
                     <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-4 text-center">
                         <label htmlFor="cv-upload" className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 inline-block">
                             📎 Choose CV File (.txt)
                         </label>
                         <input id="cv-upload" type="file" accept=".txt" className="hidden" onChange={handleFileChange} />
                         {cvFile && <p className="text-sm text-slate-500 mt-2">Selected: {cvFile.name}</p>}
                     </div>
                     <button
                        onClick={handleAnalyze}
                        disabled={isLoading}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-bold flex items-center justify-center disabled:opacity-50"
                     >
                        {isLoading ? <SpinnerIcon className="w-5 h-5"/> : 'Analyze with AI'}
                     </button>
                 </div>
            </ToolCard>
            <CvAnalysisResultModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                result={analysisResult}
            />
        </>
    );
};


const TeacherAIToolsPage: React.FC = () => {
    const navLinks = useNavLinks();
    const navigate = useNavigate();
    const { addNotification } = useNotification();
    const [isAiQuestionModalOpen, setIsAiQuestionModalOpen] = useState(false);

    const handleAddQuestionsFromAI = async (aiQuestions: Omit<Question, 'id'>[]) => {
        setIsAiQuestionModalOpen(false);
        const ownerId = 'teacher-1'; // Hardcoded for demo
        try {
            await Promise.all(
                aiQuestions.map(q => addQuestionToBank({ ...q, ownerId }))
            );
            addNotification(
                `${aiQuestions.length} AI-generated questions have been added to your question bank!`,
                "success"
            );
        } catch (error) {
            addNotification("Failed to add AI-generated questions.", "error");
            console.error("Failed to add questions to bank:", error);
        }
    };


    return (
        <DashboardLayout navLinks={navLinks} pageTitle="AI Tools">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Smart Question Generator */}
                <ToolCard icon={SparklesIcon} title="Smart Question Generator" color="purple">
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Generate custom questions based on topic, difficulty, and type.</p>
                    <button 
                        onClick={() => setIsAiQuestionModalOpen(true)}
                        className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg font-bold"
                    >
                        ✨ Generate Questions
                    </button>
                </ToolCard>
                
                {/* CV Analyzer */}
                <CvAnalyzer />
                
                {/* Interview Assistant */}
                <ToolCard icon={VideoCameraIcon} title="Interview Assistant" color="green">
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Get real-time guidance, question suggestions, and sentiment analysis during live interviews.</p>
                    <button 
                        onClick={() => navigate('/interviews')}
                        className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-bold"
                    >
                        🚀 Activate Assistant
                    </button>
                </ToolCard>
            </div>
            
            {/* Predictive Analytics */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold mb-4 flex items-center"><ChartBarIcon className="w-6 h-6 mr-2" /> Predictive Analytics</h3>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl">
                        <h4 className="font-bold text-blue-800 dark:text-blue-300">Candidate Success Prediction</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">AI predicts a <span className="font-bold">94% success probability</span> for candidates scoring over 90% in technical tests.</p>
                    </div>
                     <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl">
                        <h4 className="font-bold text-green-800 dark:text-green-300">Process Optimization</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Reducing assessment duration to 45 mins can <span className="font-bold">improve completion rates by 23%</span> without impacting quality.</p>
                    </div>
                     <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl">
                        <h4 className="font-bold text-purple-800 dark:text-purple-300">Future Trends</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Demand for AI/ML skills is projected to <span className="font-bold">increase by 67%</span> in the next 6 months.</p>
                    </div>
                </div>
            </div>

            <AIQuestionGeneratorModal
                isOpen={isAiQuestionModalOpen}
                onClose={() => setIsAiQuestionModalOpen(false)}
                onAddQuestions={handleAddQuestionsFromAI}
            />
        </DashboardLayout>
    );
};

export default TeacherAIToolsPage;