import { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { getExamineeDashboardData } from '../services/mockApi.ts';
import { Exam, ExamResult } from '../types.ts';
import { BookOpenIcon, ClockIcon, CalendarIcon } from '../components/icons.tsx';
import LoadingSpinner from '../components/LoadingSpinner.tsx';
import DashboardLayout from '../components/DashboardLayout.tsx';
import useNavLinks from '../hooks/useNavLinks.ts';
import { useLanguage } from '../App.tsx';
import EmptyState from '../components/EmptyState.tsx';

const translations = {
    en: {
        dashboardTitle: "Student Dashboard",
        availableExams: "Available Exams",
        upcomingExams: "Upcoming Exams",
        recentResults: "Recent Results",
        noAvailableExams: "You have no exams available to take right now.",
        noUpcomingExams: "You have no upcoming exams scheduled.",
        noResults: "You haven't completed any exams yet.",
        startExam: "Start Exam",
        review: "Review",
        availableFrom: "Available from",
    },
    ar: {
        dashboardTitle: "لوحة تحكم الطالب",
        availableExams: "الاختبارات المتاحة",
        upcomingExams: "الاختبارات القادمة",
        recentResults: "النتائج الأخيرة",
        noAvailableExams: "ليس لديك أي اختبارات متاحة حاليًا.",
        noUpcomingExams: "ليس لديك أي اختبارات مجدولة قادمة.",
        noResults: "لم تكمل أي اختبارات بعد.",
        startExam: "ابدأ الاختبار",
        review: "مراجعة",
        availableFrom: "متاح من",
    }
}

const ExamineeDashboard = () => {
  const [availableExams, setAvailableExams] = useState<Omit<Exam, 'questions'>[]>([]);
  const [upcomingExams, setUpcomingExams] = useState<Omit<Exam, 'questions'>[]>([]);
  const [completedResults, setCompletedResults] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const navLinks = useNavLinks();
  const { lang } = useLanguage();
  const t = translations[lang];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getExamineeDashboardData('current-user-id');
        setAvailableExams(data.availableExams);
        setUpcomingExams(data.upcomingExams);
        setCompletedResults(data.completedResults);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout navLinks={navLinks} pageTitle={t.dashboardTitle}>
        <div className="flex justify-center items-center h-full">
            <LoadingSpinner />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout navLinks={navLinks} pageTitle={t.dashboardTitle}>
      <div className="space-y-8">
        {/* Available Exams */}
        <section>
          <h3 className="text-2xl font-bold mb-4 text-slate-700 dark:text-slate-200">{t.availableExams}</h3>
          {availableExams.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableExams.map(exam => (
                <div key={exam.id} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg flex flex-col justify-between interactive-card">
                  <div>
                    <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100">{exam.title}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 h-10">{exam.description}</p>
                    <div className="flex items-center space-x-4 mt-3 text-sm text-slate-500 dark:text-slate-300">
                      <span className="flex items-center"><ClockIcon className="w-4 h-4 mr-1"/> {exam.duration} min</span>
                      <span className="flex items-center"><BookOpenIcon className="w-4 h-4 mr-1"/> {exam.questionCount} Questions</span>
                    </div>
                  </div>
                  <button onClick={() => navigate(`/examinee/exam/${exam.id}`)} className="w-full mt-4 bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 rounded-lg transition-colors">
                    {t.startExam}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon={BookOpenIcon} title="All Caught Up!" message={t.noAvailableExams} />
          )}
        </section>

        {/* Upcoming Exams */}
        <section>
          <h3 className="text-2xl font-bold mb-4 text-slate-700 dark:text-slate-200">{t.upcomingExams}</h3>
          {upcomingExams.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingExams.map(exam => (
                 <div key={exam.id} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg opacity-70">
                    <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100">{exam.title}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{exam.description}</p>
                    <div className="flex items-center space-x-4 mt-3 text-sm text-slate-500 dark:text-slate-300">
                      <span className="flex items-center"><CalendarIcon className="w-4 h-4 mr-1"/> {t.availableFrom}: {new Date(exam.availableFrom!).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}</span>
                    </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 dark:text-slate-400">{t.noUpcomingExams}</p>
          )}
        </section>
        
        {/* Recent Results */}
        <section>
          <h3 className="text-2xl font-bold mb-4 text-slate-700 dark:text-slate-200">{t.recentResults}</h3>
          {completedResults.length > 0 ? (
            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-lg">
                <div className="space-y-2">
                {completedResults.map(result => {
                    const percentage = Math.round((result.score / result.totalPoints) * 100);
                    return (
                        <div key={result.id} className="p-4 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 md:flex items-center justify-between">
                            <div className='mb-4 md:mb-0'>
                                <h4 className="font-bold text-slate-800 dark:text-slate-100">{result.examTitle}</h4>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Submitted: {result.submittedAt.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}</p>
                            </div>
                            <div className="flex items-center gap-4 md:gap-6">
                                <div className="text-right">
                                    <p className={`font-bold text-xl ${percentage >= 80 ? 'text-green-500' : 'text-yellow-500'}`}>{percentage}%</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{result.score}/{result.totalPoints}</p>
                                </div>
                                <Link to={`/examinee/result/${result.id}`} className="bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 font-semibold py-2 px-4 rounded-lg text-sm">
                                    {t.review}
                                </Link>
                            </div>
                        </div>
                    )
                })}
                </div>
            </div>
          ) : (
             <p className="text-slate-500 dark:text-slate-400">{t.noResults}</p>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
};

export default ExamineeDashboard;