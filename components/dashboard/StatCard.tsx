import React from 'react';

interface StatCardProps {
    icon: React.FC<{ className?: string }>;
    title: string;
    value: string;
    trend: string;
    color: 'green' | 'blue' | 'purple' | 'emerald' | 'yellow';
}

const colorClasses = {
    green: {
        bg: 'from-green-400 to-green-600 dark:from-green-500 dark:to-green-700',
        text: 'text-green-600 dark:text-green-400',
    },
    blue: {
        bg: 'from-blue-400 to-blue-600 dark:from-blue-500 dark:to-blue-700',
        text: 'text-blue-600 dark:text-blue-400',
    },
    purple: {
        bg: 'from-purple-400 to-purple-600 dark:from-purple-500 dark:to-purple-700',
        text: 'text-purple-600 dark:text-purple-400',
    },
    emerald: {
        bg: 'from-emerald-400 to-emerald-600 dark:from-emerald-500 dark:to-emerald-700',
        text: 'text-emerald-600 dark:text-emerald-400',
    },
    yellow: {
        bg: 'from-yellow-400 to-yellow-600 dark:from-yellow-500 dark:to-yellow-700',
        text: 'text-yellow-600 dark:text-yellow-400',
    },
};

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, title, value, trend, color }) => {
    const classes = colorClasses[color];

    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg interactive-card">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">{title}</p>
                    <p className={`text-3xl font-bold mt-2 text-slate-800 dark:text-slate-100`}>{value}</p>
                    <p className={`${classes.text} text-sm mt-1 font-semibold`}>{trend}</p>
                </div>
                <div className={`w-16 h-16 bg-gradient-to-br ${classes.bg} rounded-2xl flex items-center justify-center shadow-lg`}>
                    <Icon className="text-white text-2xl h-8 w-8" />
                </div>
            </div>
        </div>
    );
};

export default StatCard;
