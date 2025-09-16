
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { getExamineeResults } from '../services/mockApi';
import { ExamResult } from '../types';
import { EyeIcon } from '../components/icons';
import { useLanguage } from '../App';
import DashboardLayout from '../components/DashboardLayout';
import useNavLinks from '../hooks/useNavLinks';
import LoadingSpinner from '../components/LoadingSpinner';

const translations = {
    en: {
        title: "My Results",
        description: "Review your performance on all completed assessments.",
        loading: "Loading your results...",
        empty: "You haven't completed any exams yet.",
        table: {
            examTitle: "Exam Title",
            score: "Score",
            percentage: "Percentage",
            dateSubmitted: "Date Submitted",
            actions: "Actions",
        },
        viewDetails: "View Details",
    },
    ar: {
        title: "نتائجي",
        description: "راجع أداءك في جميع التقييمات التي أكملتها.",
        loading: "جاري تحميل نتائجك...",
        empty: "لم تقم بإكمال أي اختبارات بعد.",
        table: {
            examTitle: "عنوان الاختبار",
            score: "الدرجة",
            percentage: "النسبة المئوية",
            dateSubmitted: "تاريخ التسليم",
            actions: "الإجراءات",
        },
        viewDetails: "عرض التفاصيل",
    }
}

const ExamineeResultsPage = () => {
    const [results, setResults] = useState<ExamResult[]>([]);
    const [loading, setLoading] = useState(true);
    const { lang } = useLanguage();
    const t = translations[lang];
    const navLinks = useNavLinks();

    useEffect(() => {
        const fetchResults = async () => {
            try {
                setLoading(true);
                // In a real app, we'd pass the current user's ID
                const data = await getExamineeResults("current-user-id");
                setResults(data);
            } catch (error) {
                console.error("Failed to fetch results:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, []);

    const getPerformanceColor = (percentage: number) => {
        if (percentage >= 80) return 'text-green-500';
        if (percentage >= 50) return 'text-yellow-500';
        return 'text-red-500';
    }

    return (
        <DashboardLayout navLinks={navLinks} pageTitle={t.title}>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
                <p className="text-slate-600 dark:text-slate-400 mb-4">{t.description}</p>
                <div className="overflow-x-auto">
                    {loading ? (
                        <LoadingSpinner />
                    ) : (
                        <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                            <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
                                <tr>
                                    <th scope="col" className="px-3 md:px-6 py-3">{t.table.examTitle}</th>
                                    <th scope="col" className="px-3 md:px-6 py-3">{t.table.score}</th>
                                    <th scope="col" className="px-3 md:px-6 py-3">{t.table.percentage}</th>
                                    <th scope="col" className="px-3 md:px-6 py-3">{t.table.dateSubmitted}</th>
                                    <th scope="col" className="px-3 md:px-6 py-3">{t.table.actions}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.map(result => {
                                    const percentage = Math.round((result.score / result.totalPoints) * 100);
                                    return (
                                        <tr key={result.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600">
                                            <td className="px-3 md:px-6 py-4 font-medium text-slate-900 whitespace-nowrap dark:text-white">{result.examTitle}</td>
                                            <td className="px-3 md:px-6 py-4">{result.score} / {result.totalPoints}</td>
                                            <td className={`px-3 md:px-6 py-4 font-bold ${getPerformanceColor(percentage)}`}>
                                                {percentage}%
                                            </td>
                                            <td className="px-3 md:px-6 py-4">{result.submittedAt.toLocaleDateString()}</td>
                                            <td className="px-3 md:px-6 py-4">
                                                <Link to={`/examinee/result/${result.id}`} className="p-2 inline-block text-blue-500 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full" title={t.viewDetails}>
                                                  <EyeIcon className="w-5 h-5"/>
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                    {!loading && results.length === 0 && (
                        <p className="text-center text-slate-500 py-10">{t.empty}</p>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ExamineeResultsPage;