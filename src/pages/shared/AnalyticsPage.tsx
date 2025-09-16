import React, { useEffect, useState, useRef } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import useNavLinks from '../../hooks/useNavLinks';
import { getAnalyticsData } from '../../services/mockApi';
import { AnalyticsData } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useDarkMode } from '../../contexts/DarkModeContext';
import { useTheme } from '../../App';

// Since Chart.js is loaded from a CDN, we need to declare it to TypeScript
declare var Chart: any;

interface AnalyticsPageProps {
    pageTitle: string;
    description: string;
}

const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ pageTitle, description }) => {
    const navLinks = useNavLinks();
    const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const { isDarkMode } = useDarkMode();
    const { theme } = useTheme();

    // Refs for chart canvases
    const scoresOverTimeChartRef = useRef<HTMLCanvasElement>(null);
    const passFailChartRef = useRef<HTMLCanvasElement>(null);
    const categoryPerfChartRef = useRef<HTMLCanvasElement>(null);
    const difficultyScoreChartRef = useRef<HTMLCanvasElement>(null);

    // Refs to store chart instances
    const chartInstances = useRef<{ [key: string]: any }>({});
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await getAnalyticsData();
                setAnalyticsData(data);
            } catch (error) {
                console.error("Failed to load analytics data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (!analyticsData || loading) return;

        // Common chart options
        const getChartOptions = (title: string) => {
            const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
            const textColor = isDarkMode ? '#cbd5e1' : '#475569';
            return {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: textColor } },
                    title: { display: true, text: title, color: textColor, font: { size: 16 } }
                },
                scales: {
                    y: { ticks: { color: textColor }, grid: { color: gridColor } },
                    x: { ticks: { color: textColor }, grid: { color: gridColor } }
                }
            };
        };

        const destroyCharts = () => {
            Object.values(chartInstances.current).forEach(chart => chart.destroy());
            chartInstances.current = {};
        };
        destroyCharts(); // Destroy previous instances before creating new ones
        
        // Scores Over Time Chart (Line)
        if (scoresOverTimeChartRef.current) {
            chartInstances.current.scoresOverTime = new Chart(scoresOverTimeChartRef.current, {
                type: 'line',
                data: {
                    labels: analyticsData.scoresOverTime.labels,
                    datasets: [{
                        label: 'Average Score',
                        data: analyticsData.scoresOverTime.scores,
                        borderColor: theme.primaryColor,
                        backgroundColor: `${theme.primaryColor}33`,
                        fill: true,
                        tension: 0.3,
                    }]
                },
                options: getChartOptions('Scores Over Time')
            });
        }

        // Pass/Fail Rate Chart (Doughnut)
        if (passFailChartRef.current) {
            const options = getChartOptions('Overall Pass/Fail Rate');
            delete (options as any).scales; // Doughnut chart doesn't need scales
             chartInstances.current.passFail = new Chart(passFailChartRef.current, {
                type: 'doughnut',
                data: {
                    labels: ['Pass', 'Fail'],
                    datasets: [{
                        label: 'Rate',
                        data: [analyticsData.passFailRate.pass, analyticsData.passFailRate.fail],
                        backgroundColor: [theme.primaryColor, '#ef4444'],
                        borderColor: isDarkMode ? '#334155' : '#ffffff',
                        borderWidth: 2,
                    }]
                },
                options: options
            });
        }

        // Performance by Category (Radar)
        if (categoryPerfChartRef.current) {
             const options = getChartOptions('Performance by Category');
             (options.scales as any) = { r: { pointLabels: { color: isDarkMode ? '#cbd5e1' : '#475569' }, grid: { color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' } } };
             chartInstances.current.categoryPerf = new Chart(categoryPerfChartRef.current, {
                type: 'radar',
                data: {
                    labels: analyticsData.performanceByCategory.labels,
                    datasets: [{
                        label: 'Average Score',
                        data: analyticsData.performanceByCategory.scores,
                        backgroundColor: `${theme.primaryColor}40`,
                        borderColor: theme.primaryColor,
                        pointBackgroundColor: theme.primaryColor,
                    }]
                },
                options: options
            });
        }
        
        // Avg Score by Difficulty (Bar)
        if (difficultyScoreChartRef.current) {
             chartInstances.current.difficultyScore = new Chart(difficultyScoreChartRef.current, {
                type: 'bar',
                data: {
                    labels: analyticsData.avgScoreByDifficulty.labels,
                    datasets: [{
                        label: 'Average Score',
                        data: analyticsData.avgScoreByDifficulty.scores,
                        backgroundColor: ['#22c55e', '#f59e0b', '#ef4444'],
                        borderRadius: 5,
                    }]
                },
                options: getChartOptions('Average Score by Difficulty')
            });
        }

        return () => destroyCharts(); // Cleanup on component unmount
    }, [analyticsData, loading, isDarkMode, theme.primaryColor]);

    const ChartContainer: React.FC<{ children: React.ReactNode, title: string }> = ({ children, title }) => (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-bold mb-4 sr-only">{title}</h3>
            <div className="h-80">
                {children}
            </div>
        </div>
    );

    return (
        <DashboardLayout navLinks={navLinks} pageTitle={pageTitle}>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg mb-6">
                <p className="text-slate-600 dark:text-slate-400">{description}</p>
            </div>
            
            {loading ? <div className="flex justify-center items-center"><LoadingSpinner /></div> : (
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ChartContainer title="Scores Over Time Chart">
                        <canvas ref={scoresOverTimeChartRef}></canvas>
                    </ChartContainer>
                    <ChartContainer title="Overall Pass/Fail Rate Chart">
                        <canvas ref={passFailChartRef}></canvas>
                    </ChartContainer>
                    <ChartContainer title="Performance by Category Chart">
                        <canvas ref={categoryPerfChartRef}></canvas>
                    </ChartContainer>
                    <ChartContainer title="Average Score by Difficulty Chart">
                        <canvas ref={difficultyScoreChartRef}></canvas>
                    </ChartContainer>
                </div>
            )}
        </DashboardLayout>
    );
};

export default AnalyticsPage;