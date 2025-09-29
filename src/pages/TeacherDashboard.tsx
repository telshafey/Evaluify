import React, { useState, useEffect } from 'react';
import useNavLinks from '../hooks/useNavLinks';
import RecentAssessmentsCard from '../components/dashboard/RecentAssessmentsCard';
import AIInsightsCard from '../components/dashboard/AIInsightsCard';
import PerformanceBySubjectCard from '../components/dashboard/PerformanceBySubjectCard';
import { BookOpenIcon, UsersIcon, CheckCircleIcon, ChartBarIcon } from '../components/icons';
import { getDashboardStats, getRecentAssessments, getPerformanceBySubject, getAIInsights } from '../services/mockApi';
import { DashboardStats, RecentAssessment, PerformanceBySubject, AIInsight, UserRole } from '../types';
import GenericDashboard from '../components/dashboard/GenericDashboard';
import DashboardLayout from '../components/DashboardLayout';

const statCardsConfig = [
    { icon: BookOpenIcon, key: 'stat1' as const, color: 'blue' as const },
    { icon: UsersIcon, key: 'stat2' as const, color: 'purple' as const },
    { icon: CheckCircleIcon, key: 'stat3' as const, color: 'green' as const },
    { icon: ChartBarIcon, key: 'stat4' as const, color: 'yellow' as const },
];

const TeacherDashboard: React.FC = () => {
    const navLinks = useNavLinks();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [recentAssessments, setRecentAssessments] = useState<RecentAssessment[] | null>(null);
    const [performanceData, setPerformanceData] = useState<PerformanceBySubject[] | null>(null);
    const [insights, setInsights] = useState<AIInsight[] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [statsData, assessmentsData, perfData, insightsData] = await Promise.all([
                    getDashboardStats(UserRole.Teacher),
                    getRecentAssessments(),
                    getPerformanceBySubject(),
                    getAIInsights(),
                ]);
                setStats(statsData);
                setRecentAssessments(assessmentsData);
                setPerformanceData(perfData);
                setInsights(insightsData);
            } catch (error) {
                console.error("Failed to load teacher dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <DashboardLayout navLinks={navLinks} pageTitle="Teacher Dashboard">
            <GenericDashboard loading={loading} stats={stats} statCardsConfig={statCardsConfig}>
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        {recentAssessments && <RecentAssessmentsCard assessments={recentAssessments} />}
                    </div>
                    <div>
                        {performanceData && <PerformanceBySubjectCard performanceData={performanceData} />}
                    </div>
                     <div className="lg:col-span-3">
                        {insights && <AIInsightsCard insights={insights} />}
                    </div>
                </div>
            </GenericDashboard>
        </DashboardLayout>
    );
};

export default TeacherDashboard;