


import React from 'react';
import SitePageLayout from '../components/SitePageLayout';
import { useLanguage } from '../App';

const translations = {
    en: {
        title: "About Us",
        description: "We are a team of educators, technologists, and AI experts passionate about revolutionizing the world of assessment.",
        missionTitle: "Our Mission",
        missionText: "To provide tools that are not only technologically advanced but also pedagogically sound, fostering an environment of fairness, academic integrity, and lifelong learning.",
        teamTitle: "Meet the Team",
        team: [
            { name: "Dr. Evelyn Reed", role: "Co-Founder & CEO" },
            { name: "Kenji Tanaka", role: "Co-Founder & CTO" },
            { name: "Maria Garcia", role: "Head of Pedagogy" },
            { name: "Sam Jones", role: "Lead AI Engineer" },
        ]
    },
    ar: {
        title: "عن المنصة",
        description: "نحن فريق من التربويين والتقنيين وخبراء الذكاء الاصطناعي، شغوفون بإحداث ثورة في عالم التقييم.",
        missionTitle: "مهمتنا",
        missionText: "توفير أدوات ليست متقدمة تقنيًا فحسب، بل سليمة من الناحية التربوية أيضًا، مما يعزز بيئة من العدالة والنزاهة الأكاديمية والتعلم مدى الحياة.",
        teamTitle: "تعرف على الفريق",
        team: [
            { name: "د. إيمان رضا", role: "المؤسس المشارك والرئيس التنفيذي" },
            { name: "يوسف منصور", role: "المؤسس المشارك ورئيس قسم التكنولوجيا" },
            { name: "فاطمة علي", role: "رئيسة قسم التربية" },
            { name: "علي حسن", role: "مهندس الذكاء الاصطناعي الرئيسي" },
        ]
    }
};

const TeamMemberCard = ({ name, role }: { name: string, role: string }) => (
    <div className="text-center">
        <div className="w-32 h-32 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-4">
            {/* Placeholder for photo */}
        </div>
        <h4 className="font-bold text-lg">{name}</h4>
        <p className="text-primary-500">{role}</p>
    </div>
);

const AboutUsPage = () => {
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

                <section className="py-20 bg-slate-50 dark:bg-slate-950">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center">
                        <h2 className="text-3xl font-bold mb-4">{t.missionTitle}</h2>
                        <p className="text-xl text-slate-700 dark:text-slate-300 leading-relaxed">
                            {t.missionText}
                        </p>
                    </div>
                </section>
                
                <section className="py-20 bg-white dark:bg-slate-900">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-50">{t.teamTitle}</h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
                            {t.team.map(member => (
                                <TeamMemberCard key={member.name} {...member} />
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </SitePageLayout>
    );
};

export default AboutUsPage;