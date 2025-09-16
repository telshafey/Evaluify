import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import useNavLinks from '../hooks/useNavLinks';
import StatCard from '../components/dashboard/StatCard';
import RecentAssessmentsCard from '../components/dashboard/RecentAssessmentsCard';
import AIInsightsCard from '../components/dashboard/AIInsightsCard';
import { DocumentTextIcon, UsersIcon, CheckCircleIcon, ChartBarIcon } from '../components/icons';
// Fix: Added imports for mockApi and types
import { getDashboardStats, getRecentAssessments, getAIInsights } from '../services/mockApi';
import { DashboardStats, RecentAssessment, AIInsight, UserRole } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

const CorporateDashboard: React.FC = () => {
    const navLinks = useNavLinks();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [recentAssessments, setRecentAssessments] = useState<RecentAssessment[] | null>(null);
    const [insights, setInsights] = useState<AIInsight[] | null>(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [statsData, assessmentsData, insightsData] = await Promise.all([
                    getDashboardStats(UserRole.Corporate),
                    getRecentAssessments(),
                    getAIInsights(),
                ]);
                setStats(statsData);
                setRecentAssessments(assessmentsData);
                setInsights(insightsData);
            } catch (error) {
                console.error("Failed to load corporate dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
             <DashboardLayout navLinks={navLinks} pageTitle="Corporate Dashboard">
                <div className="flex justify-center items-center h-full">
                    <LoadingSpinner />
                </div>
            </DashboardLayout>
        );
    }


    return (
        <DashboardLayout
            navLinks={navLinks}
            pageTitle="Corporate Dashboard"
        >
            {stats && (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <StatCard icon={DocumentTextIcon} title={stats.stat1.title} value={stats.stat1.value} trend={stats.stat1.trend} color="blue" />
                    <StatCard icon={UsersIcon} title={stats.stat2.title} value={stats.stat2.value} trend={stats.stat2.trend} color="purple" />
                    <StatCard icon={CheckCircleIcon} title={stats.stat3.title} value={stats.stat3.value} trend={stats.stat3.trend} color="green" />
                    <StatCard icon={ChartBarIcon} title={stats.stat4.title} value={stats.stat4.value} trend={stats.stat4.trend} color="yellow" />
                </div>
            )}
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    {insights && <AIInsightsCard insights={insights} />}
                </div>
                <div>
                     {recentAssessments && <RecentAssessmentsCard assessments={recentAssessments} />}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default CorporateDashboard;