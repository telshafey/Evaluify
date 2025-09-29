import React from 'react';
// FIX: Update import path for useLanguage hook to use the centralized AuthContext.
import { useLanguage } from '../contexts/AuthContext';
import LegalPageLayout from '../components/LegalPageLayout';

const translations = {
    en: {
        title: "Privacy Policy",
        lastUpdated: "Last updated: July 27, 2024",
        sections: [
            {
                title: "1. Introduction",
                content: "Welcome to evaluify. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform."
            },
            {
                title: "2. Information We Collect",
                content: "We may collect personal information such as your name, email address, and educational or professional information. We also collect usage data, such as your IP address, browser type, and information about your interactions with our platform, including video and audio data during proctored exams."
            },
            {
                title: "3. How We Use Your Information",
                content: "We use the information we collect to: provide, operate, and maintain our platform; improve, personalize, and expand our services; understand and analyze how you use our platform; develop new products, services, and features; communicate with you for customer service and promotional purposes; and for security purposes, such as fraud detection and proctoring."
            },
            {
                title: "4. Data Security",
                content: "We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable."
            },
            {
                title: "5. Contact Us",
                content: "If you have questions or comments about this Privacy Policy, please contact us at: privacy@evaluify.com"
            }
        ]
    },
    ar: {
        title: "سياسة الخصوصية",
        lastUpdated: "آخر تحديث: 27 يوليو 2024",
        sections: [
            {
                title: "1. مقدمة",
                content: "أهلاً بك في evaluify. نحن نلتزم بحماية خصوصيتك. توضح سياسة الخصوصية هذه كيفية جمعنا واستخدامنا وكشفنا وحمايتنا لمعلوماتك عند استخدامك لمنصتنا."
            },
            {
                title: "2. المعلومات التي نجمعها",
                content: "قد نجمع معلومات شخصية مثل اسمك وعنوان بريدك الإلكتروني ومعلوماتك التعليمية أو المهنية. كما نجمع بيانات الاستخدام، مثل عنوان IP الخاص بك ونوع المتصفح ومعلومات حول تفاعلاتك مع منصتنا، بما في ذلك بيانات الفيديو والصوت أثناء الاختبارات المراقبة."
            },
            {
                title: "3. كيف نستخدم معلوماتك",
                content: "نستخدم المعلومات التي نجمعها من أجل: توفير منصتنا وتشغيلها وصيانتها؛ تحسين خدماتنا وتخصيصها وتوسيعها؛ فهم وتحليل كيفية استخدامك لمنصتنا؛ تطوير منتجات وخدمات وميزات جديدة؛ التواصل معك لخدمة العملاء والأغراض الترويجية؛ ولأغراض أمنية، مثل كشف الاحتيال والمراقبة."
            },
            {
                title: "4. أمان البيانات",
                content: "نستخدم تدابير أمنية إدارية وتقنية ومادية للمساعدة في حماية معلوماتك الشخصية. على الرغم من أننا اتخذنا خطوات معقولة لتأمين المعلومات الشخصية التي تقدمها لنا، يرجى العلم أنه على الرغم من جهودنا، لا توجد تدابير أمنية مثالية أو منيعة تمامًا."
            },
            {
                title: "5. اتصل بنا",
                content: "إذا كانت لديك أسئلة أو تعليقات حول سياسة الخصوصية هذه، فيرجى التواصل معنا عبر: privacy@evaluify.com"
            }
        ]
    }
};

const PrivacyPolicyPage = () => {
    const { lang } = useLanguage();
    const t = translations[lang];

    return (
        <LegalPageLayout title={t.title} lastUpdated={t.lastUpdated}>
            {t.sections.map(section => (
                <section key={section.title} className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">{section.title}</h2>
                    <p className="mt-2 leading-relaxed">{section.content}</p>
                </section>
            ))}
        </LegalPageLayout>
    );
};

export default PrivacyPolicyPage;