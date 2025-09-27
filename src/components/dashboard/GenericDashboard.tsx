import React from 'react';
import StatCard from './StatCard';
import StatCardSkeleton from '../skeletons/StatCardSkeleton';
import RecentActivitySkeleton from '../skeletons/RecentActivitySkeleton';
import Skeleton from '../skeletons/Skeleton';
import { DashboardStats } from '../../types';

interface StatCardConfig {
    icon: React.FC<{ className?: string }>;
    key: keyof DashboardStats;
    color: 'green' | 'blue' | 'purple' | 'yellow';
}

interface GenericDashboardProps {
    loading: boolean;
    stats: DashboardStats | null;
    statCardsConfig: StatCardConfig[];
    children: React.ReactNode;
}

const GenericDashboardSkeleton: React.FC = () => (
     <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {[...Array(4)].map((_, i) => <StatCardSkeleton key={i} />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg"><RecentActivitySkeleton /></div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
        </div>
    </>
);


const GenericDashboard: React.FC<GenericDashboardProps> = ({ loading, stats, statCardsConfig, children }) => {
    if (loading) {
        return <GenericDashboardSkeleton />;
    }

    return (
        <>
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    {statCardsConfig.map(config => {
                        const stat = stats[config.key];
                        return (
                             <StatCard 
                                key={String(config.key)}
                                icon={config.icon}
                                title={stat.title}
                                value={stat.value}
                                trend={stat.trend}
                                color={config.color} 
                            />
                        )
                    })}
                </div>
            )}
            {children}
        </>
    );
};

export default GenericDashboard;