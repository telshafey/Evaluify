import React, { ReactNode } from 'react';
import { Link, useLocation } from "react-router-dom";
import { LogOutIcon, SunIcon, MoonIcon } from './icons';
// FIX: Update import path for AuthContext hooks
import { useAuth, useLanguage, useTheme } from '../contexts/AuthContext';
// FIX: Remove .tsx extension and fix path for DarkModeContext hook
import { useDarkMode } from '../contexts/DarkModeContext';
import AIAssistant from './dashboard/AIAssistant';
import { UserRole } from '../types';

interface NavLink {
  path: string;
  icon: React.FC<{ className?: string }>;
  label: string;
  onClick?: () => void;
  isActive?: boolean;
}

interface DashboardLayoutProps {
  navLinks: NavLink[];
  pageTitle: string;
  children: ReactNode;
  sidebarHeader?: ReactNode;
  headerActions?: ReactNode;
}

const roleDisplayName: Record<UserRole, string> = {
    [UserRole.Admin]: "Administrator",
    [UserRole.Corporate]: "Hiring Manager",
    [UserRole.Examinee]: "Examinee",
    [UserRole.Teacher]: "Instructor",
    [UserRole.TrainingCompany]: "Training Coordinator"
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ navLinks, pageTitle, children, sidebarHeader, headerActions }) => {
  const location = useLocation();
  const { logout, user } = useAuth();
  const { lang, toggleLang } = useLanguage();
  const { theme } = useTheme();
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const langSwitchText = lang === 'en' ? 'العربية' : 'English';
  const langSwitchCode = lang === 'en' ? 'AR' : 'EN';
  const logoutText = lang === 'en' ? 'Profile & Logout' : 'الملف الشخصي / خروج';
  
  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-950">
      {/* Sidebar */}
      <aside className="w-64 text-white p-6 flex flex-col flex-shrink-0 bg-gradient-to-b from-slate-800 to-slate-900" aria-label="Primary Navigation">
          <div className="flex items-center space-x-3 rtl:space-x-reverse mb-8">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🧠</span>
              </div>
              <div>
                  {sidebarHeader ? sidebarHeader : <h1 className="text-xl font-bold">{theme.platformName}</h1>}
              </div>
          </div>

          <nav className="space-y-2 flex-grow">
              {navLinks.map(link => {
                const effectiveIsActive = link.isActive !== undefined ? link.isActive : location.pathname === link.path;
                const linkClasses = `flex items-center p-3 text-base font-normal rounded-lg transition-all duration-200 ${effectiveIsActive ? 'bg-primary-500 text-white font-bold shadow-md' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`;

                const linkAttributes = {
                    'aria-current': effectiveIsActive ? 'page' as const : undefined,
                };

                const linkContent = (
                  <>
                    <link.icon className="w-6 h-6" />
                    <span className="mx-3">{link.label}</span>
                  </>
                );

                return (
                    <div key={link.label}>
                      {link.onClick ? (
                        <button onClick={link.onClick} className={`${linkClasses} w-full text-left`} {...linkAttributes}>
                          {linkContent}
                        </button>
                      ) : (
                        <Link to={link.path} className={linkClasses} {...linkAttributes}>
                          {linkContent}
                        </Link>
                      )}
                    </div>
                )
              })}
          </nav>
          
          <div className="mt-8 p-4 bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl">
              <div className="text-center">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">👨‍💼</span>
                  </div>
                  <h4 className="font-bold">{user?.name || 'User'}</h4>
                  <p className="text-sm opacity-75">{user?.role ? roleDisplayName[user.role] : ''}</p>
                   <button onClick={logout} className="mt-3 bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg text-sm hover:bg-opacity-30 transition-colors w-full">
                        {logoutText}
                    </button>
              </div>
          </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{pageTitle}</h2>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">Welcome back to your dashboard!</p>
                </div>
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    {headerActions}
                    <button onClick={toggleDarkMode} title="Toggle Dark Mode" aria-label="Toggle Dark Mode" className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full">
                        {isDarkMode ? <SunIcon className="w-6 h-6"/> : <MoonIcon className="w-6 h-6"/>}
                    </button>
                     <button onClick={toggleLang} title={langSwitchText} aria-label="Toggle language" className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full font-bold">
                        {langSwitchCode}
                    </button>
                </div>
            </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-8 relative">
            {children}
            <AIAssistant />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;