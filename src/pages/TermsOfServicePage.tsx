import React from 'react';
import SitePageLayout from '../components/SitePageLayout.tsx';
import { useLanguage } from '../App.tsx';

const translations = {
    en: {
        title: "Terms of Service",
        lastUpdated: "Last updated: July 27, 2024",
        sections: [
            {
                title: "1. Acceptance of Terms",
                content: "By accessing or using the evaluify platform, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service."
            },
            {
                title: "2. User Accounts",
                content: "You are responsible for safeguarding your account information and for any activities or actions under your account. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account."
            },
            {
                title: "3. User Conduct",
                content: "You agree not to use the service to: engage in any form of academic dishonesty; upload or transmit viruses or any other type of malicious code; attempt to gain unauthorized access to our systems or engage in any activity that disrupts, diminishes the quality of, interferes with the performance of, or impairs the functionality of the service."
            },
            {
                title: "4. Termination",
                content: "We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms."
            },
            {
                title: "5. Governing Law",
                content: "These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which our company is established, without regard to its conflict of law provisions."
            }
        ]
    },
    ar: {
        title: "شروط الخدمة",
        lastUpdated: "آخر تحديث: 27 يوليو 2024",
        sections: [
            {
                title: "1. قبول الشروط",
                content: "من خلال الوصول إلى منصة evaluify أو استخدامها، فإنك توافق على الالتزام بشروط الخدمة هذه. إذا كنت لا توافق على أي جزء من الشروط، فلا يجوز لك الوصول إلى الخدمة."
            },
            {
                title: "2. حسابات المستخدمين",
                content: "أنت مسؤول عن حماية معلومات حسابك وعن أي أنشطة أو إجراءات تتم تحت حسابك. يجب عليك إخطارنا فورًا عند علمك بأي خرق للأمن أو استخدام غير مصرح به لحسابك."
            },
            {
                title: "3. سلوك المستخدم",
                content: "أنت توافق على عدم استخدام الخدمة من أجل: الانخراط في أي شكل من أشكال عدم النزاهة الأكاديمية؛ تحميل أو نقل فيروسات أو أي نوع آخر من التعليمات البرمجية الضارة؛ محاولة الوصول غير المصرح به إلى أنظمتنا أو الانخراط في أي نشاط يعطل أو يقلل من جودة الخدمة أو يتعارض مع أدائها أو يضعف وظائفها."
            },
            {
                title: "4. الإنهاء",
                content: "يجوز لنا إنهاء حسابك أو تعليقه على الفور، دون إشعار مسبق أو مسؤولية، لأي سبب من الأسباب، بما في ذلك على سبيل المثال لا الحصر إذا انتهكت الشروط."
            },
            {
                title: "5. القانون الحاكم",
                content: "تخضع هذه الشروط وتُفسر وفقًا لقوانين الولاية القضائية التي تأسست فيها شركتنا، بغض النظر عن تعارضها مع أحكام القانون."
            }
        ]
    }
};

const LegalPageLayout: React.FC<{ title: string, lastUpdated: string, children: React.ReactNode }> = ({ title, lastUpdated, children }) => (
    <SitePageLayout>
        <main className="bg-white dark:bg-slate-900">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <header className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100">{title}</h1>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{lastUpdated}</p>
                </header>
                <article className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300">
                    {children}
                </article>
            </div>
        </main>
    </SitePageLayout>
);

const TermsOfServicePage = () => {
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

export default TermsOfServicePage;