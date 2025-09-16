import React from 'react';
import SitePageLayout from '../components/SitePageLayout';
import { useLanguage, useTheme } from '../App';
import { ShieldCheckIcon, SparklesIcon, ChartBarIcon, CheckCircleIcon, XCircleIcon } from '../components/icons';

const getTranslations = (platformName: string) => ({
    en: {
        title: `The ${platformName} Advantage`,
        description: `Learn what sets ${platformName} apart. Our commitment to integrity, user-centric design, and powerful AI integration makes us the ideal partner for institutions that value fair, reliable, and insightful assessments.`,
        
        integrityTitle: "Uncompromising Integrity",
        integrityDesc: `We believe that trust is the foundation of any valid assessment. Our platform is built from the ground up to protect the integrity of your exams with a multi-layered security approach that is both robust and user-friendly.`,
        
        aiTitle: "Powered by Gemini",
        aiDesc: `We leverage Google's state-of-the-art Gemini models to provide intelligent features that go beyond simple proctoring. From generating cheat-proof questions to providing deep performance insights, AI is at the core of what makes ${platformName} smart.`,
        
        insightsTitle: "Data-Driven Insights",
        insightsDesc: `Move beyond scores and percentages. We provide you with actionable analytics that help you understand learner performance, identify knowledge gaps, and improve your curriculum. Make informed decisions backed by data.`,
        
        comparisonTitle: "The Modern Approach to Assessment",
        feature: "Feature",
        evaluify: platformName,
        traditional: "Traditional Methods",
        integrity: "Integrity",
        integrityEval: "AI-monitored, multi-layered security",
        integrityTrad: "Manual proctoring, honor codes",
        efficiency: "Efficiency",
        efficiencyEval: "Automated grading & AI generation",
        efficiencyTrad: "Time-consuming manual creation",
        insights: "Insights",
        insightsEval: "Deep analytics, performance tracking",
        insightsTrad: "Basic scores, limited data",
        accessibility: "Accessibility",
        accessibilityEval: "Secure online access anywhere",
        accessibilityTrad: "Physical location required",
    },
    ar: {
        title: `مزايا ${platformName}`,
        description: `تعرف على ما يميز ${platformName}. إن التزامنا بالنزاهة، والتصميم الذي يركز على المستخدم، والتكامل القوي للذكاء الاصطناعي يجعلنا الشريك المثالي للمؤسسات التي تقدر التقييمات العادلة والموثوقة وذات الرؤى العميقة.`,
        
        integrityTitle: "نزاهة لا تقبل المساومة",
        integrityDesc: `نؤمن بأن الثقة هي أساس أي تقييم صحيح. تم بناء منصتنا من الألف إلى الياء لحماية نزاهة اختباراتك من خلال نهج أمني متعدد المستويات، يجمع بين القوة وسهولة الاستخدام.`,
        
        aiTitle: "مدعوم من Gemini",
        aiDesc: `نستفيد من نماذج Gemini الحديثة من Google لتقديم ميزات ذكية تتجاوز المراقبة البسيطة. من إنشاء أسئلة مقاومة للغش إلى تقديم رؤى أداء عميقة، الذكاء الاصطناعي هو جوهر ما يجعل منصة ${platformName} ذكية.`,
        
        insightsTitle: "رؤى قائمة على البيانات",
        insightsDesc: `تجاوز الدرجات والنسب المئوية. نوفر لك تحليلات قابلة للتنفيذ تساعدك على فهم أداء المتعلم، وتحديد فجوات المعرفة، وتحسين مناهجك. اتخذ قرارات مستنيرة مدعومة بالبيانات.`,
        
        comparisonTitle: "النهج الحديث للتقييم",
        feature: "الميزة",
        evaluify: platformName,
        traditional: "الطرق التقليدية",
        integrity: "النزاهة",
        integrityEval: "مراقبة بالذكاء الاصطناعي وأمان متعدد المستويات",
        integrityTrad: "مراقبة يدوية وقوانين شرف",
        efficiency: "الكفاءة",
        efficiencyEval: "تصحيح آلي وتوليد بالذكاء الاصطناعي",
        efficiencyTrad: "إنشاء يدوي يستغرق وقتًا طويلاً",
        insights: "الرؤى والتحليلات",
        insightsEval: "تحليلات عميقة وتتبع للأداء",
        insightsTrad: "درجات أساسية وبيانات محدودة",
        accessibility: "إمكانية الوصول",
        accessibilityEval: "وصول آمن عبر الإنترنت من أي مكان",
        accessibilityTrad: "يتطلب التواجد في مكان محدد",
    }
});

const AdvantageCard = ({ title, description, icon: Icon }: { title: string, description: string, icon: React.ElementType }) => (
    <div className="text-center p-6">
        <div className="w-16 h-16 bg-primary-100 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold">{title}</h3>
        <p className="mt-2 text-slate-600 dark:text-slate-300">{description}</p>
    </div>
);

const WhyEvaluifyPage = () => {
    const { lang } = useLanguage();
    const { theme } = useTheme();
    const t = getTranslations(theme.platformName)[lang];

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
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <AdvantageCard title={t.integrityTitle} description={t.integrityDesc} icon={ShieldCheckIcon} />
                        <AdvantageCard title={t.aiTitle} description={t.aiDesc} icon={SparklesIcon} />
                        <AdvantageCard title={t.insightsTitle} description={t.insightsDesc} icon={ChartBarIcon} />
                    </div>
                </section>
                
                <section className="py-20 bg-white dark:bg-slate-900">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-50">{t.comparisonTitle}</h2>
                        </div>
                        <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                            <div className="grid grid-cols-3 text-center font-bold">
                                <div className="p-4 text-left">{t.feature}</div>
                                <div className={`p-4 bg-primary-500/10 dark:bg-primary-500/20 text-primary-700 dark:text-primary-300`}>{t.evaluify}</div>
                                <div className="p-4">{t.traditional}</div>
                            </div>
                            {[
                                { feature: t.integrity, evaluify: t.integrityEval, traditional: t.integrityTrad },
                                { feature: t.efficiency, evaluify: t.efficiencyEval, traditional: t.efficiencyTrad },
                                { feature: t.insights, evaluify: t.insightsEval, traditional: t.insightsTrad },
                                { feature: t.accessibility, evaluify: t.accessibilityEval, traditional: t.accessibilityTrad },
                            ].map((item, index) => (
                                <div key={item.feature} className={`grid grid-cols-3 text-center items-center border-t border-slate-200 dark:border-slate-700`}>
                                    <div className="p-4 text-left font-semibold">{item.feature}</div>
                                    <div className="p-4 bg-primary-500/5 dark:bg-primary-500/10">
                                        <CheckCircleIcon className="w-6 h-6 text-green-500 mx-auto"/>
                                        <p className="text-sm mt-1 text-slate-600 dark:text-slate-300 sr-only">{item.evaluify}</p>
                                    </div>
                                    <div className="p-4">
                                        <XCircleIcon className="w-6 h-6 text-red-400 mx-auto"/>
                                        <p className="text-sm mt-1 text-slate-500 sr-only">{item.traditional}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </SitePageLayout>
    );
};

export default WhyEvaluifyPage;