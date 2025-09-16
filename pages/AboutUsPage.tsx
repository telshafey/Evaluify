

import React from 'react';
import SitePageLayout from '../components/SitePageLayout';
import { useLanguage } from '../App';

const translations = {
    en: {
        title: "About Us",
        description: "We are a team of educators, technologists, and AI experts passionate about revolutionizing the world of assessment. Our mission is to provide tools that are not only technologically advanced but also pedagogically sound, fostering an environment of fairness and academic integrity.",
    },
    ar: {
        title: "عن المنصة",
        description: "نحن فريق من التربويين والتقنيين وخبراء الذكاء الاصطناعي، شغوفون بإحداث ثورة في عالم التقييم. تتمثل مهمتنا في توفير أدوات ليست متقدمة تقنيًا فحسب، بل سليمة من الناحية التربوية أيضًا، مما يعزز بيئة من العدالة والنزاهة الأكاديمية.",
    }
};

const AboutUsPage = () => {
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

export default AboutUsPage;