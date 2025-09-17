import React, { useState, useEffect, ReactNode } from 'react';
import { Exam, Question, QuestionType, ExamDifficulty } from '../types';
import { PlusCircleIcon, TrashIcon, XCircleIcon, SparklesIcon, Wand2Icon, SpinnerIcon } from './icons';
import QuestionBankModal from './QuestionBankModal';
import { AIQuestionGeneratorModal } from './AIQuestionGeneratorModal';
import { getAIQuestionSuggestions } from '../services/mockApi';
import { useLanguage } from '../App';

interface ExamFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (exam: Omit<Exam, 'id' | 'questionCount'> | Exam) => void;
  examToEdit?: Exam | null;
}

const translations = {
    en: {
        createExam: "Create New Exam",
        editExam: "Edit Exam",
        examTitle: "Exam Title",
        description: "Description",
        duration: "Duration (minutes)",
        scheduling: "Scheduling (Optional)",
        availableFrom: "Available From",
        availableUntil: "Available Until",
        easy: "Easy",
        medium: "Medium",
        hard: "Hard",
        questions: "Questions",
        question: "Question",
        points: "Points",
        tags: "Tags (comma-separated)",
        addOption: "Add Option",
        addItem: "Add Item",
        prompts: "Prompts",
        options: "Options",
        correctMatches: "Correct Matches",
        addPrompt: "Add Prompt",
        orderingHelp: "Enter items in the correct order. Examinees will be asked to re-order them.",
        modelAnswerHelp: "Provide the model answer or grading criteria here...",
        justifyHelp: "Justify your answer...",
        modelJustification: "Model Justification",
        addManually: "Add Manually",
        addFromBank: "Add from Bank",
        aiGenerate: "AI Generate ✨",
        cancel: "Cancel",
        saveExam: "Save Exam",
        alertRequired: "Exam title and at least one question are required.",
        aiAssistTitle: "Complete with AI (min 15 chars)",
        questionTypes: {
            [QuestionType.MultipleChoice]: 'Multiple Choice (Single)',
            [QuestionType.MultipleSelect]: 'Multiple Select',
            [QuestionType.TrueFalse]: 'True/False',
            [QuestionType.TrueFalseWithJustification]: 'True/False + Justification',
            [QuestionType.ShortAnswer]: 'Short Answer',
            [QuestionType.Essay]: 'Essay',
            [QuestionType.Ordering]: 'Ordering',
            [QuestionType.Matching]: 'Matching',
        }
    },
    ar: {
        createExam: "إنشاء اختبار جديد",
        editExam: "تعديل الاختبار",
        examTitle: "عنوان الاختبار",
        description: "الوصف",
        duration: "المدة (بالدقائق)",
        scheduling: "الجدولة (اختياري)",
        availableFrom: "متاح من",
        availableUntil: "متاح حتى",
        easy: "سهل",
        medium: "متوسط",
        hard: "صعب",
        questions: "الأسئلة",
        question: "سؤال",
        points: "النقاط",
        tags: "الوسوم (مفصولة بفاصلة)",
        addOption: "إضافة خيار",
        addItem: "إضافة عنصر",
        prompts: "البنود",
        options: "الخيارات",
        correctMatches: "المطابقات الصحيحة",
        addPrompt: "إضافة بند",
        orderingHelp: "أدخل العناصر بالترتيب الصحيح. سيُطلب من الممتحنين إعادة ترتيبها.",
        modelAnswerHelp: "أدخل الإجابة النموذجية أو معايير التصحيح هنا...",
        justifyHelp: "برر إجابتك...",
        modelJustification: "التبرير النموذجي",
        addManually: "إضافة يدوية",
        addFromBank: "إضافة من البنك",
        aiGenerate: "توليد بالذكاء الاصطناعي ✨",
        cancel: "إلغاء",
        saveExam: "حفظ الاختبار",
        alertRequired: "يجب إدخال عنوان للاختبار وسؤال واحد على الأقل.",
        aiAssistTitle: "أكمل بالذكاء الاصطناعي (15 حرفًا على الأقل)",
        questionTypes: {
            [QuestionType.MultipleChoice]: 'اختيار من متعدد',
            [QuestionType.MultipleSelect]: 'تحديد متعدد',
            [QuestionType.TrueFalse]: 'صح / خطأ',
            [QuestionType.TrueFalseWithJustification]: 'صح / خطأ مع تعليل',
            [QuestionType.ShortAnswer]: 'إجابة قصيرة',
            [QuestionType.Essay]: 'سؤال مقالي',
            [QuestionType.Ordering]: 'سؤال ترتيب',
            [QuestionType.Matching]: 'سؤال مطابقة',
        }
    }
};

const toDateTimeLocal = (isoString?: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().slice(0, 16);
};

const ExamFormModal: React.FC<ExamFormModalProps> = ({ isOpen, onClose, onSave, examToEdit }) => {
  const [examData, setExamData] = useState<Partial<Exam>>({});
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiLoadingQuestionIndex, setAiLoadingQuestionIndex] = useState<number | null>(null);
  const { lang } = useLanguage();
  const t = translations[lang];

  useEffect(() => {
    if (isOpen) {
      if (examToEdit) {
        setExamData({ ...examToEdit });
      } else {
        setExamData({
          title: '',
          description: '',
          duration: 30,
          difficulty: 'Medium',
          questions: [],
          availableFrom: '',
          availableUntil: '',
        });
      }
    }
  }, [isOpen, examToEdit]);
  
  const handleChange = (field: keyof Exam, value: any) => {
    setExamData(prev => ({...prev, [field]: value}));
  };

  const handleQuestionChange = (index: number, field: keyof Question, value: any) => {
    const newQuestions = [...(examData.questions || [])];
    (newQuestions[index] as any)[field] = value;
    handleChange('questions', newQuestions);
  };
  
  const handleOptionChange = (qIndex: number, oIndex: number, value: string, field: 'options' | 'prompts' = 'options') => {
    const newQuestions = [...(examData.questions || [])];
    const question = newQuestions[qIndex];
    if (question[field]) {
      question[field]![oIndex] = value;
      handleChange('questions', newQuestions);
    }
  };

  const addListItem = (qIndex: number, field: 'options' | 'prompts' = 'options') => {
    const newQuestions = [...(examData.questions || [])];
    const question = newQuestions[qIndex];
    if (question[field]) {
      question[field]!.push('');
    } else {
        (question as any)[field] = [''];
    }
    handleChange('questions', newQuestions);
  };

  const removeListItem = (qIndex: number, oIndex: number, field: 'options' | 'prompts' = 'options') => {
    const newQuestions = [...(examData.questions || [])];
    const question = newQuestions[qIndex];
    if (question[field]) {
      question[field]!.splice(oIndex, 1);
      handleChange('questions', newQuestions);
    }
  };

  const addQuestion = () => {
    const newQuestion: Question = {
      id: `new-${Date.now()}`,
      text: '',
      type: QuestionType.MultipleChoice,
      options: ['', ''],
      correctAnswer: '',
      points: 5,
      tags: [],
      ownerId: '',
      category: '',
      subCategory: '',
    };
    handleChange('questions', [...(examData.questions || []), newQuestion]);
  };

  const removeQuestion = (index: number) => {
    const newQuestions = [...(examData.questions || [])];
    newQuestions.splice(index, 1);
    handleChange('questions', newQuestions);
  };
  
  const handleTypeChange = (index: number, type: QuestionType) => {
    const newQuestions = [...(examData.questions || [])];
    const q: Partial<Question> = { type };

    switch (type) {
        case QuestionType.MultipleChoice: q.options = ['', '']; q.correctAnswer = ''; break;
        case QuestionType.MultipleSelect: q.options = ['', '']; q.correctAnswer = []; break;
        case QuestionType.TrueFalse: q.options = ['True', 'False']; q.correctAnswer = 'True'; break;
        case QuestionType.TrueFalseWithJustification: q.correctAnswer = { selection: 'True', justification: '' }; break;
        case QuestionType.ShortAnswer:
        case QuestionType.Essay: q.correctAnswer = ''; delete q.options; break;
        case QuestionType.Ordering: q.options = ['', '']; q.correctAnswer = []; break;
        case QuestionType.Matching: q.prompts = ['', '']; q.options = ['', '']; q.correctAnswer = []; break;
    }
    newQuestions[index] = {...newQuestions[index], ...q};
    handleChange('questions', newQuestions);
  };

  const handleAddQuestionsFromBank = (bankQuestions: Question[]) => {
      handleChange('questions', [...(examData.questions || []), ...bankQuestions]);
      setIsBankModalOpen(false);
  };

  const handleAddQuestionsFromAI = (aiQuestions: Omit<Question, 'id'>[]) => {
    const newQuestions = aiQuestions.map(q => ({...q, id: `new-${Date.now()}-${Math.random()}`}));
    handleChange('questions', [...(examData.questions || []), ...newQuestions]);
    setIsAiModalOpen(false);
  };

  const handleAiAssist = async (qIndex: number) => {
      const questions = examData.questions || [];
      const partialText = questions[qIndex].text;
      if (partialText.length < 15) return;
      setAiLoadingQuestionIndex(qIndex);
      try {
          const suggestions = await getAIQuestionSuggestions({ partialQuestionText: partialText });
          const newQuestions = [...questions];
          newQuestions[qIndex] = {
              ...newQuestions[qIndex],
              text: suggestions.text,
              options: suggestions.options,
              correctAnswer: suggestions.correctAnswer,
              points: suggestions.points,
              tags: suggestions.tags,
              type: QuestionType.MultipleChoice,
          };
          handleChange('questions', newQuestions);
      } catch (error) {
          console.error("AI assist failed", error);
          alert("AI assistance failed. Please try again.");
      } finally {
          setAiLoadingQuestionIndex(null);
      }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      alert(t.alertRequired);
      return;
    }
    const finalExam = { ...examData };
    if (finalExam.questions) {
        finalExam.questions = finalExam.questions.map(q => {
            if (q.type === QuestionType.Ordering) {
                return { ...q, correctAnswer: q.options || [] };
            }
            return q;
        });
    }
    onSave(finalExam as Exam);
  };
  
  const isFormValid = examData.title && (examData.questions || []).length > 0;
  
  if (!isOpen) return null;

  return (
    <>
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-labelledby="exam-form-modal-title" className="modal-content-container bg-white dark:bg-slate-800 rounded-lg shadow-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <h2 id="exam-form-modal-title" className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-100">
          {examToEdit ? t.editExam : t.createExam}
        </h2>
        <form onSubmit={handleFormSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <input type="text" placeholder={t.examTitle} value={examData.title || ''} onChange={e => handleChange('title', e.target.value)} className="p-3 bg-slate-100 dark:bg-slate-700 rounded-md w-full focus:ring-2 focus:ring-primary-500" required />
            <input type="text" placeholder={t.description} value={examData.description || ''} onChange={e => handleChange('description', e.target.value)} className="p-3 bg-slate-100 dark:bg-slate-700 rounded-md w-full focus:ring-2 focus:ring-primary-500" />
            <input type="number" placeholder={t.duration} value={examData.duration || 30} onChange={e => handleChange('duration', parseInt(e.target.value))} className="p-3 bg-slate-100 dark:bg-slate-700 rounded-md w-full focus:ring-2 focus:ring-primary-500" required/>
            <select value={examData.difficulty || 'Medium'} onChange={e => handleChange('difficulty', e.target.value as ExamDifficulty)} className="p-3 bg-slate-100 dark:bg-slate-700 rounded-md w-full focus:ring-2 focus:ring-primary-500">
              <option value="Easy">{t.easy}</option>
              <option value="Medium">{t.medium}</option>
              <option value="Hard">{t.hard}</option>
            </select>
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold mb-2">{t.scheduling}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                  <label htmlFor="availableFrom" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{t.availableFrom}</label>
                  <input type="datetime-local" id="availableFrom" value={toDateTimeLocal(examData.availableFrom)} onChange={e => handleChange('availableFrom', e.target.value ? new Date(e.target.value).toISOString() : '')} className="p-2 bg-white dark:bg-slate-600 rounded-md w-full border border-slate-300 dark:border-slate-500" />
               </div>
               <div>
                   <label htmlFor="availableUntil" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{t.availableUntil}</label>
                   <input type="datetime-local" id="availableUntil" value={toDateTimeLocal(examData.availableUntil)} onChange={e => handleChange('availableUntil', e.target.value ? new Date(e.target.value).toISOString() : '')} className="p-2 bg-white dark:bg-slate-600 rounded-md w-full border border-slate-300 dark:border-slate-500" />
               </div>
            </div>
          </div>


          <h3 className="text-2xl font-bold mb-4 text-slate-700 dark:text-slate-200">{t.questions}</h3>
          <div className="space-y-6">
            {(examData.questions || []).map((q, qIndex) => (
              <div key={q.id} className="bg-slate-50 dark:bg-slate-700 p-6 rounded-lg border border-slate-200 dark:border-slate-600 relative">
                <button type="button" onClick={() => removeQuestion(qIndex)} className="absolute top-3 right-3 text-red-500 hover:text-red-700" aria-label={`Delete question ${qIndex + 1}`}>
                  <TrashIcon className="w-6 h-6" />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="relative md:col-span-2">
                        <textarea placeholder={`${t.question} ${qIndex + 1}`} value={q.text} onChange={e => handleQuestionChange(qIndex, 'text', e.target.value)} className="p-2 bg-white dark:bg-slate-600 rounded-md w-full h-24" required />
                        <button
                            type="button"
                            onClick={() => handleAiAssist(qIndex)}
                            disabled={aiLoadingQuestionIndex === qIndex || q.text.length < 15}
                            className="absolute top-2 right-2 p-1.5 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded-full hover:bg-purple-200 dark:hover:bg-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            title={t.aiAssistTitle}
                            aria-label="Complete question with AI"
                        >
                           {aiLoadingQuestionIndex === qIndex ? <SpinnerIcon className="w-4 h-4" /> : <Wand2Icon className="w-4 h-4" />}
                        </button>
                    </div>
                    <div className="space-y-2">
                        <select value={q.type} onChange={e => handleTypeChange(qIndex, e.target.value as QuestionType)} className="p-2 bg-white dark:bg-slate-600 rounded-md w-full">
                            {Object.entries(t.questionTypes).map(([key, value]) => (
                                <option key={key} value={key}>{value as ReactNode}</option>
                            ))}
                        </select>
                        <input type="number" placeholder={t.points} value={q.points} onChange={e => handleQuestionChange(qIndex, 'points', parseInt(e.target.value))} className="p-2 bg-white dark:bg-slate-600 rounded-md w-full" required />
                        <input type="text" placeholder={t.tags} value={q.tags?.join(', ') || ''} onChange={e => handleQuestionChange(qIndex, 'tags', e.target.value.split(',').map(t => t.trim()))} className="p-2 bg-white dark:bg-slate-600 rounded-md w-full" />
                    </div>
                </div>

                {q.type === QuestionType.MultipleChoice && (
                    <div className="space-y-2">
                        {q.options?.map((opt, oIndex) => (
                            <div key={oIndex} className="flex items-center gap-2">
                                <input type="radio" name={`correct-answer-${qIndex}`} value={opt} checked={q.correctAnswer === opt} onChange={e => handleQuestionChange(qIndex, 'correctAnswer', e.target.value)} />
                                <input type="text" placeholder={`${t.options} ${oIndex + 1}`} value={opt} onChange={e => handleOptionChange(qIndex, oIndex, e.target.value)} className="p-2 bg-white dark:bg-slate-600 rounded-md w-full" required/>
                                <button type="button" onClick={() => removeListItem(qIndex, oIndex)} className="text-red-500 hover:text-red-600 disabled:opacity-50" disabled={q.options && q.options.length <= 2} aria-label={`Remove option ${oIndex + 1}`}>
                                    <XCircleIcon className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                        <button type="button" onClick={() => addListItem(qIndex)} className="text-sm text-primary-500 hover:text-primary-600 font-semibold mt-2">{t.addOption}</button>
                    </div>
                )}
                {/* ... other question types remain the same */}
              </div>
            ))}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button type="button" onClick={addQuestion} className="w-full flex justify-center items-center p-3 border-2 border-dashed border-slate-300 dark:border-slate-500 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                <PlusCircleIcon className="w-6 h-6 me-2" />
                {t.addManually}
              </button>
               <button type="button" onClick={() => setIsBankModalOpen(true)} className="w-full flex justify-center items-center p-3 border-2 border-dashed border-primary-500 dark:border-primary-500 rounded-lg text-primary-500 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-slate-700 transition-colors">
                <PlusCircleIcon className="w-6 h-6 me-2" />
                {t.addFromBank}
              </button>
              <button type="button" onClick={() => setIsAiModalOpen(true)} className="w-full flex justify-center items-center p-3 border-2 border-dashed border-purple-400 dark:border-purple-500 rounded-lg text-purple-500 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-slate-700 transition-colors font-semibold">
                <SparklesIcon className="w-6 h-6 me-2" />
                {t.aiGenerate}
              </button>
            </div>
          </div>
          
          <div className="flex justify-end gap-4 mt-8">
            <button type="button" onClick={onClose} className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-500 text-slate-800 dark:text-slate-200 font-bold py-2 px-6 rounded-lg">{t.cancel}</button>
            <button type="submit" disabled={!isFormValid} className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">{t.saveExam}</button>
          </div>
        </form>
      </div>
    </div>
    <QuestionBankModal 
        isOpen={isBankModalOpen}
        onClose={() => setIsBankModalOpen(false)}
        onAddQuestions={handleAddQuestionsFromBank}
    />
    <AIQuestionGeneratorModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onAddQuestions={handleAddQuestionsFromAI}
    />
    </>
  );
};

export default ExamFormModal;