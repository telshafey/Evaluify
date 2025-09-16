
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getExamDetails, submitExam } from '../services/mockApi';
import { Exam, Question, StudentAnswer, ProctoringEvent, Answer, QuestionType, TrueFalseJustificationAnswer } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import { ClockIcon } from '../components/icons';
import { useLanguage } from '../App';

const translations = {
    en: {
        loading: "Loading Exam...",
        notFound: "Exam not found.",
        submitConfirm: "Are you sure you want to submit your exam?",
        timeUp: "Time's up! Your exam will be submitted automatically.",
        question: "Question",
        of: "of",
        next: "Next",
        previous: "Previous",
        submit: "Submit Exam",
        justifyPlaceholder: "Justify your answer...",
    },
    ar: {
        loading: "جاري تحميل الاختبار...",
        notFound: "الاختبار غير موجود.",
        submitConfirm: "هل أنت متأكد من رغبتك في إرسال الاختبار؟",
        timeUp: "انتهى الوقت! سيتم إرسال اختبارك تلقائيًا.",
        question: "سؤال",
        of: "من",
        next: "التالي",
        previous: "السابق",
        submit: "إرسال الاختبار",
        justifyPlaceholder: "برر إجابتك...",
    }
};

const ExamTaker: React.FC = () => {
    const { examId } = useParams<{ examId: string }>();
    const navigate = useNavigate();
    const { lang } = useLanguage();
    const t = translations[lang];

    const [exam, setExam] = useState<Exam | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<StudentAnswer>({});
    const [timeLeft, setTimeLeft] = useState(0);
    const [proctoringEvents, setProctoringEvents] = useState<ProctoringEvent[]>([]);

    const handleSubmission = useCallback(async () => {
        if (!examId || !exam) return;
        setLoading(true);
        try {
            const result = await submitExam(examId, answers, proctoringEvents);
            navigate(`/examinee/result/${result.id}`);
        } catch (err) {
            console.error("Submission failed", err);
            setError("Failed to submit the exam. Please try again.");
            setLoading(false);
        }
    }, [examId, exam, answers, proctoringEvents, navigate]);
    
    useEffect(() => {
        if (!examId) return;
        const fetchExam = async () => {
            try {
                const data = await getExamDetails(examId);
                if (data) {
                    setExam(data);
                    setTimeLeft(data.duration * 60);
                } else {
                    setError(t.notFound);
                }
            } catch (err) {
                setError("Failed to load exam details.");
            } finally {
                setLoading(false);
            }
        };
        fetchExam();
    }, [examId, t.notFound]);

    useEffect(() => {
        if (timeLeft <= 0 && exam && !loading) {
            alert(t.timeUp);
            handleSubmission();
            return;
        }
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [timeLeft, exam, loading, handleSubmission, t.timeUp]);

    // Enhanced Proctoring Simulation
    useEffect(() => {
        const getTimestamp = () => (exam?.duration || 0) * 60 * 1000 - timeLeft * 1000;

        const handleVisibilityChange = () => {
            if (document.hidden) {
                setProctoringEvents(prev => [...prev, {
                    type: 'tab_switch',
                    timestamp: getTimestamp(),
                    severity: 'medium'
                }]);
            }
        };

        const handlePaste = () => {
             setProctoringEvents(prev => [...prev, {
                type: 'paste_content',
                timestamp: getTimestamp(),
                severity: 'low'
            }]);
        };
        
        const eventInterval = setInterval(() => {
            const randomEvent = Math.random();
            if (randomEvent < 0.05) { // 5% chance every 20 seconds
                 setProctoringEvents(prev => [...prev, {
                    type: 'face_detection',
                    timestamp: getTimestamp(),
                    severity: 'high',
                    details: 'Multiple faces detected'
                }]);
            } else if (randomEvent < 0.15) { // 10% chance
                 setProctoringEvents(prev => [...prev, {
                    type: 'noise_detection',
                    timestamp: getTimestamp(),
                    severity: 'low',
                    details: 'Loud background noise detected'
                }]);
            }
        }, 20000); // Check for random events every 20s


        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('paste', handlePaste);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('paste', handlePaste);
            clearInterval(eventInterval);
        };
    }, [exam, timeLeft]);

    const handleAnswerChange = (questionId: string, answer: Answer) => {
        setAnswers(prev => ({ ...prev, [questionId]: answer }));
    };

    if (loading) {
        return <div className="flex h-screen items-center justify-center bg-slate-100 dark:bg-slate-900"><LoadingSpinner /> <p className="ml-2">{t.loading}</p></div>;
    }

    if (error || !exam) {
        return <div className="flex h-screen items-center justify-center bg-slate-100 dark:bg-slate-900"><p className="text-red-500">{error || t.notFound}</p></div>;
    }

    const currentQuestion = exam.questions[currentQuestionIndex];
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    
    const renderQuestion = (q: Question) => {
        const userAnswer = answers[q.id];
        switch (q.type) {
            case QuestionType.MultipleChoice:
                return (
                    <div className="space-y-3">
                        {q.options?.map((option, index) => (
                            <label key={index} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700">
                                <input
                                    type="radio" name={q.id} value={option}
                                    checked={userAnswer === option}
                                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                    className="w-5 h-5 text-primary-600 focus:ring-primary-500"
                                />
                                <span className="mx-3 text-slate-700 dark:text-slate-300">{option}</span>
                            </label>
                        ))}
                    </div>
                );
            case QuestionType.MultipleSelect:
                const currentAnswers = (userAnswer as string[] || []);
                return (
                    <div className="space-y-3">
                        {q.options?.map((option, index) => (
                            <label key={index} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700">
                                <input
                                    type="checkbox" name={q.id} value={option}
                                    checked={currentAnswers.includes(option)}
                                    onChange={(e) => {
                                        const newAnswers = e.target.checked
                                            ? [...currentAnswers, option]
                                            : currentAnswers.filter(a => a !== option);
                                        handleAnswerChange(q.id, newAnswers);
                                    }}
                                    className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                                />
                                <span className="mx-3 text-slate-700 dark:text-slate-300">{option}</span>
                            </label>
                        ))}
                    </div>
                );
            case QuestionType.TrueFalse:
                 return (
                    <div className="space-y-3">
                        {(q.options || ['True', 'False']).map((option) => (
                            <label key={option} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700">
                                <input
                                    type="radio" name={q.id} value={option}
                                    checked={userAnswer === option}
                                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                    className="w-5 h-5 text-primary-600 focus:ring-primary-500"
                                />
                                <span className="mx-3 text-slate-700 dark:text-slate-300">{option}</span>
                            </label>
                        ))}
                    </div>
                );
            case QuestionType.ShortAnswer:
                return (
                    <input
                        type="text"
                        value={(userAnswer as string) || ''}
                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                        className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    />
                );
            case QuestionType.Essay:
                 return (
                    <textarea
                        value={(userAnswer as string) || ''}
                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                        rows={8}
                        className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    />
                );
            case QuestionType.TrueFalseWithJustification:
                const tfAnswer = (userAnswer as TrueFalseJustificationAnswer) || { selection: '', justification: '' };
                return (
                     <div>
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mb-4">
                            {['True', 'False'].map(option => (
                                 <label key={option} className="flex-1 flex items-center p-3 border rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700">
                                    <input
                                        type="radio" name={`${q.id}-selection`} value={option}
                                        checked={tfAnswer.selection === option}
                                        onChange={() => handleAnswerChange(q.id, { ...tfAnswer, selection: option as 'True' | 'False' })}
                                        className="w-5 h-5"
                                    />
                                    <span className="mx-3">{option}</span>
                                </label>
                            ))}
                        </div>
                         <textarea
                            value={tfAnswer.justification}
                            onChange={(e) => handleAnswerChange(q.id, { ...tfAnswer, justification: e.target.value })}
                            placeholder={t.justifyPlaceholder}
                            rows={4}
                            className="w-full p-3 bg-slate-50 dark:bg-slate-700 border rounded-lg"
                        />
                     </div>
                );
            default:
                return <p>Question type '{q.type}' is not supported for taking exams yet.</p>
        }
    };
    
    const handleSubmitClick = () => {
        if (window.confirm(t.submitConfirm)) {
            handleSubmission();
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
            <header className="bg-white dark:bg-slate-800 shadow-md p-4 flex flex-col sm:flex-row justify-between items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-center sm:text-left">{exam.title}</h1>
                <div className="flex items-center bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 font-bold px-4 py-2 rounded-full">
                    <ClockIcon className="w-5 h-5 sm:w-6 sm:h-6 mx-2" />
                    <span>{`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}</span>
                </div>
            </header>

            <main className="flex-1 container mx-auto p-4 md:p-6 flex flex-col">
                 <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 lg:p-8 rounded-2xl shadow-lg flex-1 flex flex-col">
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold text-slate-600 dark:text-slate-400">{t.question} {currentQuestionIndex + 1} {t.of} {exam.questions.length}</h2>
                        <p className="text-xl md:text-2xl font-bold mt-2">{currentQuestion.text}</p>
                    </div>

                    <div className="flex-1 mt-6">
                        {renderQuestion(currentQuestion)}
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <button
                            onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                            disabled={currentQuestionIndex === 0}
                            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-50"
                        >
                            {t.previous}
                        </button>
                        
                        {currentQuestionIndex === exam.questions.length - 1 ? (
                             <button
                                onClick={handleSubmitClick}
                                className="w-full sm:w-auto px-8 py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white font-bold"
                            >
                                {t.submit}
                            </button>
                        ) : (
                             <button
                                onClick={() => setCurrentQuestionIndex(prev => Math.min(exam.questions.length - 1, prev + 1))}
                                disabled={currentQuestionIndex === exam.questions.length - 1}
                                className="w-full sm:w-auto px-8 py-3 rounded-lg bg-primary-500 hover:bg-primary-600 text-white font-bold disabled:opacity-50"
                            >
                                {t.next}
                            </button>
                        )}
                    </div>
                 </div>
            </main>
        </div>
    );
};

export default ExamTaker;