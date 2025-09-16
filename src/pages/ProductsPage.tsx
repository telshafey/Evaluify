import React from 'react';
import SitePageLayout from '../components/SitePageLayout';
import { useLanguage } from '../App';
import { ShieldCheckIcon, SparklesIcon, BookOpenIcon, ChartBarIcon } from '../components/icons';

const translations = {
    en: {
        title: "Our Product Suite",
        description: "Explore the innovative features and tools that make evaluify the leading platform for secure and effective online assessments. Our product suite is designed to ensure integrity, save time, and provide deep insights.",
        
        proctoringTitle: "Smart AI Proctoring",
        proctoringDesc: "Maintain the highest level of academic integrity with our multi-modal AI proctoring system. It intelligently monitors video, audio, and on-screen activity to flag any potential breaches, providing a comprehensive integrity report for each session.",
        proctoringFeatures: ["Gaze & Head Pose Tracking", "Audio Anomaly Detection", "Tab & Application Monitoring", "Detailed Incident Reports"],
        
        generationTitle: "Dynamic Question Generation",
        generationDesc: "Leverage the power of Gemini to combat cheating and create tailored assessments in seconds. Our AI can generate unique questions, full exams, or variations of existing questions, ensuring each candidate receives a different but equally challenging test.",
        generationFeatures: ["Full Exam Generation from a Topic", "Question Variation Creation", "Plagiarism-Resistant Essay Prompts", "Adaptive Question Sequencing"],

        qBankTitle: "Centralized Question Bank",
        qBankDesc: "Build, manage, and collaborate on a robust question bank. Categorize questions by topic, difficulty, and type. Share with your team or tap into our verified marketplace for high-quality, ready-to-use content.",
        qBankFeatures: ["Multiple Question Types Supported", "Rich Content & Media", "Collaborative Authoring", "Version History & Analytics"],

        analyticsTitle: "Actionable Analytics & Reporting",
        analyticsDesc: "Go beyond simple scores. Our analytics dashboard provides deep insights into candidate performance, question effectiveness, and overall trends. Identify knowledge gaps and make data-driven decisions to improve learning outcomes.",
        analyticsFeatures: ["Candidate Performance Breakdown", "Question Difficulty & Discrimination Analysis", "Cohort Comparison", "Custom Report Generation"],
    },
    ar: {
        title: "مجموعة منتجاتنا المتكاملة",
        description: "استكشف الميزات والأدوات المبتكرة التي تجعل evaluify المنصة الرائدة للتقييمات الآمنة والفعالة عبر الإنترنت. تم تصميم مجموعة منتجاتنا لضمان النزاهة، وتوفير الوقت، وتقديم رؤى عميقة.",
        
        proctoringTitle: "المراقبة الذكية بالذكاء الاصطناعي",
        proctoringDesc: "حافظ على أعلى مستوى من النزاهة الأكاديمية من خلال نظام المراقبة بالذكاء الاصطناعي متعدد الوسائط. يراقب بذكاء الفيديو والصوت والنشاط على الشاشة للإبلاغ عن أي انتهاكات محتملة، مما يوفر تقرير نزاهة شامل لكل جلسة.",
        proctoringFeatures: ["تتبع حركة العين ووضعية الرأس", "كشف الأصوات غير الاعتيادية", "مراقبة علامات التبويب والتطبيقات", "تقارير مفصلة عن الحوادث"],
        
        generationTitle: "توليد الأسئلة الديناميكي",
        generationDesc: "استفد من قوة Gemini لمكافحة الغش وإنشاء تقييمات مخصصة في ثوانٍ. يمكن للذكاء الاصطناعي لدينا إنشاء أسئلة فريدة، أو اختبارات كاملة، أو صيغ مختلفة من الأسئلة الحالية، مما يضمن حصول كل مرشح على اختبار مختلف ولكنه مكافئ في الصعوبة.",
        generationFeatures: ["توليد اختبار كامل من موضوع معين", "إنشاء صيغ متنوعة للأسئلة", "أسئلة مقالية مقاومة للسرقة الفكرية", "تسلسل أسئلة تكيفي"],

        qBankTitle: "بنك الأسئلة المركزي",
        qBankDesc: "أنشئ وأدر وتعاون في بنك أسئلة قوي. صنف الأسئلة حسب الموضوع والصعوبة والنوع. شارك مع فريقك أو استفد من سوقنا الموثوق للحصول على محتوى عالي الجودة وجاهز للاستخدام.",
        qBankFeatures: ["دعم أنواع متعددة من الأسئلة", "محتوى غني ووسائط متعددة", "تأليف تعاوني", "سجل الإصدارات والتحليلات"],

        analyticsTitle: "تحليلات وتقارير قابلة للتنفيذ",
        analyticsDesc: "تجاوز الدرجات البسيطة. توفر لوحة التحكم التحليلية لدينا رؤى عميقة حول أداء المرشحين وفعالية الأسئلة والاتجاهات العامة. حدد فجوات المعرفة واتخذ قرارات تعتمد على البيانات لتحسين مخرجات التعلم.",
        analyticsFeatures: ["تحليل تفصيلي لأداء المرشحين", "تحليل صعوبة وتمييز الأسئلة", "مقارنة بين الدفعات", "إنشاء تقارير مخصصة"],
    }
};

const FeatureSection = ({ title, description, features, icon: Icon, imageSide = 'right' }: { title: string, description: string, features: string[], icon: React.ElementType, imageSide?: 'left' | 'right' }) => (
    <div className={`container mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center`}>
        <div className={`md:order-${imageSide === 'left' ? 1 : 2}`}>
            <div className="p-8 bg-slate-100 dark:bg-slate-800/50 rounded-2xl flex items-center justify-center aspect-square">
                {/* Placeholder for an actual image or illustration */}
                <Icon className="w-32 h-32 text-primary-400" />
            </div>
        </div>
        <div className={`md:order-${imageSide === 'left' ? 2 : 1}`}>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{title}</h2>
            <p className="mt-4 text-slate-600 dark:text-slate-300">{description}</p>
            <ul className="mt-6 space-y-2">
                {features.map((feature, index) => (
                     <li key={index} className="flex items-center">
                        <svg className="w-5 h-5 text-green-500 mx-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>
        </div>
    </div>
);


const ProductsPage = () => {
    const { lang } = useLanguage();
    const t = translations[lang];

    return (
        <SitePageLayout>
             <header className="bg-white dark:bg-slate-900 py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100">{t.title}</h1>
                    <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                        {t.description}
                    </p>
                </div>
            </header>

            <main>
                <div className="bg-slate-50 dark:bg-slate-950">
                    <FeatureSection 
                        title={t.proctoringTitle} 
                        description={t.proctoringDesc} 
                        features={t.proctoringFeatures} 
                        icon={ShieldCheckIcon}
                        imageSide="right"
                    />
                </div>
                 <div className="bg-white dark:bg-slate-900">
                     <FeatureSection 
                        title={t.generationTitle} 
                        description={t.generationDesc} 
                        features={t.generationFeatures} 
                        icon={SparklesIcon}
                        imageSide="left"
                    />
                </div>
                <div className="bg-slate-50 dark:bg-slate-950">
                     <FeatureSection 
                        title={t.qBankTitle} 
                        description={t.qBankDesc} 
                        features={t.qBankFeatures} 
                        icon={BookOpenIcon}
                        imageSide="right"
                    />
                </div>
                <div className="bg-white dark:bg-slate-900">
                     <FeatureSection 
                        title={t.analyticsTitle} 
                        description={t.analyticsDesc} 
                        features={t.analyticsFeatures} 
                        icon={ChartBarIcon}
                        imageSide="left"
                    />
                </div>
            </main>
        </SitePageLayout>
    );
};

export default ProductsPage;