import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import DashboardLayout from '../../components/DashboardLayout';
import useNavLinks from '../../hooks/useNavLinks';
import { VideoCameraIcon, CalendarIcon, EyeIcon } from '../../components/icons';
import { getLiveInterviews } from '../../services/mockApi';
import { Interview } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';

interface InterviewsPageProps {
    pageTitle: string;
}

const InterviewsPage: React.FC<InterviewsPageProps> = ({ pageTitle }) => {
    const navLinks = useNavLinks();
    const [liveInterviews, setLiveInterviews] = useState<Interview[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInterviews = async () => {
            try {
                setLoading(true);
                const data = await getLiveInterviews();
                setLiveInterviews(data);
            } catch (error) {
                console.error("Failed to load interviews", error);
            } finally {
                setLoading(false);
            }
        };
        fetchInterviews();
    }, []);

    const schedule = [
        { time: '10:00 AM', candidate: 'Ahmed Salem', role: 'Frontend Developer', type: 'Technical', status: 'In Progress' },
        { time: '02:00 PM', candidate: 'Sara Ahmed', role: 'UI/UX Designer', type: 'Behavioral', status: 'Upcoming' },
        { time: '04:30 PM', candidate: 'Mohamed Ali', role: 'Backend Developer', type: 'Final', status: 'Upcoming' },
    ];
    
    const history = [
        { id: 'hist-1', candidate: 'Ahmed Salem', type: 'Technical', date: 'Mar 20, 2024', duration: '45 min', score: 9.2, status: 'Completed' },
        { id: 'hist-2', candidate: 'Sara Ahmed', type: 'Behavioral', date: 'Mar 19, 2024', duration: '32 min', score: 8.5, status: 'Completed' },
    ];

    const headerActions = (
        <>
            <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg flex items-center">
                <VideoCameraIcon className="w-5 h-5 mr-2"/> New Interview
            </button>
             <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg flex items-center">
                <CalendarIcon className="w-5 h-5 mr-2"/> Schedule
            </button>
        </>
    );

    return (
        <DashboardLayout navLinks={navLinks} pageTitle={pageTitle} headerActions={headerActions}>
            {/* Live Interviews */}
            <div className="mb-8">
                <h3 className="text-xl font-bold mb-4">Live Interviews</h3>
                {loading ? <LoadingSpinner /> : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {liveInterviews.map(interview => (
                            <div key={interview.id} className="bg-slate-800 text-white p-6 rounded-2xl shadow-lg">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                                        <span className="font-bold">Live</span>
                                    </div>
                                    <span className="text-sm font-mono">--:--</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="bg-slate-700 h-24 rounded-lg flex items-center justify-center text-center"><div><p className="text-lg">👩‍💼</p><p className="text-sm">{interview.candidateName}</p></div></div>
                                    <div className="bg-slate-700 h-24 rounded-lg flex items-center justify-center text-center"><div><p className="text-lg">👨‍💻</p><p className="text-sm">{interview.interviewerName}</p></div></div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex space-x-2">
                                        <Link to={`/interviews/${interview.id}`} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm">Join</Link>
                                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">Monitor</button>
                                    </div>
                                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${interview.typeColor}`}>{interview.type}</span>
                                </div>
                            </div>
                        ))}
                         {liveInterviews.length === 0 && <p className="text-slate-500">No live interviews at the moment.</p>}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Today's Schedule */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
                    <h3 className="text-xl font-bold mb-4">Today's Schedule</h3>
                    <div className="space-y-4">
                        {schedule.map(item => (
                            <div key={item.time} className={`p-4 rounded-xl ${item.status === 'In Progress' ? 'bg-blue-50 dark:bg-blue-900/50' : 'bg-slate-50 dark:bg-slate-700/50'}`}>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="font-bold">{item.candidate}</p>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">{item.role}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-slate-800 dark:text-slate-200">{item.time}</p>
                                        <p className={`text-sm ${item.status === 'In Progress' ? 'text-blue-500' : 'text-slate-500'}`}>{item.status}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Interview History */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
                    <h3 className="text-xl font-bold mb-4">Interview History</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="text-left text-slate-500 dark:text-slate-400"><tr><th className="p-2">Candidate</th><th className="p-2">Type</th><th className="p-2">Score</th><th className="p-2">Actions</th></tr></thead>
                            <tbody>
                                {history.map(item => (
                                    <tr key={item.id} className="border-b border-slate-200 dark:border-slate-700">
                                        <td className="p-2 font-medium">{item.candidate}</td>
                                        <td className="p-2 text-slate-600 dark:text-slate-300">{item.type}</td>
                                        <td className="p-2 font-bold text-green-600">{item.score}/10</td>
                                        <td className="p-2">
                                            <button className="text-blue-500 hover:text-blue-600 p-1"><EyeIcon className="w-5 h-5"/></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default InterviewsPage;