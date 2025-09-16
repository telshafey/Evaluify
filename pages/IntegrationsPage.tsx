

import React from 'react';
import SitePageLayout from '../components/SitePageLayout';
import { useLanguage } from '../App';

const translations = {
    en: {
        title: "Integrations",
        description: "Seamlessly connect evaluify with your existing Learning Management System (LMS), Student Information System (SIS), or Applicant Tracking System (ATS). Our robust API and pre-built connectors make integration simple and efficient.",
    },
    ar: {
        title: "التكاملات التقنية",
        description: "قم بتوصيل evaluify بسلاسة مع نظام إدارة التعلم (LMS) الحالي أو نظام معلومات الطالب (SIS) أو نظام تتبع المتقدمين (ATS). واجهة برمجة التطبيقات القوية والموصلات المعدة مسبقًا تجعل التكامل بسيطًا وفعالًا.",
    }
};

const IntegrationsPage = () => {
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

export default IntegrationsPage;