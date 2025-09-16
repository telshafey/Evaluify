

import React from 'react';
import SitePageLayout from '../components/SitePageLayout';
import { useLanguage } from '../App';

const translations = {
    en: {
        title: "Our Products",
        description: "Explore the innovative features and tools that make evaluify the leading platform for secure and effective online assessments. From AI-powered proctoring to dynamic question generation, our product suite is designed to meet the needs of modern education and professional development.",
    },
    ar: {
        title: "منتجاتنا",
        description: "استكشف الميزات والأدوات المبتكرة التي تجعل evaluify المنصة الرائدة للتقييمات الآمنة والفعالة عبر الإنترنت. من المراقبة المدعومة بالذكاء الاصطناعي إلى إنشاء الأسئلة الديناميكية ، تم تصميم مجموعة منتجاتنا لتلبية احتياجات التعليم الحديث والتطوير المهني.",
    }
};

const ProductsPage = () => {
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

export default ProductsPage;