

import React from 'react';
import SitePageLayout from '../components/SitePageLayout';
import { useLanguage } from '../App';

const translations = {
    en: {
        title: "Our Customers",
        description: "We are proud to partner with leading educational institutions and corporations around the world. Read our customer stories and case studies to see how evaluify is transforming online assessment for organizations like yours.",
    },
    ar: {
        title: "عملاؤنا",
        description: "نحن فخورون بشراكتنا مع المؤسسات التعليمية والشركات الرائدة في جميع أنحاء العالم. اقرأ قصص عملائنا ودراسات الحالة لترى كيف تعمل evaluify على تحويل التقييم عبر الإنترنت للمؤسسات مثل مؤسستك.",
    }
};

const CustomersPage = () => {
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

export default CustomersPage;