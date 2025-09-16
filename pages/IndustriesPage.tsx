

import React from 'react';
import SitePageLayout from '../components/SitePageLayout';
import { useLanguage } from '../App';

const translations = {
    en: {
        title: "Industries We Serve",
        description: "evaluify provides tailored assessment solutions for a wide range of industries, including higher education, corporate training, certification programs, and government agencies. Discover how our platform can be customized to fit the unique challenges of your sector.",
    },
    ar: {
        title: "القطاعات التي نخدمها",
        description: "توفر evaluify حلول تقييم مخصصة لمجموعة واسعة من القطاعات، بما في ذلك التعليم العالي وتدريب الشركات وبرامج الشهادات والجهات الحكومية. اكتشف كيف يمكن تخصيص منصتنا لتناسب التحديات الفريدة لقطاعك.",
    }
};

const IndustriesPage = () => {
    const { lang } = useLanguage();
    const t = translations[lang];
    
    return (
        <SitePageLayout>
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100">{t.title}</h1>
                    <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                        {t.description}
                    </p>
                </div>
            </main>
        </SitePageLayout>
    );
};

export default IndustriesPage;