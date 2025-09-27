import React, { useState, useEffect } from 'react';
import useNavLinks from '../hooks/useNavLinks.ts';
import AIInsightsCard from '../components/dashboard/AIInsightsCard.tsx';
import HiringPipelineSummaryCard from '../components/dashboard/HiringPipelineSummaryCard.tsx';
import { DocumentTextIcon, UsersIcon, CheckCircleIcon, ChartBarIcon } from '../components/icons.tsx';
import { getDashboardStats, getCandidates, getAIInsights } from '../services/mockApi.ts';
import { DashboardStats, Candidate, AIInsight, UserRole } from '../types.ts';
import GenericDashboard from '../components/dashboard/GenericDashboard.tsx';
import DashboardLayout from '../components/DashboardLayout.tsx';

const statCardsConfig = [
    { icon: DocumentTextIcon, key: 'stat1' as const, color: 'blue' as const },
    { icon: UsersIcon, key: 'stat2' as const, color: 'purple' as const },
    { icon: CheckCircleIcon, key: 'stat3' as const, color: 'green' as const },
    { icon: ChartBarIcon, key: 'stat4' as const, color: 'yellow' as const },
];

const CorporateDashboard: React.FC = () => {
    const navLinks = useNavLinks();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [candidates, setCandidates] = useState<Candidate[] | null>(null);
    const [insights, setInsights] = useState<AIInsight[] | null>(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [statsData, candidatesData, insightsData] = await Promise.all([
                    getDashboardStats(UserRole.Corporate),
                    getCandidates(),
                    getAIInsights(),
                ]);
                setStats(statsData);
                setCandidates(candidatesData);
                setInsights(insightsData);
            } catch (error) {
                console.error("Failed to load corporate dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <DashboardLayout navLinks={navLinks} pageTitle="Corporate Dashboard">
           <GenericDashboard loading={loading} stats={stats} statCardsConfig={statCardsConfig}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        {insights && <AIInsightsCard insights={insights} />}
                    </div>
                    <div>
                         {candidates && <HiringPipelineSummaryCard candidates={candidates} />}
                    </div>
                </div>
           </GenericDashboard>
        </DashboardLayout>
    );
};

export default CorporateDashboard;