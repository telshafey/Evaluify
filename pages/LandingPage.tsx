

import React from 'react';
import { SparklesIcon, DesktopIcon, MicIcon, LightbulbIcon, InboxIcon, EyeIcon, TagIcon, ShieldCheckIcon, Wand2Icon } from '../components/icons';
import { useLanguage, useTheme } from '../App';
import SitePageLayout from '../components/SitePageLayout';

const getTranslations = (platformName: string) => ({
    en: {
        heroTitle: "The Future of Online Assessment",
        heroSubtitle: `${platformName} provides a secure, intuitive, and powerful platform for creating, administering, and analyzing exams with advanced AI-powered integrity features.`,
        getStarted: "Get Started Now",
        featuresTitle: "An AI-Powered Toolkit for Absolute Integrity",
        featuresSubtitle: "Our multi-layered security system ensures every assessment is fair, secure, and authentic.",
        
        smartProctoring: "Smart AI Proctoring",
        smartProctoringDesc: "Our AI analyzes visual behavior, digital patterns, and audio to detect suspicious activities and generate a comprehensive integrity report.",
        dynamicQuestions: "Dynamic Questions",
        dynamicQuestionsDesc: "Combat group cheating with unique exams for each student, generated in real-time by Gemini models, making answer sharing futile.",
        secureBrowser: "Secure Exam Browser",
        secureBrowserDesc: "For high-stakes exams, our dedicated desktop and mobile apps lock down the testing environment, preventing access to other applications.",
        adaptiveTesting: "Adaptive Testing",
        adaptiveTestingDesc: "The AI selects the next question based on the student's previous answer, providing a more accurate assessment with fewer questions.",
        speechAnalysis: "Speech & Voice Analysis",
        speechAnalysisDesc: "Evaluate language proficiency and presentation skills with AI-powered analysis of spoken answers for fluency, pronunciation, and accuracy.",
        personalizedGuides: "Personalized Study Guides",
        personalizedGuidesDesc: "After an exam, the AI analyzes weak points and generates a custom study plan with targeted resources to help students improve.",

        roadmapTitle: "The Future of Learning",
        roadmapSubtitle: "We are constantly innovating to bring you the most advanced assessment tools.",
        roadmapIntegration: "LMS & ATS Integration",
        roadmapIntegrationDesc: "Seamlessly connect with systems like Moodle, Canvas, and Workday to streamline your assessment workflow.",
        roadmapLiveProctoring: "Live Proctoring Center",
        roadmapLiveProctoringDesc: "A command center for human proctors, assisted by AI that flags suspicious activities in real-time.",
        roadmapMarketplace: "Verified Question Marketplace",
        roadmapMarketplaceDesc: "A marketplace for educators and experts to buy and sell high-quality, verified question banks.",

        soon: "SOON",
    },
    ar: {
        heroTitle: "مستقبل التقييم عبر الإنترنت",
        heroSubtitle: `توفر ${platformName} منصة آمنة وسهلة الاستخدام وقوية لإنشاء الاختبارات وإدارتها وتحليلها، معززة بميزات نزاهة متقدمة مدعومة بالذكاء الاصطناعي.`,
        getStarted: "ابدأ الآن",
        featuresTitle: "مجموعة أدوات مدعومة بالذكاء الاصطناعي لنزاهة مطلقة",
        featuresSubtitle: "يضمن نظام الأمان متعدد الطبقات لدينا أن كل تقييم يتميز بالعدالة والأمان والموثوقية.",

        smartProctoring: "المراقبة الذكية بالذكاء الاصطناعي",
        smartProctoringDesc: "يقوم الذكاء الاصطناعي بتحليل السلوك البصري، الأنماط الرقمية، والصوت لكشف الأنشطة المشبوهة، ومن ثم إنشاء تقرير شامل حول نزاهة الاختبار.",
        dynamicQuestions: "الأسئلة الديناميكية",
        dynamicQuestionsDesc: "لمكافحة الغش الجماعي، يتم إنشاء اختبارات فريدة لكل طالب بشكل فوري باستخدام نماذج Gemini، مما يجعل مشاركة الإجابات غير مجدية.",
        secureBrowser: "متصفح الاختبار الآمن",
        secureBrowserDesc: "للاختبارات ذات الأهمية العالية، يقوم تطبيقنا المخصص لسطح المكتب والجوال بتأمين بيئة الاختبار بالكامل، مما يمنع الوصول إلى أي تطبيقات أخرى.",
        adaptiveTesting: "الاختبارات التكيفية",
        adaptiveTestingDesc: "يختار الذكاء الاصطناعي السؤال التالي بناءً على إجابة الطالب السابقة، مما يوفر تقييمًا أكثر دقة بأسئلة أقل.",
        speechAnalysis: "تحليل الصوت والكلام",
        speechAnalysisDesc: "قيّم إتقان اللغة ومهارات العرض مع تحليل الذكاء الاصطناعي للإجابات المنطوقة، مع التركيز على الطلاقة والنطق والدقة.",
        personalizedGuides: "خطط دراسية مخصصة",
        personalizedGuidesDesc: "بعد كل اختبار، يقوم الذكاء الاصطناعي بتحليل نقاط الضعف وإنشاء خطة دراسة مخصصة مع مصادر تعليمية موجهة لمساعدة الطلاب على التحسن.",
        
        roadmapTitle: "مستقبل التعلّم والتقييم",
        roadmapSubtitle: "نحن نبتكر باستمرار لنقدم لكم أدوات التقييم الأكثر تقدماً.",
        roadmapIntegration: "التكامل مع أنظمة LMS و ATS",
        roadmapIntegrationDesc: "تكامل سلس مع أنظمة إدارة التعلم (LMS) مثل Moodle و Canvas، وأنظمة تتبع المتقدمين (ATS) مثل Workday لتبسيط إجراءات التقييم.",
        roadmapLiveProctoring: "مركز المراقبة المباشرة",
        roadmapLiveProctoringDesc: "مركز قيادة للمراقبين البشريين، مدعوم بالذكاء الاصطناعي الذي ينبه للأنشطة المشبوهة في نفس اللحظة.",
        roadmapMarketplace: "سوق الأسئلة المعتمدة",
        roadmapMarketplaceDesc: "سوق مخصص للمعلمين والخبراء لبيع وشراء بنوك أسئلة عالية الجودة ومُعتمدة.",
        soon: "قريباً",
    }
});


const FeatureCard: React.FC<{ icon: React.ElementType, title: string, children: React.ReactNode }> = ({ icon: Icon, title, children }) => (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 dark:bg-primary-500/20 dark:text-primary-400 rounded-full mb-4">
            <Icon className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-slate-100">{title}</h3>
        <p className="text-slate-600 dark:text-slate-300">{children}</p>
    </div>
);

const RoadmapCard: React.FC<{ icon: React.ElementType, title: string, children: React.ReactNode }> = ({ icon: Icon, title, children }) => {
    const { lang } = useLanguage();
    const { theme } = useTheme();
    const t = getTranslations(theme.platformName)[lang];

    return (
        <div className="bg-slate-100 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700/50">
            <div className="flex items-center mb-3">
                 <div className="flex items-center justify-center w-8 h-8 bg-primary-100 text-primary-600 dark:bg-primary-500/20 dark:text-primary-400 rounded-full me-3">
                    <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{title}</h3>
                <span className="ms-auto text-xs font-semibold bg-primary-100 text-primary-800 dark:bg-primary-500/20 dark:text-primary-300 py-1 px-2 rounded-full">{t.soon}</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">{children}</p>
        </div>
    );
};

const LandingPage: React.FC = () => {
    const { lang } = useLanguage();
    const { theme } = useTheme();
    const t = getTranslations(theme.platformName)[lang];

    return (
        <SitePageLayout>
            {/* Hero Section */}
            <section className="relative py-24 md:py-40 bg-slate-50 dark:bg-slate-950 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400 leading-tight">
                        {t.heroTitle}
                    </h1>
                    <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                         {t.heroSubtitle}
                    </p>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 bg-white dark:bg-slate-900/70">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-50">{t.featuresTitle}</h2>
                        <p className="mt-2 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">{t.featuresSubtitle}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FeatureCard icon={ShieldCheckIcon} title={t.smartProctoring}>
                            {t.smartProctoringDesc}
                        </FeatureCard>
                        <FeatureCard icon={SparklesIcon} title={t.dynamicQuestions}>
                            {t.dynamicQuestionsDesc}
                        </FeatureCard>
                        <FeatureCard icon={DesktopIcon} title={t.secureBrowser}>
                            {t.secureBrowserDesc}
                        </FeatureCard>
                        <FeatureCard icon={Wand2Icon} title={t.adaptiveTesting}>
                            {t.adaptiveTestingDesc}
                        </FeatureCard>
                        <FeatureCard icon={MicIcon} title={t.speechAnalysis}>
                            {t.speechAnalysisDesc}
                        </FeatureCard>
                        <FeatureCard icon={LightbulbIcon} title={t.personalizedGuides}>
                            {t.personalizedGuidesDesc}
                        </FeatureCard>
                    </div>
                </div>
            </section>

             {/* Roadmap Section */}
            <section id="roadmap" className="py-20 bg-slate-50 dark:bg-slate-950">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-50">{t.roadmapTitle}</h2>
                        <p className="mt-2 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">{t.roadmapSubtitle}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        <RoadmapCard icon={InboxIcon} title={t.roadmapIntegration}>{t.roadmapIntegrationDesc}</RoadmapCard>
                        <RoadmapCard icon={EyeIcon} title={t.roadmapLiveProctoring}>{t.roadmapLiveProctoringDesc}</RoadmapCard>
                        <RoadmapCard icon={TagIcon} title={t.roadmapMarketplace}>{t.roadmapMarketplaceDesc}</RoadmapCard>
                    </div>
                </div>
            </section>
        </SitePageLayout>
    );
};

export default LandingPage;