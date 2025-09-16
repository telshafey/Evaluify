


import React, { useState } from 'react';
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
            price: { monthly: 29, annually: 23 },
            per: "/ month",
            desc: "For individual teachers and trainers.",
            features: ["Up to 50 assessments/month", "Up to 30 examinees per assessment", "Standard Question Bank", "Basic AI Proctoring", "Email Support"],
            button: "Get Started"
        },
        businessPlan: {
            title: "Business",
            price: { monthly: 99, annually: 79 },
            per: "/ month",
            desc: "For small to medium-sized businesses and training centers.",
            features: ["Up to 200 assessments/month", "Up to 100 examinees per assessment", "Access to Marketplace", "Advanced AI Proctoring", "Priority Support"],
            button: "Choose Business",
            popular: "Most Popular"
        },
        enterprisePlan: {
            title: "Enterprise",
            price: "Custom",
            desc: "For large organizations and educational institutions.",
            features: ["Unlimited assessments & examinees", "Custom Branding", "LMS/ATS Integration", "Dedicated Account Manager", "API Access"],
            button: "Contact Sales"
        },
        faqTitle: "Frequently Asked Questions",
        faqs: [
            { q: "Can I change my plan later?", a: "Yes, you can upgrade, downgrade, or cancel your plan at any time from your account settings." },
            { q: "Is there a free trial available?", a: "We offer a 14-day free trial on our Instructor and Business plans. No credit card is required to get started." },
            { q: "What happens if I exceed my plan's limits?", a: "We'll notify you when you're approaching your limits. You can choose to upgrade your plan or purchase add-ons for the current month." }
        ]
    },
    ar: {
        title: "خطط مرنة لكل فريق",
        subtitle: `اختر الخطة الأنسب لاحتياجاتك. سواء كنت مدربًا فرديًا أو مؤسسة كبيرة، لدى ${platformName} الحل الأمثل لك.`,
        monthly: "شهرياً",
        annually: "سنوياً",
        save20: "وفر 20%",

        instructorPlan: {
            title: "مدرب",
            price: { monthly: 29, annually: 23 },
            per: "/ شهر",
            desc: "مثالية للمعلمين والمدربين الأفراد.",
            features: ["حتى 50 تقييمًا شهريًا", "حتى 30 ممتحنًا لكل تقييم", "بنك الأسئلة القياسي", "مراقبة أساسية بالذكاء الاصطناعي", "دعم عبر البريد الإلكتروني"],
            button: "ابدأ الآن"
        },
        businessPlan: {
            title: "أعمال",
            price: { monthly: 99, annually: 79 },
            per: "/ شهر",
            desc: "مصممة للشركات الصغيرة والمتوسطة ومراكز التدريب.",
            features: ["حتى 200 تقييم شهريًا", "حتى 100 ممتحن لكل تقييم", "الوصول إلى المتجر", "مراقبة متقدمة بالذكاء الاصطناعي", "دعم ذو أولوية"],
            button: "اختر خطة الأعمال",
            popular: "الأكثر شيوعًا"
        },
        enterprisePlan: {
            title: "مؤسسة",
            price: "مخصص",
            desc: "حلول مخصصة للمؤسسات الكبيرة والمؤسسات التعليمية.",
            features: ["تقييمات وممتحنين غير محدودين", "علامة تجارية مخصصة", "تكامل مع أنظمة LMS/ATS", "مدير حساب مخصص", "الوصول إلى API"],
            button: "اتصل بالمبيعات"
        },
        faqTitle: "أسئلة شائعة",
        faqs: [
            { q: "هل يمكنني تغيير خطتي لاحقًا؟", a: "نعم، يمكنك الترقية أو التخفيض أو إلغاء خطتك في أي وقت من إعدادات حسابك." },
            { q: "هل هناك نسخة تجريبية مجانية متاحة؟", a: "نحن نقدم نسخة تجريبية مجانية لمدة 14 يومًا على خطط المدرب والأعمال. لا يلزم وجود بطاقة ائتمان للبدء." },
            { q: "ماذا يحدث إذا تجاوزت حدود خطتي؟", a: "سنقوم بإعلامك عندما تقترب من حدودك. يمكنك اختيار ترقية خطتك أو شراء إضافات للشهر الحالي." }
        ]
    }
});

const PricingCard = ({ plan, popular, billing, lang }: { plan: any, popular?: boolean, billing: 'monthly' | 'annually', lang: 'en' | 'ar' }) => {
    const price = typeof plan.price === 'object' ? plan.price[billing] : plan.price;
    return (
        <div className={`relative border rounded-2xl p-8 flex flex-col bg-white dark:bg-slate-800 ${popular ? 'border-primary-500 border-2' : 'border-slate-200 dark:border-slate-700'}`}>
            {popular && (
                <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-primary-500 text-white text-xs font-semibold px-3 py-1 rounded-full">{plan.popular}</div>
            )}
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{plan.title}</h3>
            <p className="mt-2 text-slate-500 dark:text-slate-400 min-h-[40px]">{plan.desc}</p>
            <div className="mt-4">
                <span className="text-5xl font-extrabold text-slate-900 dark:text-slate-100">${price}</span>
                {plan.per && <span className="text-slate-500 dark:text-slate-400">{plan.per}</span>}
            </div>
            <ul className="mt-6 space-y-3 text-slate-600 dark:text-slate-300">
                {plan.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start">
                        <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
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
}

const FAQItem = ({ q, a }: { q: string, a: string }) => (
    <details className="border-b border-slate-200 dark:border-slate-700 py-4">
        <summary className="font-semibold cursor-pointer">{q}</summary>
        <p className="mt-2 text-slate-600 dark:text-slate-300">{a}</p>
    </details>
);


const PricingPage = () => {
    const { lang } = useLanguage();
    const { theme } = useTheme();
    const [billing, setBilling] = useState<'monthly' | 'annually'>('monthly');
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

                <div className="mt-8 flex justify-center items-center gap-4">
                    <span className={`font-semibold ${billing === 'monthly' ? 'text-primary-500' : ''}`}>{t.monthly}</span>
                    <button onClick={() => setBilling(b => b === 'monthly' ? 'annually' : 'monthly')} className="relative w-14 h-8 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center px-1">
                        <div className="pricing-toggle-bg w-6 h-6 bg-white dark:bg-slate-900 rounded-full shadow-md transform" style={{ transform: billing === 'annually' ? 'translateX(24px)' : 'translateX(0)' }}></div>
                    </button>
                    <span className={`font-semibold ${billing === 'annually' ? 'text-primary-500' : ''}`}>{t.annually} <span className="text-xs bg-primary-100 dark:bg-primary-500/20 text-primary-700 dark:text-primary-300 rounded-full px-2 py-0.5">{t.save20}</span></span>
                </div>

                <div className="mt-12 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                    <PricingCard plan={t.instructorPlan} billing={billing} lang={lang} />
                    <PricingCard plan={t.businessPlan} popular billing={billing} lang={lang} />
                    <PricingCard plan={t.enterprisePlan} billing={billing} lang={lang} />
                </div>
                
                <div className="mt-20 max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-8">{t.faqTitle}</h2>
                    <div>
                        {t.faqs.map(faq => <FAQItem key={faq.q} {...faq} />)}
                    </div>
                </div>

            </main>
        </SitePageLayout>
    );
};

export default PricingPage;