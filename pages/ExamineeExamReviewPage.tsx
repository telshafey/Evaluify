import React, { useState, useEffect } from 'react';
// Fix: Corrected react-router-dom import syntax.
import { useParams, Link } from "react-router-dom";
import { getExamResultDetails } from '../services/mockApi';
import { Exam, ExamResult, Question, Answer, QuestionType, TrueFalseJustificationAnswer } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import { BookOpenIcon, CheckCircleIcon, XCircleIcon, DownloadIcon } from '../components/icons';
import { useLanguage, useTheme } from '../App';
import { generateResultPdf } from './shared/ExamineeResultPage';

const translations = {
    en: {
        title: "Review Your Exam",
        backToResults: "Back to My Results",
        loading: "Loading your review...",
        notFound: "Exam result not found.",
        yourAnswer: "Your Answer",
        correctAnswer: "Correct Answer",
        notAnswered: "Not Answered",
        correct: "Correct",
        incorrect: "Incorrect",
        justification: "Justification:",
        downloadPdf: "Download PDF",
    },
    ar: {
        title: "مراجعة اختبارك",
        backToResults: "العودة إلى نتائجي",
        loading: "جاري تحميل المراجعة...",
        notFound: "نتيجة الاختبار غير موجودة.",
        yourAnswer: "إجابتك",
        correctAnswer: "الإجابة الصحيحة",
        notAnswered: "لم تتم الإجابة",
        correct: "صحيحة",
        incorrect: "غير صحيحة",
        justification: "التبرير:",
        downloadPdf: "تحميل PDF",
    }
}

const isCorrect = (userAnswer: Answer, correctAnswer: Answer): boolean => {
    return JSON.stringify(userAnswer) === JSON.stringify(correctAnswer);
};

const AnswerDisplay: React.FC<{ answer: Answer, type: QuestionType, lang: 'en' | 'ar' }> = ({ answer, type, lang }) => {
    if (answer === null || answer === undefined) {
        return <p className="text-slate-500 italic">{translations[lang].notAnswered}</p>;
    }
    if (Array.isArray(answer)) {
        return <ul className="list-disc list-inside">{(answer as string[]).map((item, i) => <li key={i}>{item}</li>)}</ul>;
    }
    if (type === QuestionType.TrueFalseWithJustification) {
        const tfAnswer = answer as TrueFalseJustificationAnswer;
        return (
            <div>
                <p><strong>{tfAnswer.selection}</strong></p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 italic">
                    <strong>{translations[lang].justification}</strong> {tfAnswer.justification}
                </p>
            </div>
        );
    }
    return <p>{String(answer)}</p>;
};


const ExamineeExamReviewPage = () => {
    const { resultId } = useParams<{ resultId: string }>();
    const [result, setResult] = useState<ExamResult | null>(null);
    const [exam, setExam] = useState<Exam | null>(null);
    const [loading, setLoading] = useState(true);
    const { lang } = useLanguage();
    const { theme } = useTheme();
    const t = translations[lang];

    useEffect(() => {
        const fetchDetails = async () => {
            if (!resultId) return;
            try {
                const data = await getExamResultDetails(resultId);
                setResult(data?.result || null);
                setExam(data?.exam || null);
            } catch (error) {
                console.error("Failed to fetch result details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [resultId]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><p>{t.loading}</p></div>;
    }

    if (!result || !exam) {
        return <div className="flex justify-center items-center h-screen"><p>{t.notFound}</p></div>;
    }

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6 flex justify-between items-center">
                     <Link to="/examinee/results" className="text-blue-500 hover:underline">&larr; {t.backToResults}</Link>
                     <button
                        onClick={() => generateResultPdf(result, exam, theme.platformName)}
                        className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded-lg flex items-center"
                     >
                        <DownloadIcon className="w-5 h-5 mr-2" />
                        {t.downloadPdf}
                     </button>
                </div>
                <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg">
                    <h1 className="text-3xl font-bold mb-2">{t.title}: {exam.title}</h1>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">Score: {result.score} / {result.totalPoints}</p>

                    <div className="space-y-6">
                        {exam.questions.map((q, index) => {
                            const userAnswer = result.answers[q.id] ?? null;
                            const correct = isCorrect(userAnswer, q.correctAnswer);
                            return (
                                <div key={q.id} className="p-6 border border-slate-200 dark:border-slate-700 rounded-lg">
                                    <div className="flex justify-between items-start">
                                        <p className="font-semibold text-lg">{index + 1}. {q.text}</p>
                                        <span className={`flex items-center text-sm font-bold ${correct ? 'text-green-500' : 'text-red-500'}`}>
                                            {correct ? <CheckCircleIcon className="w-5 h-5 mr-1" /> : <XCircleIcon className="w-5 h-5 mr-1" />}
                                            {correct ? t.correct : t.incorrect}
                                        </span>
                                    </div>

                                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className={`p-4 rounded-lg ${correct ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                                            <h4 className="font-bold mb-2">{t.yourAnswer}</h4>
                                            <AnswerDisplay answer={userAnswer} type={q.type} lang={lang} />
                                        </div>
                                        <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-lg">
                                            <h4 className="font-bold mb-2">{t.correctAnswer}</h4>
                                            <AnswerDisplay answer={q.correctAnswer} type={q.type} lang={lang} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExamineeExamReviewPage;