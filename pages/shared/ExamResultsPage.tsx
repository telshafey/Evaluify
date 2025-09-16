import React, { useState, useEffect } from 'react';
// Fix: Corrected react-router-dom import syntax.
import { Link } from "react-router-dom";
import DashboardLayout from '../../components/DashboardLayout';
import useNavLinks from '../../hooks/useNavLinks';
import { getExamineeResults } from '../../services/mockApi'; // Assuming this can be adapted or a new function is made
import { ExamResult } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import { EyeIcon } from '../../components/icons';

const ExamResultsPage: React.FC = () => {
    const navLinks = useNavLinks();
    const [results, setResults] = useState<ExamResult[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                // In a real app, this would fetch results based on the logged-in user's role and ownership
                // For this mock, we'll just fetch all results.
                const data = await getExamineeResults("all"); // Mocking a fetch for all
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
    };

    return (
        <DashboardLayout navLinks={navLinks} pageTitle="Exam Results">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold mb-4">Submitted Assessments</h3>
                <div className="overflow-x-auto">
                    {loading ? (
                        <LoadingSpinner />
                    ) : (
                        <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                            <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Examinee</th>
                                    <th scope="col" className="px-6 py-3">Exam Title</th>
                                    <th scope="col" className="px-6 py-3">Score</th>
                                    <th scope="col" className="px-6 py-3">Submitted On</th>
                                    <th scope="col" className="px-6 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.map(result => {
                                    const percentage = Math.round((result.score / result.totalPoints) * 100);
                                    return (
                                        <tr key={result.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600">
                                            <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{result.userName}</td>
                                            <td className="px-6 py-4">{result.examTitle}</td>
                                            <td className={`px-6 py-4 font-bold ${getPerformanceColor(percentage)}`}>
                                                {result.score}/{result.totalPoints} ({percentage}%)
                                            </td>
                                            <td className="px-6 py-4">{result.submittedAt.toLocaleDateString()}</td>
                                            <td className="px-6 py-4">
                                                <Link to={`/results/${result.id}`} className="p-2 inline-block text-blue-500 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full" title="View Details">
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
                        <p className="text-center text-slate-500 py-10">No exam results found.</p>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ExamResultsPage;