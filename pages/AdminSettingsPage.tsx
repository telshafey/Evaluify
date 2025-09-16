import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import useNavLinks from '../hooks/useNavLinks';
import { PlatformSettings } from '../types';
import { getPlatformSettings, savePlatformSettings } from '../services/mockApi';
import { useNotification } from '../contexts/NotificationContext';
import { useTheme } from '../App';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminSettingsPage: React.FC = () => {
    const navLinks = useNavLinks();
    const { addNotification } = useNotification();
    const { setTheme } = useTheme();
    const [settings, setSettings] = useState<PlatformSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                setLoading(true);
                const data = await getPlatformSettings();
                setSettings(data);
            } catch (error) {
                addNotification("Could not load settings.", "error");
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, [addNotification]);

    const handleChange = (field: keyof PlatformSettings, value: any) => {
        if (settings) {
            setSettings({ ...settings, [field]: value });
        }
    };
    
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!settings) return;
        
        setIsSaving(true);
        try {
            const savedSettings = await savePlatformSettings(settings);
            setSettings(savedSettings);
            setTheme({ platformName: savedSettings.platformName, primaryColor: savedSettings.primaryColor });
            addNotification("Settings saved successfully!", "success");
        } catch (error) {
            addNotification("Failed to save settings.", "error");
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return <DashboardLayout navLinks={navLinks} pageTitle="Platform Settings"><LoadingSpinner /></DashboardLayout>;
    }

    return (
        <DashboardLayout navLinks={navLinks} pageTitle="Platform Settings">
            <form onSubmit={handleSave}>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg mb-6">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Branding</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="platformName" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Platform Name</label>
                            <input type="text" id="platformName" value={settings?.platformName || ''} onChange={e => handleChange('platformName', e.target.value)} className="mt-1 block w-full p-2 bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded-md shadow-sm" />
                        </div>
                        <div>
                            <label htmlFor="primaryColor" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Primary Color</label>
                            <input type="color" id="primaryColor" value={settings?.primaryColor || '#10b981'} onChange={e => handleChange('primaryColor', e.target.value)} className="mt-1 block w-full h-10 p-1 bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded-md shadow-sm" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Features</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="proctoringSensitivity" className="block text-sm font-medium text-slate-700 dark:text-slate-300">AI Proctoring Sensitivity</label>
                            <select id="proctoringSensitivity" value={settings?.proctoringSensitivity || 'medium'} onChange={e => handleChange('proctoringSensitivity', e.target.value)} className="mt-1 block w-full p-2 bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded-md shadow-sm">
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                         <div className="flex items-center mt-6">
                            <input type="checkbox" id="enableMarketplace" checked={settings?.enableMarketplace || false} onChange={e => handleChange('enableMarketplace', e.target.checked)} className="h-4 w-4 text-primary-600 border-slate-300 rounded" />
                            <label htmlFor="enableMarketplace" className="ml-2 block text-sm text-slate-900 dark:text-slate-200">Enable Question Marketplace</label>
                        </div>
                    </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                    <button type="submit" disabled={isSaving} className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-6 rounded-lg disabled:opacity-50">
                        {isSaving ? 'Saving...' : 'Save Settings'}
                    </button>
                </div>
            </form>
        </DashboardLayout>
    );
};

export default AdminSettingsPage;