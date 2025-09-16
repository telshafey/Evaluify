


import React from 'react';
// Fix: Corrected react-router-dom import syntax.
import { NavLink } from "react-router-dom";
import { useTheme, useLanguage } from '../App';
import { useDarkMode } from '../contexts/DarkModeContext';
import { BookOpenIcon, SunIcon, MoonIcon, ShoppingCartIcon } from './icons';

interface SitePageLayoutProps {
    children: React.ReactNode;
}

const translations = {
    en: {
        products: "Products",
        industries: "Industries",
        whyEvaluify: "Why evaluify",
        integrations: "Integrations",
        customers: "Customers",
        pricing: "Pricing",
        aboutUs: "About Us",
        footerRights: "All Rights Reserved.",
        footerProject: "A project demonstrating modern web application development.",
        langSwitch: "العربية",
    },
    ar: {
        products: "المنتجات",
        industries: "القطاعات",
        whyEvaluify: "لماذا evaluify؟",
        integrations: "التكاملات التقنية",
        customers: "العملاء",
        pricing: "الأسعار",
        aboutUs: "عن المنصة",
        footerRights: "جميع الحقوق محفوظة.",
        footerProject: "مشروع يعرض القدرات الحديثة في تطوير تطبيقات الويب.",
        langSwitch: "English",
    }
};

const SitePageLayout: React.FC<SitePageLayoutProps> = ({ children }) => {
    const { theme } = useTheme();
    const { lang, toggleLang } = useLanguage();
    const { isDarkMode, toggleDarkMode } = useDarkMode();
    const t = translations[lang];

    const navLinks = [
        { to: "/products", text: t.products },
        { to: "/industries", text: t.industries },
        { to: "/why-evaluify", text: t.whyEvaluify },
        { to: "/integrations", text: t.integrations },
        { to: "/customers", text: t.customers },
        { to: "/pricing", text: t.pricing },
        { to: "/about-us", text: t.aboutUs },
    ];

    const NavLinkItem: React.FC<{ to: string, text: string }> = ({ to, text }) => (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `hover:text-primary-500 transition-colors ${isActive ? 'text-primary-500 font-semibold' : ''}`
            }
        >
            {text}
        </NavLink>
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200">
            <header className="sticky top-0 z-40 w-full backdrop-blur-sm bg-slate-50/70 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
                    <NavLink to="/" className="flex items-center">
                        <BookOpenIcon className="w-8 h-8 text-primary-500" />
                        <span className={`text-2xl font-bold ${lang === 'ar' ? 'mr-2' : 'ml-2'}`}>{theme.platformName}</span>
                    </NavLink>
                    <div className="flex items-center space-x-4">
                        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-600 dark:text-slate-300">
                           {navLinks.map(link => <NavLinkItem key={link.to} {...link} />)}
                        </nav>
                        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden md:block"></div>
                        <button title="Cart" className="text-slate-600 dark:text-slate-300 hover:text-primary-500 transition-colors">
                            <ShoppingCartIcon className="w-5 h-5" />
                        </button>
                        <button onClick={toggleLang} className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-500 transition-colors">
                            {t.langSwitch}
                        </button>
                        <button onClick={toggleDarkMode} className="text-slate-600 dark:text-slate-300 hover:text-primary-500 transition-colors">
                            {isDarkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </header>

            <main>
                {children}
            </main>

            <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-slate-500 dark:text-slate-400">
                    <p>&copy; {new Date().getFullYear()} {theme.platformName}. {t.footerRights}</p>
                    <p className="text-sm mt-1">{t.footerProject}</p>
                </div>
            </footer>
        </div>
    );
};

export default SitePageLayout;