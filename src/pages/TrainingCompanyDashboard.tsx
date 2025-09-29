import React, { useState, useEffect } from 'react';
import useNavLinks from '../hooks/useNavLinks';
import AIInsightsCard from '../components/dashboard/AIInsightsCard';
import CourseCompletionRateCard from '../components/dashboard/CourseCompletionRateCard';
import { DocumentTextIcon, UsersIcon, CheckCircleIcon, BookOpenIcon } from '../components/icons';
import { getDashboardStats, getCourseCompletionData, getAIInsights } from '../services/mockApi';
import { DashboardStats, CourseCompletion, AIInsight, UserRole } from '../types';
import GenericDashboard from '../components/dashboard/GenericDashboard';
import DashboardLayout from '../components/DashboardLayout';

const statCardsConfig = [
    { icon: BookOpenIcon, key: 'stat1' as const, color: 'blue' as const },
    { icon: UsersIcon, key: 'stat2' as const, color: 'purple' as const },
    { icon: CheckCircleIcon, key: 'stat3' as const, color: 'green' as const },
    { icon: DocumentTextIcon, key: 'stat4' as const, color: 'yellow' as const },
];

const TrainingCompanyDashboard: React.FC = () => {
    const navLinks = useNavLinks();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [completionData, setCompletionData] = useState<CourseCompletion[] | null>(null);
    const [insights, setInsights] = useState<AIInsight[] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [statsData, completionRateData, insightsData] = await Promise.all([
                    getDashboardStats(UserRole.TrainingCompany),
                    getCourseCompletionData(),
                    getAIInsights(),
                ]);
                setStats(statsData);
                setCompletionData(completionRateData);
                setInsights(insightsData);
            } catch (error) {
                console.error("Failed to load training company dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <DashboardLayout navLinks={navLinks} pageTitle="Training Dashboard">
            <GenericDashboard loading={loading} stats={stats} statCardsConfig={statCardsConfig}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {completionData && <CourseCompletionRateCard data={completionData} />}
                    {insights && <AIInsightsCard insights={insights} />}
                </div>
            </GenericDashboard>
        </DashboardLayout>
    );
};

export default TrainingCompanyDashboard;