
import SitePageLayout from '../components/SitePageLayout';
import { useLanguage } from '../App';

const translations = {
    en: {
        title: "Trusted by the Best",
        description: "We are proud to partner with leading educational institutions and corporations around the world. See how evaluify is transforming online assessment for organizations like yours.",
        caseStudy: "CASE STUDY",
        readStory: "Read Full Story",
        
        customer1Title: "Tech University Increases Exam Integrity by 60%",
        customer1Quote: `"With evaluify's AI proctoring, we've seen a dramatic decrease in academic dishonesty cases, restoring trust in our online degree programs."`,
        
        customer2Title: "Innovate Corp Reduces Time-to-Hire by 30%",
        customer2Quote: `"The automated technical assessments allow our engineering managers to focus only on the most qualified candidates, saving countless hours."`
    },
    ar: {
        title: "شركاء النجاح",
        description: "نفخر بشراكتنا مع المؤسسات التعليمية والشركات الرائدة حول العالم. شاهد كيف تُحدِث evaluify تحولاً في التقييم عبر الإنترنت للمؤسسات التي تشبه مؤسستك.",
        caseStudy: "دراسة حالة",
        readStory: "اقرأ القصة كاملة",

        customer1Title: "جامعة التكنولوجيا تزيد من نزاهة الامتحانات بنسبة 60%",
        customer1Quote: `"مع المراقبة بالذكاء الاصطناعي من evaluify، شهدنا انخفاضًا كبيرًا في حالات عدم النزاهة الأكاديمية، مما أعاد الثقة في برامجنا للشهادات عبر الإنترنت."`,

        customer2Title: "شركة إبداع تقلل وقت التوظيف بنسبة 30%",
        customer2Quote: `"التقييمات الفنية الآلية تسمح لمديري الهندسة لدينا بالتركيز فقط على المرشحين الأكثر تأهيلاً، مما يوفر ساعات لا حصر لها."`
    }
};

const customers = ['Innovate Corp', 'Tech University', 'Global Certs', 'Edu Alliance', 'NextGen Academy', 'Quantum Solutions'];

const CaseStudyCard = ({ title, quote, buttonText }: { title: string, quote: string, buttonText: string }) => (
    <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-2xl border border-slate-200 dark:border-slate-700">
        <p className="text-xs font-bold uppercase tracking-widest text-primary-500">CASE STUDY</p>
        <h3 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">{title}</h3>
        <p className="mt-4 text-slate-600 dark:text-slate-300 italic">{quote}</p>
        <button className="mt-6 font-semibold text-primary-500 hover:text-primary-600">{buttonText} &rarr;</button>
    </div>
);


const CustomersPage = () => {
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

                <section className="py-12 bg-slate-50 dark:bg-slate-950">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-8 opacity-70 grayscale">
                            {customers.map(name => (
                                <div key={name} className="flex items-center justify-center p-4">
                                    <span className="text-md font-semibold text-slate-600 dark:text-slate-400">{name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
                
                <section className="py-20 bg-white dark:bg-slate-900">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                            <CaseStudyCard title={t.customer1Title} quote={t.customer1Quote} buttonText={t.readStory} />
                            <CaseStudyCard title={t.customer2Title} quote={t.customer2Quote} buttonText={t.readStory} />
                        </div>
                    </div>
                </section>
            </main>
        </SitePageLayout>
    );
};

export default CustomersPage;
