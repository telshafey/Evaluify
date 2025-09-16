



import React, { useState, useEffect } from 'react';
// Fix: Corrected react-router-dom import syntax.
import { useNavigate, Link } from "react-router-dom";
// Fix: Added imports for mockApi and types
import { getExamineeDashboardData } from '../services/mockApi';
import { Exam, ExamResult } from '../types';
import { BookOpenIcon, CheckCircleIcon, ClockIcon, UsersIcon, CalendarIcon } from '../components/icons';
import LoadingSpinner from '../components/LoadingSpinner';

const ExamineeDashboard = () => {
  const [upcomingExams, setUpcomingExams] = useState<Omit<Exam, 'questions'>[]>([]);
  const [completedResults, setCompletedResults] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getExamineeDashboardData('current-user-id'); // In a real app, use the actual user ID
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

  const startExam = (examId: string) => {
    navigate(`/examinee/exam/${examId}`);
  };

  return (
    <div className="flex min-h-screen bg-slate-100 dark:bg-slate-900">
      <nav className="w-64 bg-white dark:bg-slate-800 p-5 shadow-lg">
        <h1 className="text-2xl font-bold text-teal-600 dark:text-teal-400 mb-10">Examinee Portal</h1>
        <ul>
          <li className="mb-4">
            <a href="#/examinee" className="flex items-center p-2 text-base font-normal text-slate-900 dark:text-white rounded-lg bg-slate-200 dark:bg-slate-700">
              <BookOpenIcon className="w-6 h-6" />
              <span className="ml-3">Dashboard</span>
            </a>
          </li>
          <li>
            <a href="#/examinee/results" className="flex items-center p-2 text-base font-normal text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700">
              <CheckCircleIcon className="w-6 h-6" />
              <span className="ml-3">My Results</span>
            </a>
          </li>
        </ul>
      </nav>
      <main className="flex-1 p-10">
        <h2 className="text-3xl font-bold mb-8">Your Dashboard</h2>
        
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <section>
                <h3 className="text-2xl font-semibold mb-4 text-slate-700 dark:text-slate-200">Upcoming Exams</h3>
                <div className="space-y-4">
                  {upcomingExams.length > 0 ? upcomingExams.map(exam => (
                    <div key={exam.id} className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md flex items-center justify-between">
                      <div>
                        <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100">{exam.title}</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{exam.description}</p>
                        <div className="flex items-center space-x-4 mt-3 text-sm text-slate-500 dark:text-slate-300">
                          <span className="flex items-center"><CalendarIcon className="w-4 h-4 mr-1"/> Available from: {new Date(exam.availableFrom!).toLocaleDateString()}</span>
                          <span className="flex items-center"><ClockIcon className="w-4 h-4 mr-1"/> {exam.duration} minutes</span>
                        </div>
                      </div>
                      <span className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">Upcoming</span>
                    </div>
                  )) : (
                    <p className="text-slate-500 dark:text-slate-400">You have no upcoming exams scheduled.</p>
                  )}
                </div>
            </section>

            <section className="mt-10">
                <h3 className="text-2xl font-semibold mb-4 text-slate-700 dark:text-slate-200">Recent Results</h3>
                 <div className="space-y-4">
                  {completedResults.length > 0 ? completedResults.map(result => {
                      const percentage = Math.round((result.score / result.totalPoints) * 100);
                      return (
                        <div key={result.id} className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md flex items-center justify-between">
                          <div>
                            <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100">{result.examTitle}</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Submitted on: {result.submittedAt.toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                              <p className={`font-bold text-lg ${percentage >= 80 ? 'text-green-500' : 'text-yellow-500'}`}>{percentage}%</p>
                              <p className="text-sm text-slate-500 dark:text-slate-400">{result.score}/{result.totalPoints}</p>
                          </div>
                        </div>
                      )
                  }) : (
                     <p className="text-slate-500 dark:text-slate-400">You haven't completed any exams yet.</p>
                  )}
                </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default ExamineeDashboard;
