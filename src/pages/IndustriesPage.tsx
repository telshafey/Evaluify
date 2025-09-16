import React from 'react';
import SitePageLayout from '../components/SitePageLayout';
import { useLanguage } from '../App';
import { BookOpenIcon, BriefcaseIcon, CheckCircleIcon } from '../components/icons';

const translations = {
    en: {
        title: "Solutions for Every Sector",
        description: "evaluify provides tailored assessment solutions for a wide range of industries. Discover how our platform can be customized to fit the unique challenges of your sector.",
        
        educationTitle: "Higher Education",
        educationDesc: "Ensure academic integrity for remote exams, quizzes, and entrance tests with our robust AI proctoring and plagiarism detection.",
        
        corporateTitle: "Corporate Hiring",
        corporateDesc: "Streamline your recruitment process with standardized technical and soft-skill assessments. Identify top candidates faster and reduce hiring bias.",

        trainingTitle: "Training & Certification",
        trainingDesc: "Validate learning and award certifications with confidence. Create comprehensive exams for professional development and training programs.",
    },
    ar: {
        title: "حلول مصممة لكل قطاع",
        description: "توفر evaluify حلول تقييم مخصصة لمجموعة واسعة من القطاعات. اكتشف كيف يمكن تكييف منصتنا لتناسب التحديات الفريدة لقطاعك.",
        
        educationTitle: "التعليم العالي",
        educationDesc: "اضمن النزاهة الأكاديمية للاختبارات والواجبات واختبارات القبول عن بعد، من خلال المراقبة القوية بالذكاء الاصطناعي وكشف الانتحال.",

        corporateTitle: "التوظيف في الشركات",
        corporateDesc: "بسّط عملية التوظيف لديك بتقييمات موحدة للمهارات الفنية والشخصية. حدد أفضل المرشحين بسرعة أكبر وقلل من التحيز في الاختيار.",

        trainingTitle: "التدريب وإصدار الشهادات",
        trainingDesc: "تحقق من مخرجات التعلم وامْنح الشهادات بثقة. أنشئ اختبارات شاملة لبرامج التطوير المهني والتدريب.",
    }
};

const IndustryCard = ({ title, description, icon: Icon }: { title: string, description: string, icon: React.ElementType }) => (
    <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-primary-500/10 hover:border-primary-300 dark:hover:border-primary-500/50 transition-all duration-300 transform hover:-translate-y-1">
        <div className="w-12 h-12 bg-primary-100 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400 rounded-xl flex items-center justify-center mb-4">
            <Icon className="w-7 h-7" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{title}</h3>
        <p className="mt-2 text-slate-600 dark:text-slate-300">{description}</p>
    </div>
);

const IndustriesPage = () => {
    const { lang } = useLanguage();
    const t = translations[lang];
    
    return (
        <SitePageLayout>
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100">{t.title}</h1>
                    <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                        {t.description}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <IndustryCard title={t.educationTitle} description={t.educationDesc} icon={BookOpenIcon} />
                    <IndustryCard title={t.corporateTitle} description={t.corporateDesc} icon={BriefcaseIcon} />
                    <IndustryCard title={t.trainingTitle} description={t.trainingDesc} icon={CheckCircleIcon} />
                </div>
            </main>
        </SitePageLayout>
    );
};

export default IndustriesPage;