import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import useNavLinks from '../hooks/useNavLinks';
import { SparklesIcon, UploadIcon, VideoCameraIcon, ChartBarIcon } from '../components/icons';

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

const TeacherAIToolsPage: React.FC = () => {
    const navLinks = useNavLinks();

    return (
        <DashboardLayout navLinks={navLinks} pageTitle="AI Tools">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Smart Question Generator */}
                <ToolCard icon={SparklesIcon} title="Smart Question Generator" color="purple">
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Generate custom questions based on topic, difficulty, and type.</p>
                    <button className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg font-bold">✨ Generate Questions</button>
                </ToolCard>
                
                {/* CV Analyzer */}
                <ToolCard icon={UploadIcon} title="CV / Resume Analyzer" color="blue">
                     <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Upload a CV to automatically extract skills, experience, and match score.</p>
                    <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-4 text-center">
                        <p className="text-sm text-slate-500">Drag & drop a file here</p>
                        <button className="mt-2 bg-blue-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-600">📎 Choose File</button>
                    </div>
                </ToolCard>
                
                {/* Interview Assistant */}
                <ToolCard icon={VideoCameraIcon} title="Interview Assistant" color="green">
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Get real-time guidance, question suggestions, and sentiment analysis during live interviews.</p>
                    <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-bold">🚀 Activate Assistant</button>
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

        </DashboardLayout>
    );
};

export default TeacherAIToolsPage;