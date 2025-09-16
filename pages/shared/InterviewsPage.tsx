import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import useNavLinks from '../../hooks/useNavLinks';
import { Interview } from '../../types';
import { getInterviews, addInterview } from '../../services/mockApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import { PlusCircleIcon, VideoCameraIcon } from '../../components/icons';
import InterviewFormModal from '../../components/InterviewFormModal';
import { useNotification } from '../../contexts/NotificationContext';
import { useLanguage } from '../../App';

interface InterviewsPageProps {
    pageTitle: string;
}

const translations = {
    en: {
        addInterview: "Schedule Interview",
        candidate: "Candidate",
        role: "Role",
        date: "Date",
        interviewer: "Interviewer",
        status: "Status",
        actions: "Actions",
        start: "Start Interview",
        noInterviews: "No interviews scheduled yet.",
        loadError: "Failed to load interviews.",
        addSuccess: "Interview scheduled successfully!",
        addError: "Failed to schedule interview.",
        statusColors: {
            Scheduled: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
            Completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
            Canceled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
        }
    },
    ar: {
        addInterview: "جدولة مقابلة",
        candidate: "المرشح",
        role: "الدور الوظيفي",
        date: "التاريخ",
        interviewer: "المحاور",
        status: "الحالة",
        actions: "الإجراءات",
        start: "بدء المقابلة",
        noInterviews: "لا توجد مقابلات مجدولة بعد.",
        loadError: "فشل تحميل المقابلات.",
        addSuccess: "تمت جدولة المقابلة بنجاح!",
        addError: "فشل في جدولة المقابلة.",
         statusColors: {
            Scheduled: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
            Completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
            Canceled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
        }
    }
};

const InterviewsPage: React.FC<InterviewsPageProps> = ({ pageTitle }) => {
    const navLinks = useNavLinks();
    const { addNotification } = useNotification();
    const { lang } = useLanguage();
    const t = translations[lang];

    const [interviews, setInterviews] = useState<Interview[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchInterviews = async () => {
            try {
                setLoading(true);
                const data = await getInterviews();
                setInterviews(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
            } catch (error) {
                addNotification(t.loadError, "error");
            } finally {
                setLoading(false);
            }
        };
        fetchInterviews();
    }, [addNotification, t.loadError]);

    const handleSaveInterview = async (interviewData: Omit<Interview, 'id'>) => {
        try {
            const newInterview = await addInterview(interviewData);
            setInterviews(prev => [...prev, newInterview].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
            addNotification(t.addSuccess, "success");
            setIsModalOpen(false);
        } catch (error) {
            addNotification(t.addError, "error");
        }
    };
    
    const headerActions = (
        <button onClick={() => setIsModalOpen(true)} className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded-lg flex items-center">
            <PlusCircleIcon className="w-5 h-5 mr-2" />
            {t.addInterview}
        </button>
    );

    return (
        <DashboardLayout navLinks={navLinks} pageTitle={pageTitle} headerActions={headerActions}>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
                 {loading ? <LoadingSpinner /> : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                            <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
                                <tr>
                                    <th scope="col" className="px-6 py-3">{t.candidate}</th>
                                    <th scope="col" className="px-6 py-3">{t.role}</th>
                                    <th scope="col" className="px-6 py-3">{t.date}</th>
                                    <th scope="col" className="px-6 py-3">{t.status}</th>
                                    <th scope="col" className="px-6 py-3">{t.actions}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {interviews.map(interview => (
                                    <tr key={interview.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700">
                                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{interview.candidateName}</td>
                                        <td className="px-6 py-4">{interview.role}</td>
                                        <td className="px-6 py-4">{new Date(interview.date).toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${t.statusColors[interview.status]}`}>
                                                {interview.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {interview.status === 'Scheduled' && new Date(interview.date) > new Date() && (
                                                <Link to={`/interviews/${interview.id}`} className="font-medium text-primary-600 dark:text-primary-500 hover:underline flex items-center">
                                                   <VideoCameraIcon className="w-4 h-4 mr-1"/> {t.start}
                                                </Link>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {interviews.length === 0 && <p className="text-center py-8 text-slate-500">{t.noInterviews}</p>}
                    </div>
                )}
            </div>
            <InterviewFormModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveInterview}
            />
        </DashboardLayout>
    );
};

export default InterviewsPage;