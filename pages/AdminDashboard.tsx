
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import useNavLinks from '../hooks/useNavLinks';
import StatCard from '../components/dashboard/StatCard';
import { UsersIcon, DocumentTextIcon, BookOpenIcon, ShieldCheckIcon } from '../components/icons';
// Fix: Added imports for mockApi and types
import { getDashboardStats } from '../services/mockApi';
import { DashboardStats, UserRole } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminDashboard: React.FC = () => {
    const navLinks = useNavLinks();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

     useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const statsData = await getDashboardStats(UserRole.Admin);
                setStats(statsData);
            } catch (error) {
                console.error("Failed to load admin dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
             <DashboardLayout navLinks={navLinks} pageTitle="Admin Dashboard">
                <div className="flex justify-center items-center h-full">
                    <LoadingSpinner />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout
            navLinks={navLinks}
            pageTitle="Admin Dashboard"
        >
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <StatCard icon={UsersIcon} title={stats.stat1.title} value={stats.stat1.value} trend={stats.stat1.trend} color="blue" />
                    <StatCard icon={DocumentTextIcon} title={stats.stat2.title} value={stats.stat2.value} trend={stats.stat2.trend} color="purple" />
                    <StatCard icon={BookOpenIcon} title={stats.stat3.title} value={stats.stat3.value} trend={stats.stat3.trend} color="green" />
                    <StatCard icon={ShieldCheckIcon} title={stats.stat4.title} value={stats.stat4.value} trend={stats.stat4.trend} color="yellow" />
                </div>
            )}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Platform Overview</h3>
                <p className="text-slate-600 dark:text-slate-400">
                    Welcome to the admin control panel. From here you can manage users, exams, question banks, and system settings.
                </p>
            </div>
        </DashboardLayout>
    );
};

export default AdminDashboard;
