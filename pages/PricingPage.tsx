

import React from 'react';
import SitePageLayout from '../components/SitePageLayout';
import { useLanguage, useTheme } from '../App';
import { CheckCircleIcon } from '../components/icons';

const getTranslations = (platformName: string) => ({
    en: {
        title: "Flexible Plans for Every Team",
        subtitle: `Choose the plan that's right for you. Whether you're an individual instructor or a large enterprise, ${platformName} has a solution.`,
        monthly: "Monthly",
        annually: "Annually",
        save20: "Save 20%",
        
        instructorPlan: {
            title: "Instructor",
            price: "$29",
            per: "/ month",
            desc: "For individual teachers and trainers.",
            features: [
                "Up to 50 assessments / month",
                "Up to 30 examinees per assessment",
                "Standard Question Bank",
                "Basic AI Proctoring",
                "Email Support"
            ],
            button: "Get Started"
        },
        businessPlan: {
            title: "Business",
            price: "$99",
            per: "/ month",
            desc: "For small to medium-sized businesses and training centers.",
            features: [
                "Up to 200 assessments / month",
                "Up to 100 examinees per assessment",
                "Access to Marketplace Question Packs",
                "Advanced AI Proctoring & Analysis",
                "Sub-accounts for managers",
                "Priority Support"
            ],
            button: "Choose Business",
            popular: "Most Popular"
        },
        enterprisePlan: {
            title: "Enterprise",
            price: "Custom",
            per: "",
            desc: "For large organizations and educational institutions.",
            features: [
                "Unlimited assessments",
                "Unlimited examinees",
                "Custom Branding",
                "LMS/ATS Integration",
                "Dedicated Account Manager",
                "API Access"
            ],
            button: "Contact Sales"
        }
    },
    ar: {
        title: "خطط مرنة لكل فريق",
        subtitle: `اختر الخطة الأنسب لاحتياجاتك. سواء كنت مدربًا فرديًا أو مؤسسة كبيرة، لدى ${platformName} الحل الأمثل لك.`,
        monthly: "شهرياً",
        annually: "سنوياً",
        save20: "وفر 20%",

        instructorPlan: {
            title: "مدرب",
            price: "29$",
            per: "/ شهر",
            desc: "مثالية للمعلمين والمدربين الأفراد.",
            features: [
                "حتى 50 تقييمًا شهريًا",
                "حتى 30 ممتحنًا لكل تقييم",
                "بنك الأسئلة القياسي",
                "مراقبة أساسية بالذكاء الاصطناعي",
                "دعم عبر البريد الإلكتروني"
            ],
            button: "ابدأ الآن"
        },
        businessPlan: {
            title: "أعمال",
            price: "99$",
            per: "/ شهر",
            desc: "مصممة للشركات الصغيرة والمتوسطة ومراكز التدريب.",
            features: [
                "حتى 200 تقييم شهريًا",
                "حتى 100 ممتحن لكل تقييم",
                "الوصول إلى حزم أسئلة المتجر",
                "مراقبة وتحليل متقدم بالذكاء الاصطناعي",
                "حسابات فرعية للمدراء",
                "دعم ذو أولوية"
            ],
            button: "اختر خطة الأعمال",
            popular: "الأكثر شيوعًا"
        },
        enterprisePlan: {
            title: "مؤسسة",
            price: "مخصص",
            per: "",
            desc: "حلول مخصصة للمؤسسات الكبيرة والمؤسسات التعليمية.",
            features: [
                "تقييمات غير محدودة",
                "عدد غير محدود من الممتحنين",
                "علامة تجارية مخصصة",
                "تكامل مع أنظمة LMS/ATS",
                "مدير حساب مخصص",
                "الوصول إلى API"
            ],
            button: "اتصل بالمبيعات"
        }
    }
});

const PricingCard = ({ plan, popular, lang }: { plan: any, popular?: boolean, lang: 'en' | 'ar' }) => (
    <div className={`relative border rounded-2xl p-8 flex flex-col ${popular ? 'border-primary-500 border-2' : 'border-slate-200 dark:border-slate-700'}`}>
        {popular && (
            <div className="absolute top-0 -translate-y-1/2 bg-primary-500 text-white text-xs font-semibold px-3 py-1 rounded-full">{plan.popular}</div>
        )}
        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{plan.title}</h3>
        <p className="mt-2 text-slate-500 dark:text-slate-400 min-h-[40px]">{plan.desc}</p>
        <div className="mt-4">
            <span className="text-5xl font-extrabold text-slate-900 dark:text-slate-100">{plan.price}</span>
            <span className="text-slate-500 dark:text-slate-400">{plan.per}</span>
        </div>
        <ul className="mt-6 space-y-3 text-slate-600 dark:text-slate-300">
            {plan.features.map((feature: string, index: number) => (
                <li key={index} className="flex items-center">
                    <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className={lang === 'ar' ? 'mr-3' : 'ml-3'}>{feature}</span>
                </li>
            ))}
        </ul>
        <div className="mt-auto pt-8">
            <button className={`w-full py-3 rounded-lg font-semibold text-lg transition-colors ${popular ? 'bg-primary-500 text-white hover:bg-primary-600' : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200'}`}>
                {plan.button}
            </button>
        </div>
    </div>
);

const PricingPage = () => {
    const { lang } = useLanguage();
    const { theme } = useTheme();
    const t = getTranslations(theme.platformName)[lang];

    return (
        <SitePageLayout>
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100">{t.title}</h1>
                    <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                        {t.subtitle}
                    </p>
                </div>

                <div className="mt-12 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    <PricingCard plan={t.instructorPlan} lang={lang} />
                    <PricingCard plan={t.businessPlan} popular lang={lang} />
                    <PricingCard plan={t.enterprisePlan} lang={lang} />
                </div>
            </main>
        </SitePageLayout>
    );
};

export default PricingPage;