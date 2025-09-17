import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.tsx';
import { UserRole } from '../types.ts';
import { useLanguage } from '../App.tsx';
import { SettingsIcon, XCircleIcon, BookOpenIcon, UsersIcon, BuildingIcon, BriefcaseIcon, ShieldCheckIcon, LogOutIcon } from './icons.tsx';

// Translations
const translations = {
    en: {
        switchRole: "Switch Role",
        logout: "Logout",
        roles: {
            [UserRole.Teacher]: "School / Instructor",
            [UserRole.Examinee]: "Student",
            [UserRole.TrainingCompany]: "Training Center",
            [UserRole.Corporate]: "Corporate",
            [UserRole.Admin]: "Admin",
        },
    },
    ar: {
        switchRole: "تبديل الدور",
        logout: "تسجيل الخروج",
        roles: {
            [UserRole.Teacher]: "معلم / مؤسسة تعليمية",
            [UserRole.Examinee]: "طالب / ممتحن",
            [UserRole.TrainingCompany]: "مركز تدريبي",
            [UserRole.Corporate]: "شركة / توظيف",
            [UserRole.Admin]: "مسؤول",
        },
    }
};

const roleIcons: Record<UserRole, React.FC<{ className?: string }>> = {
    [UserRole.Teacher]: BookOpenIcon,
    [UserRole.Examinee]: UsersIcon,
    [UserRole.TrainingCompany]: BuildingIcon,
    [UserRole.Corporate]: BriefcaseIcon,
    [UserRole.Admin]: ShieldCheckIcon,
};

const DevRoleSwitcher: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { userRole, login, logout } = useAuth();
    const { lang } = useLanguage();
    const t = translations[lang];

    const handleSelectRole = (role: UserRole) => {
        login(role);
        setIsOpen(false);
    };

    const handleLogout = () => {
        logout();
        setIsOpen(false);
    };

    return (
        <div className="fixed bottom-24 right-5 z-[100]">
            {isOpen && (
                <div role="menu" aria-label="Role switcher" className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl ring-1 ring-black ring-opacity-5 mb-3 w-56 animate-fade-in-up">
                    <div className="p-2">
                        <p className="px-2 py-1 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">{t.switchRole}</p>
                        <div className="mt-1 space-y-1">
                            {Object.values(UserRole).map(role => {
                                const Icon = roleIcons[role as UserRole];
                                return (
                                    <button
                                        key={role as UserRole}
                                        onClick={() => handleSelectRole(role as UserRole)}
                                        role="menuitemradio"
                                        aria-checked={userRole === role}
                                        className={`w-full flex items-center text-left px-3 py-2 text-sm rounded-md transition-colors ${
                                            userRole === role
                                                ? 'bg-primary-100 text-primary-800 dark:bg-primary-500/20 dark:text-primary-300'
                                                : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                                        }`}
                                    >
                                        <Icon className="w-5 h-5 me-3" />
                                        {t.roles[role as UserRole]}
                                    </button>
                                );
                            })}
                        </div>
                        {userRole && (
                            <>
                                <div className="my-2 h-px bg-slate-200 dark:bg-slate-700"></div>
                                <button
                                    onClick={handleLogout}
                                    role="menuitem"
                                    className="w-full flex items-center text-left px-3 py-2 text-sm rounded-md text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                                >
                                    <LogOutIcon className="w-5 h-5 me-3" />
                                    {t.logout}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-primary-500 hover:bg-primary-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                aria-label={t.switchRole}
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                {isOpen ? <XCircleIcon className="w-8 h-8" /> : <SettingsIcon className="w-8 h-8" />}
            </button>
            <style>{`
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.2s ease-out;
                }
            `}</style>
        </div>
    );
};

export default DevRoleSwitcher;
