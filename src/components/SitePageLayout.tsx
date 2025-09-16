import React from 'react';
import { NavLink } from "react-router-dom";
import { useTheme, useLanguage } from '../App';
import { useDarkMode } from '../contexts/DarkModeContext';
import { BookOpenIcon, SunIcon, MoonIcon } from './icons';

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
        company: "Company",
        product: "Product",
        legal: "Legal",
        privacy: "Privacy Policy",
        terms: "Terms of Service",
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
        footerProject: "مشروع لعرض الإمكانيات الحديثة في تطوير تطبيقات الويب.",
        langSwitch: "English",
        company: "الشركة",
        product: "المنتج",
        legal: "قانوني",
        privacy: "سياسة الخصوصية",
        terms: "شروط الخدمة",
    }
};

const SitePageLayout: React.FC<SitePageLayoutProps> = ({ children }) => {
    const { theme } = useTheme();
    const { lang, toggleLang } = useLanguage();
    const { isDarkMode, toggleDarkMode } = useDarkMode();
    const t = translations[lang];

    const productLinks = [
        { to: "/products", text: t.products },
        { to: "/features", text: "Features" }, // Placeholder
        { to: "/pricing", text: t.pricing },
        { to: "/integrations", text: t.integrations },
    ];
    
    const companyLinks = [
         { to: "/about-us", text: t.aboutUs },
         { to: "/customers", text: t.customers },
         { to: "/why-evaluify", text: t.whyEvaluify },
    ];
    
    const legalLinks = [
        { to: "/privacy", text: t.privacy },
        { to: "/terms", text: t.terms },
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
            <header className="sticky top-0 z-40 w-full backdrop-blur-sm bg-white/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
                    <NavLink to="/" className="flex items-center">
                        <BookOpenIcon className="w-8 h-8 text-primary-500" />
                        <span className={`text-2xl font-bold ${lang === 'ar' ? 'mr-2' : 'ml-2'}`}>{theme.platformName}</span>
                    </NavLink>
                    <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600 dark:text-slate-300">
                       <NavLinkItem to="/products" text={t.products} />
                       <NavLinkItem to="/industries" text={t.industries} />
                       <NavLinkItem to="/pricing" text={t.pricing} />
                       <NavLinkItem to="/about-us" text={t.aboutUs} />
                    </nav>
                    <div className="flex items-center space-x-2">
                        <button onClick={toggleDarkMode} className="p-2 text-slate-600 dark:text-slate-300 hover:text-primary-500 rounded-full transition-colors">
                            {isDarkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
                        </button>
                        <button onClick={toggleLang} className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-500 transition-colors p-2 rounded-md">
                            {t.langSwitch}
                        </button>
                    </div>
                </div>
            </header>

            <main>
                {children}
            </main>

            <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="col-span-2 md:col-span-1">
                             <NavLink to="/" className="flex items-center mb-4">
                                <BookOpenIcon className="w-8 h-8 text-primary-500" />
                                <span className={`text-2xl font-bold ${lang === 'ar' ? 'mr-2' : 'ml-2'}`}>{theme.platformName}</span>
                            </NavLink>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">{t.footerProject}</p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-3">{t.product}</h4>
                            <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                                {productLinks.map(link => <li key={link.to}><NavLinkItem {...link}/></li>)}
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-3">{t.company}</h4>
                             <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                                {companyLinks.map(link => <li key={link.to}><NavLinkItem {...link}/></li>)}
                            </ul>
                        </div>
                         <div>
                            <h4 className="font-semibold mb-3">{t.legal}</h4>
                             <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                                {legalLinks.map(link => <li key={link.to}><NavLinkItem {...link}/></li>)}
                            </ul>
                        </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700 text-center text-slate-500 dark:text-slate-400 text-sm">
                        <p>&copy; {new Date().getFullYear()} {theme.platformName}. {t.footerRights}</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default SitePageLayout;