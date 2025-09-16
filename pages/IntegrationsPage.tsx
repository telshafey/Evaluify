


import React from 'react';
import SitePageLayout from '../components/SitePageLayout';
import { useLanguage } from '../App';

const translations = {
    en: {
        title: "Seamless Integrations",
        description: "Connect evaluify with your existing Learning Management System (LMS), Student Information System (SIS), or Applicant Tracking System (ATS). Our robust API and pre-built connectors make integration simple and efficient.",
        apiTitle: "Powerful API for Custom Solutions",
        apiDescription: "Build custom workflows and integrate assessment data directly into your applications with our comprehensive, easy-to-use REST API.",
        viewDocs: "View API Docs"
    },
    ar: {
        title: "تكاملات سلسة",
        description: "قم بتوصيل evaluify بسلاسة مع نظام إدارة التعلم (LMS) الحالي أو نظام معلومات الطالب (SIS) أو نظام تتبع المتقدمين (ATS). واجهة برمجة التطبيقات القوية والموصلات المعدة مسبقًا تجعل التكامل بسيطًا وفعالًا.",
        apiTitle: "API قوي للحلول المخصصة",
        apiDescription: "أنشئ تدفقات عمل مخصصة وادمج بيانات التقييم مباشرة في تطبيقاتك باستخدام واجهة برمجة تطبيقات REST الشاملة وسهلة الاستخدام.",
        viewDocs: "عرض وثائق API"
    }
};

const integrations = ['Moodle', 'Canvas', 'Blackboard', 'Workday', 'Greenhouse', 'Slack', 'Microsoft Teams', 'Zapier'];

const IntegrationsPage = () => {
    const { lang } = useLanguage();
    const t = translations[lang];

    return (
        <SitePageLayout>
            <main>
                 <header className="bg-white dark:bg-slate-900 py-16">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100">{t.title}</h1>
                        <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                            {t.description}
                        </p>
                    </div>
                </header>

                <section className="py-16 bg-slate-50 dark:bg-slate-950">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {integrations.map(name => (
                                <div key={name} className="flex items-center justify-center p-6 bg-white dark:bg-slate-800/50 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
                                    <span className="text-lg font-semibold text-slate-700 dark:text-slate-300">{name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
                
                <section className="py-20 bg-white dark:bg-slate-900">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold">{t.apiTitle}</h2>
                            <p className="mt-4 text-slate-600 dark:text-slate-300">{t.apiDescription}</p>
                            <button className="mt-6 bg-primary-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors">
                                {t.viewDocs}
                            </button>
                        </div>
                        <div className="bg-slate-900 rounded-xl p-4 font-mono text-sm text-sky-300 overflow-x-auto">
                            <pre>
                                <code>
{`
// POST /v1/assessments
{
  "name": "Senior React Developer Test",
  "duration": 60,
  "proctoringLevel": "high",
  "questions": [
    {
      "type": "coding",
      "prompt": "Build a custom hook for..."
    }
  ]
}
`}
                                </code>
                            </pre>
                        </div>
                    </div>
                </section>
            </main>
        </SitePageLayout>
    );
};

export default IntegrationsPage;