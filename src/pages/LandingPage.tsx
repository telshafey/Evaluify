import React from 'react';
import { SparklesIcon, DesktopIcon, MicIcon, LightbulbIcon, ShieldCheckIcon, Wand2Icon } from '../components/icons';
import { useLanguage, useTheme } from '../App';
import SitePageLayout from '../components/SitePageLayout';

const getTranslations = (platformName: string) => ({
    en: {
        heroTitle: "Redefining Assessment Integrity",
        heroSubtitle: `${platformName} combines cutting-edge AI with a user-centric design to deliver a secure, fair, and insightful online assessment experience.`,
        getStarted: "Get Started for Free",
        requestDemo: "Request a Demo",
        trustedBy: "TRUSTED BY LEADING INSTITUTIONS",

        featuresTitle: "A Suite of Tools for Modern Assessment",
        featuresSubtitle: "Our multi-layered approach ensures every assessment is fair, secure, and insightful.",
        
        smartProctoring: "Smart AI Proctoring",
        smartProctoringDesc: "Gemini-powered analysis of visual, audio, and digital behavior to ensure exam integrity.",
        dynamicQuestions: "Dynamic Question Generation",
        dynamicQuestionsDesc: "Create unique exams for each student in real-time to eliminate answer sharing.",
        secureBrowser: "Secure Exam Browser",
        secureBrowserDesc: "Lock down the testing environment on desktop and mobile for high-stakes exams.",
        adaptiveTesting: "Adaptive Testing",
        adaptiveTestingDesc: "AI tailors question difficulty to each student for a more precise, efficient assessment.",
        speechAnalysis: "Advanced Speech Analysis",
        speechAnalysisDesc: "Evaluate language proficiency and presentation skills with AI-driven voice analysis.",
        personalizedGuides: "Personalized Study Plans",
        personalizedGuidesDesc: "AI generates custom study guides based on performance to help learners improve.",

        howItWorksTitle: "Simple Steps to Secure Assessment",
        step1Title: "Create or Generate",
        step1Desc: "Build assessments manually, import from our bank, or let AI generate a full exam in minutes.",
        step2Title: "Invite & Proctor",
        step2Desc: "Securely invite candidates and monitor exams with our multi-layered AI proctoring.",
        step3Title: "Analyze & Act",
        step3Desc: "Get instant results, deep performance analytics, and actionable AI-powered insights.",

        testimonialsTitle: "What Our Users Say",
        testimonial1: `"${platformName} has transformed how we conduct final exams. The AI proctoring is incredibly reliable, and our academic integrity has never been stronger."`,
        testimonial1Name: "Dr. Anya Sharma",
        testimonial1Role: "Dean of Engineering, Tech University",
        testimonial2: `"The efficiency is unmatched. We reduced our assessment creation time by 70% using the AI generation tools. It's a game-changer for our corporate training programs."`,
        testimonial2Name: "David Chen",
        testimonial2Role: "Head of L&D, Innovate Corp",

        finalCtaTitle: "Ready to Elevate Your Assessments?",
        finalCtaDesc: "Join the growing number of institutions transforming their evaluation process.",
    },
    ar: {
        heroTitle: "نحو تعريف جديد لنزاهة التقييم",
        heroSubtitle: `تجمع منصة ${platformName} بين أحدث تقنيات الذكاء الاصطناعي والتصميم الذي يركز على المستخدم لتقديم تجربة تقييم آمنة وعادلة وتقدم رؤى قيّمة عبر الإنترنت.`,
        getStarted: "ابدأ مجانًا",
        requestDemo: "اطلب عرضًا توضيحيًا",
        trustedBy: "موثوق بها من قبل مؤسسات رائدة",

        featuresTitle: "مجموعة أدوات للتقييم الحديث",
        featuresSubtitle: "نهجنا متعدد المستويات يضمن أن كل تقييم يتميز بالعدالة، الأمان، ويقدم رؤى قيّمة.",
        
        smartProctoring: "المراقبة الذكية بالذكاء الاصطناعي",
        smartProctoringDesc: "تحليل مدعوم من Gemini للسلوك البصري والصوتي والرقمي لضمان نزاهة الاختبار.",
        dynamicQuestions: "توليد الأسئلة الديناميكي",
        dynamicQuestionsDesc: "أنشئ اختبارات فريدة لكل طالب في الوقت الفعلي للقضاء على مشاركة الإجابات.",
        secureBrowser: "متصفح الاختبار الآمن",
        secureBrowserDesc: "تأمين بيئة الاختبار على أجهزة الكمبيوتر المكتبية والمحمولة للاختبارات عالية الأهمية.",
        adaptiveTesting: "الاختبار التكيفي",
        adaptiveTestingDesc: "يقوم الذكاء الاصطناعي بتكييف صعوبة الأسئلة لكل طالب لتقييم أكثر دقة وكفاءة.",
        speechAnalysis: "تحليل متقدم للكلام",
        speechAnalysisDesc: "قم بتقييم الكفاءة اللغوية ومهارات العرض من خلال تحليل الصوت المعتمد على الذكاء الاصطناعي.",
        personalizedGuides: "خطط دراسية مخصصة",
        personalizedGuidesDesc: "يقوم الذكاء الاصطناعي بإنشاء أدلة دراسية مخصصة بناءً على الأداء لمساعدة المتعلمين على التحسن.",

        howItWorksTitle: "خطوات بسيطة لتقييم آمن",
        step1Title: "أنشئ أو ولّد",
        step1Desc: "أنشئ التقييمات يدويًا، أو استورد من بنك الأسئلة، أو دع الذكاء الاصطناعي يولد اختبارًا كاملاً في دقائق.",
        step2Title: "ادعُ وراقب",
        step2Desc: "ادعُ المرشحين بأمان وراقب الاختبارات من خلال المراقبة متعددة المستويات بالذكاء الاصطناعي.",
        step3Title: "حلّل واتخذ إجراءً",
        step3Desc: "احصل على نتائج فورية وتحليلات أداء عميقة ورؤى قابلة للتنفيذ مدعومة بالذكاء الاصطناعي.",

        testimonialsTitle: "ماذا يقول مستخدمونا",
        testimonial1: `"${platformName} غيرت طريقة إجرائنا للامتحانات النهائية. المراقبة بالذكاء الاصطناعي موثوقة بشكل لا يصدق، ونزاهتنا الأكاديمية لم تكن أقوى من أي وقت مضى."`,
        testimonial1Name: "د. علياء الشمري",
        testimonial1Role: "عميدة كلية الهندسة، جامعة التكنولوجيا",
        testimonial2: `"الكفاءة لا مثيل لها. لقد قللنا وقت إنشاء التقييم بنسبة 70٪ باستخدام أدوات التوليد بالذكاء الاصطناعي. إنها تغير قواعد اللعبة لبرامج التدريب في شركتنا."`,
        testimonial2Name: "خالد عبد الله",
        testimonial2Role: "رئيس قسم التدريب والتطوير، شركة إبداع",
        
        finalCtaTitle: "هل أنت مستعد للارتقاء بتقييماتك؟",
        finalCtaDesc: "انضم إلى العدد المتزايد من المؤسسات التي تُحدِث تحولاً في عملية التقييم لديها.",
    }
});

const FeatureCard: React.FC<{ icon: React.ElementType, title: string, children: React.ReactNode }> = ({ icon: Icon, title, children }) => (
    <div className="bg-white dark:bg-slate-900/50 p-6 rounded-xl shadow-lg hover:shadow-primary-500/10 transition-shadow duration-300 border border-slate-200 dark:border-slate-800 transform hover:-translate-y-1">
        <div className="flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 dark:bg-primary-500/20 dark:text-primary-400 rounded-xl mb-4">
            <Icon className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-slate-100">{title}</h3>
        <p className="text-slate-600 dark:text-slate-300">{children}</p>
    </div>
);


const LandingPage: React.FC = () => {
    const { lang } = useLanguage();
    const { theme } = useTheme();
    const t = getTranslations(theme.platformName)[lang];

    return (
        <SitePageLayout>
            {/* Hero Section */}
            <section className="relative py-28 md:py-40 bg-white dark:bg-slate-900 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100/50 via-transparent to-transparent dark:from-slate-950/50"></div>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-50 dark:to-slate-400 leading-tight tracking-tighter">
                        {t.heroTitle}
                    </h1>
                    <p className="mt-6 text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                         {t.heroSubtitle}
                    </p>
                    <div className="mt-8 flex justify-center gap-4">
                        <button className="bg-primary-500 text-white font-semibold px-8 py-3 rounded-lg hover:bg-primary-600 transition-transform transform hover:scale-105 shadow-lg">
                            {t.getStarted}
                        </button>
                         <button className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold px-8 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700">
                            {t.requestDemo}
                        </button>
                    </div>
                </div>
            </section>
            
            {/* Trusted By Section */}
            <div className="py-8 bg-slate-50 dark:bg-slate-950/50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-sm font-semibold text-slate-500 dark:text-slate-400 tracking-widest">{t.trustedBy}</p>
                    <div className="mt-4 flex justify-center items-center gap-x-8 md:gap-x-12 opacity-60 grayscale">
                        {/* Placeholder logos */}
                        <span>Tech University</span>
                        <span>Innovate Corp</span>
                        <span>Global Certs</span>
                        <span>Edu Alliance</span>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <section id="features" className="py-20 bg-white dark:bg-slate-900">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-50">{t.featuresTitle}</h2>
                        <p className="mt-2 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">{t.featuresSubtitle}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FeatureCard icon={ShieldCheckIcon} title={t.smartProctoring}>{t.smartProctoringDesc}</FeatureCard>
                        <FeatureCard icon={SparklesIcon} title={t.dynamicQuestions}>{t.dynamicQuestionsDesc}</FeatureCard>
                        <FeatureCard icon={DesktopIcon} title={t.secureBrowser}>{t.secureBrowserDesc}</FeatureCard>
                        <FeatureCard icon={Wand2Icon} title={t.adaptiveTesting}>{t.adaptiveTestingDesc}</FeatureCard>
                        <FeatureCard icon={MicIcon} title={t.speechAnalysis}>{t.speechAnalysisDesc}</FeatureCard>
                        <FeatureCard icon={LightbulbIcon} title={t.personalizedGuides}>{t.personalizedGuidesDesc}</FeatureCard>
                    </div>
                </div>
            </section>

             {/* How It Works Section */}
            <section id="how-it-works" className="py-20 bg-slate-50 dark:bg-slate-950">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-50">{t.howItWorksTitle}</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div className="p-6">
                            <div className="text-4xl font-bold text-primary-400 mb-2">1</div>
                            <h3 className="text-xl font-bold mb-2">{t.step1Title}</h3>
                            <p className="text-slate-600 dark:text-slate-400">{t.step1Desc}</p>
                        </div>
                        <div className="p-6">
                            <div className="text-4xl font-bold text-primary-400 mb-2">2</div>
                            <h3 className="text-xl font-bold mb-2">{t.step2Title}</h3>
                            <p className="text-slate-600 dark:text-slate-400">{t.step2Desc}</p>
                        </div>
                        <div className="p-6">
                            <div className="text-4xl font-bold text-primary-400 mb-2">3</div>
                            <h3 className="text-xl font-bold mb-2">{t.step3Title}</h3>
                            <p className="text-slate-600 dark:text-slate-400">{t.step3Desc}</p>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Testimonials Section */}
            <section className="py-20 bg-white dark:bg-slate-900">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                     <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-50">{t.testimonialsTitle}</h2>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <div className="bg-slate-50 dark:bg-slate-950/50 p-8 rounded-xl">
                            <p className="text-slate-700 dark:text-slate-300 italic">{t.testimonial1}</p>
                            <div className="mt-4 font-semibold">{t.testimonial1Name}</div>
                            <div className="text-sm text-slate-500">{t.testimonial1Role}</div>
                        </div>
                         <div className="bg-slate-50 dark:bg-slate-950/50 p-8 rounded-xl">
                            <p className="text-slate-700 dark:text-slate-300 italic">{t.testimonial2}</p>
                            <div className="mt-4 font-semibold">{t.testimonial2Name}</div>
                            <div className="text-sm text-slate-500">{t.testimonial2Role}</div>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Final CTA */}
             <section className="py-20 bg-primary-500/10 dark:bg-primary-500/5">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50">{t.finalCtaTitle}</h2>
                    <p className="mt-2 text-slate-600 dark:text-slate-400">{t.finalCtaDesc}</p>
                     <div className="mt-6">
                        <button className="bg-primary-500 text-white font-semibold px-8 py-3 rounded-lg hover:bg-primary-600 transition-transform transform hover:scale-105 shadow-lg">
                            {t.getStarted}
                        </button>
                    </div>
                </div>
            </section>

        </SitePageLayout>
    );
};

export default LandingPage;