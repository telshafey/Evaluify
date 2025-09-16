import React from 'react';
import { AIInsight } from '../../types';
import { SparklesIcon, ChartBarIcon, LightbulbIcon } from '../icons';

const iconMap: { [key: string]: React.FC<{ className?: string }> } = {
    SparklesIcon: SparklesIcon,
    ChartBarIcon: ChartBarIcon,
    LightbulbIcon: LightbulbIcon,
};

const colorClasses = {
    blue: 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400',
    green: 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400',
    purple: 'bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400',
};

interface AIInsightsCardProps {
    insights: AIInsight[];
}

const AIInsightsCard: React.FC<AIInsightsCardProps> = ({ insights }) => {
    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg h-full">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">✨ AI-Powered Insights</h3>
            <div className="space-y-4">
                {insights.map((insight, index) => {
                    const Icon = iconMap[insight.icon];
                    return (
                        <div key={index} className="flex items-start">
                            <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses[insight.color]}`}>
                                {Icon && <Icon className="w-6 h-6" />}
                            </div>
                            <div className="ml-4">
                                <p className="font-semibold text-slate-800 dark:text-slate-100">{insight.title}</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{insight.text}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AIInsightsCard;
