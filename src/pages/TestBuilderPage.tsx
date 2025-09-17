import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout.tsx';
import useNavLinks from '../hooks/useNavLinks.ts';
import { Question, QuestionType, ExamDifficulty } from '../types.ts';
import { SparklesIcon, TrashIcon, EyeIcon, SpinnerIcon } from '../components/icons.tsx';
import { AIQuestionGeneratorModal } from '../components/AIQuestionGeneratorModal.tsx';
import { useNotification } from '../contexts/NotificationContext.tsx';
import { useLanguage } from '../App.tsx';
import { addAssessment } from '../services/mockApi.ts';

const translations = {
    en: {
        pageTitle: "Test Builder",
        testName: "Test Name",
        description: "Description",
        duration: "Duration (minutes)",
        difficulty: "Difficulty",
        questions: "Questions",
        addQuestion: "Add Question",
        saveTest: "Save Test",
        savingTest: "Saving...",
        previewTest: "Preview",
        aiGenerate: "AI Generate Questions ✨",
        testSaved: "Test saved successfully!",
        saveError: "Please provide a test name and add at least one question.",
        saveFailed: "Failed to save the test. Please try again.",
        noQuestions: "No questions added yet. Start by adding a question manually or using the AI generator.",
        questionPlaceholder: "Enter question text...",
        descriptionPlaceholder: "Provide a brief description of the test...",
        points: "Points",
        questionTypes: {
            mcq: "MCQ",
            short: "Short Answer",
            essay: "Essay",
            tf: "T/F"
        }
    },
    ar: {
        pageTitle: "منشئ الاختبارات",
        testName: "اسم الاختبار",
        description: "الوصف",
        duration: "المدة (بالدقائق)",
        difficulty: "الصعوبة",
        questions: "الأسئلة",
        addQuestion: "إضافة سؤال",
        saveTest: "حفظ الاختبار",
        savingTest: "جاري الحفظ...",
        previewTest: "معاينة",
        aiGenerate: "توليد أسئلة بالذكاء الاصطناعي ✨",
        testSaved: "تم حفظ الاختبار بنجاح!",
        saveError: "يرجى تقديم اسم للاختبار وإضافة سؤال واحد على الأقل.",
        saveFailed: "فشل حفظ الاختبار. يرجى المحاولة مرة أخرى.",
        noQuestions: "لم تتم إضافة أي أسئلة بعد. ابدأ بإضافة سؤال يدويًا أو باستخدام مولد الذكاء الاصطناعي.",
        questionPlaceholder: "أدخل نص السؤال...",
        descriptionPlaceholder: "أدخل وصفاً موجزاً للاختبار...",
        points: "النقاط",
        questionTypes: {
            mcq: "اختيار من متعدد",
            short: "إجابة قصيرة",
            essay: "مقالي",
            tf: "صح/خطأ"
        }
    }
};

const QuestionEditor: React.FC<{ 
    question: Question; 
    onUpdate: (q: Question) => void; 
    onDelete: () => void;
    lang: 'en' | 'ar';
}> = ({ question, onUpdate, onDelete, lang }) => {
    const t = translations[lang];
    return (
        <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex justify-between items-start">
                <textarea 
                    value={question.text} 
                    onChange={(e) => onUpdate({ ...question, text: e.target.value })}
                    placeholder={t.questionPlaceholder}
                    className="w-full bg-transparent p-1 -m-1 focus:bg-white dark:focus:bg-slate-700 rounded text-base font-semibold"
                    rows={2}
                />
                <button onClick={onDelete} className="ml-2 text-red-500 hover:text-red-700 flex-shrink-0">
                    <TrashIcon className="w-5 h-5" />
                </button>
            </div>
            {/* Minimal controls for demo */}
            <div className="flex items-center justify-between">
                <span className="text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-2 py-1 rounded-full">{question.type}</span>
                <div className="flex items-center">
                    <label className="text-sm mr-2">{t.points}:</label>
                    <input 
                        type="number" 
                        value={question.points}
                        onChange={(e) => onUpdate({ ...question, points: parseInt(e.target.value) || 0 })}
                        className="w-16 p-1 bg-slate-100 dark:bg-slate-700 rounded-md text-sm"
                    />
                </div>
            </div>
        </div>
    );
};

const TestBuilderPage: React.FC = () => {
    const navLinks = useNavLinks();
    const navigate = useNavigate();
    const { lang } = useLanguage();
    const t = translations[lang];
    const { addNotification } = useNotification();

    const [testName, setTestName] = useState('');
    const [description, setDescription] = useState('');
    const [duration, setDuration] = useState(60);
    const [difficulty, setDifficulty] = useState('Medium');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    
    const addQuestion = (type: QuestionType) => {
        const newQuestion: Question = {
            id: `q-${Date.now()}`,
            ownerId: 'teacher-1',
            text: '',
            type: type,
            category: 'General',
            subCategory: 'General',
            options: type === QuestionType.MultipleChoice || type === QuestionType.MultipleSelect || type === QuestionType.Ordering ? ['', ''] : undefined,
            prompts: type === QuestionType.Matching ? ['', ''] : undefined,
            correctAnswer: '',
            points: 5,
            tags: [],
        };
        setQuestions(prev => [...prev, newQuestion]);
    };

    const updateQuestion = (updatedQuestion: Question) => {
        setQuestions(prev => prev.map(q => q.id === updatedQuestion.id ? updatedQuestion : q));
    };

    const deleteQuestion = (questionId: string) => {
        setQuestions(prev => prev.filter(q => q.id !== questionId));
    };

    const handleAddFromAI = (aiQuestions: Omit<Question, 'id'>[]) => {
        const newQuestions = aiQuestions.map(q => ({ ...q, id: `ai-q-${Date.now()}-${Math.random()}`}));
        setQuestions(prev => [...prev, ...newQuestions]);
        setIsAiModalOpen(false);
        addNotification(`${newQuestions.length} questions added from AI!`, "success");
    };

    const handleSaveTest = async () => {
        if (!testName.trim() || questions.length === 0) {
            addNotification(t.saveError, "error");
            return;
        }
        setIsSaving(true);
        try {
            await addAssessment({
                ownerId: 'teacher-1', // hardcoded for demo
                ownerName: 'Dr. Anya Sharma',
                title: testName,
                description: description,
                duration,
                difficulty: difficulty as ExamDifficulty,
                questions,
            });
            addNotification(t.testSaved, "success");
            navigate('/assessments');
        } catch (error) {
            addNotification(t.saveFailed, "error");
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    const headerActions = (
        <div className="flex items-center gap-4">
            <button onClick={() => { /* Preview logic */ }} className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-500 font-bold py-2 px-4 rounded-lg flex items-center">
                <EyeIcon className="w-5 h-5 mr-2" />
                {t.previewTest}
            </button>
            <button onClick={handleSaveTest} disabled={isSaving} className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded-lg flex items-center min-w-[120px] justify-center">
                {isSaving ? <SpinnerIcon className="w-5 h-5" /> : t.saveTest}
            </button>
        </div>
    );
    
    return (
        <DashboardLayout navLinks={navLinks} pageTitle={t.pageTitle} headerActions={headerActions}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                             <div className="md:col-span-3">
                                <label className="block text-sm font-medium mb-1">{t.testName}</label>
                                <input type="text" value={testName} onChange={e => setTestName(e.target.value)} className="w-full p-2 bg-slate-100 dark:bg-slate-700 rounded-md" placeholder="e.g., Final JavaScript Exam" />
                            </div>
                            <div className="md:col-span-3">
                                <label className="block text-sm font-medium mb-1">{t.description}</label>
                                <textarea 
                                    value={description} 
                                    onChange={e => setDescription(e.target.value)} 
                                    className="w-full p-2 bg-slate-100 dark:bg-slate-700 rounded-md" 
                                    rows={2}
                                    placeholder={t.descriptionPlaceholder}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
                        <h3 className="text-xl font-bold mb-4">{t.questions} ({questions.length})</h3>
                        <div className="space-y-4">
                            {questions.length > 0 ? questions.map((q) => (
                                <QuestionEditor 
                                    key={q.id} 
                                    question={q} 
                                    onUpdate={updateQuestion} 
                                    onDelete={() => deleteQuestion(q.id)}
                                    lang={lang}
                                />
                            )) : <p className="text-center text-slate-500 py-8">{t.noQuestions}</p>}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
                        <h3 className="text-xl font-bold mb-4">Settings</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">{t.duration}</label>
                                <input type="number" value={duration} onChange={e => setDuration(parseInt(e.target.value))} className="w-full p-2 bg-slate-100 dark:bg-slate-700 rounded-md" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium mb-1">{t.difficulty}</label>
                                <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="w-full p-2 bg-slate-100 dark:bg-slate-700 rounded-md">
                                    <option>Easy</option>
                                    <option>Medium</option>
                                    <option>Hard</option>
                                </select>
                            </div>
                        </div>
                    </div>
                     <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
                        <h3 className="text-xl font-bold mb-4">{t.addQuestion}</h3>
                        <div className="grid grid-cols-2 gap-2">
                             <button onClick={() => addQuestion(QuestionType.MultipleChoice)} className="text-sm p-2 bg-slate-100 dark:bg-slate-700 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600">{t.questionTypes.mcq}</button>
                             <button onClick={() => addQuestion(QuestionType.ShortAnswer)} className="text-sm p-2 bg-slate-100 dark:bg-slate-700 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600">{t.questionTypes.short}</button>
                             <button onClick={() => addQuestion(QuestionType.Essay)} className="text-sm p-2 bg-slate-100 dark:bg-slate-700 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600">{t.questionTypes.essay}</button>
                             <button onClick={() => addQuestion(QuestionType.TrueFalse)} className="text-sm p-2 bg-slate-100 dark:bg-slate-700 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600">{t.questionTypes.tf}</button>
                        </div>
                        <button onClick={() => setIsAiModalOpen(true)} className="w-full mt-4 bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center">
                            <SparklesIcon className="w-5 h-5 mr-2" />
                            {t.aiGenerate}
                        </button>
                    </div>
                </div>
            </div>

            <AIQuestionGeneratorModal 
                isOpen={isAiModalOpen}
                onClose={() => setIsAiModalOpen(false)}
                onAddQuestions={handleAddFromAI}
            />
        </DashboardLayout>
    );
};

export default TestBuilderPage;
