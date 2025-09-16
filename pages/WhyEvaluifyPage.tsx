

import React from 'react';
import SitePageLayout from '../components/SitePageLayout';
import { useLanguage, useTheme } from '../App';

const getTranslations = (platformName: string) => ({
    en: {
        title: `Why Choose ${platformName}?`,
        description: `Learn what sets ${platformName} apart. Our commitment to academic integrity, user-centric design, and powerful AI integration makes us the ideal partner for institutions that value fair, reliable, and insightful assessments.`,
    },
    ar: {
        title: `لماذا تختار ${platformName}؟`,
        description: `تعرف على ما يميز ${platformName}. إن التزامنا بالنزاهة الأكاديمية، والتصميم الذي يركز على المستخدم، والتكامل القوي للذكاء الاصطناعي يجعلنا الشريك المثالي للمؤسسات التي تقدر التقييمات العادلة والموثوقة وذات الرؤى العميقة.`,
    }
});

const WhyEvaluifyPage = () => {
    const { lang } = useLanguage();
    const { theme } = useTheme();
    const t = getTranslations(theme.platformName)[lang];

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

export default WhyEvaluifyPage;