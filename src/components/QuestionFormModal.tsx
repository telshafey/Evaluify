import React, { useState, useEffect, ReactNode } from 'react';
// Fix: Added imports for types and mockApi
import { Question, QuestionType, TrueFalseJustificationAnswer } from '../types';
import { XCircleIcon, Wand2Icon, SpinnerIcon } from './icons';
import { getAIQuestionSuggestions, getCategories } from '../services/mockApi';
import { useLanguage } from '../App';

interface QuestionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (question: Omit<Question, 'id'> | Question) => void;
  question: Question | null;
}

const translations = {
    en: {
        editTitle: "Edit Question",
        createTitle: "Create New Question",
        questionText: "Question Text",
        aiAssist: "Complete with AI (min 15 chars)",
        questionType: "Question Type",
        points: "Points",
        tags: "Tags (comma-separated)",
        category: "Category",
        subCategory: "Subcategory",
        selectCategory: "Select Category",
        selectSubCategory: "Select Subcategory",
        answerConfig: "Answer Configuration",
        addOption: "Add Option",
        addItem: "Add Item",
        addPrompt: "Add Prompt",
        orderingHelp: "Enter items in the correct order. Examinees will be asked to re-order them.",
        prompts: "Prompts",
        options: "Options",
        correctMatches: "Correct Matches",
        selectMatch: "Select a match",
        modelJustification: "Model Justification",
        modelAnswerHelp: "Provide the model answer or grading criteria here...",
        cancel: "Cancel",
        save: "Save Question",
        // FIX: Added missing questionTypes translations.
        questionTypes: {
            [QuestionType.MultipleChoice]: 'Multiple Choice',
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
        editTitle: "تعديل السؤال",
        createTitle: "إنشاء سؤال جديد",
        questionText: "نص السؤال",
        aiAssist: "أكمل بالذكاء الاصطناعي (15 حرفًا على الأقل)",
        questionType: "نوع السؤال",
        points: "النقاط",
        tags: "الوسوم (مفصولة بفاصلة)",
        category: "الفئة",
        subCategory: "الفئة الفرعية",
        selectCategory: "اختر فئة",
        selectSubCategory: "اختر فئة فرعية",
        answerConfig: "إعدادات الإجابة الصحيحة",
        addOption: "إضافة خيار",
        addItem: "إضافة عنصر",
        addPrompt: "إضافة بند",
        orderingHelp: "أدخل العناصر بالترتيب الصحيح. سيُطلب من الممتحنين إعادة ترتيبها.",
        prompts: "البنود",
        options: "الخيارات",
        correctMatches: "المطابقات الصحيحة",
        selectMatch: "اختر مطابقة",
        modelJustification: "التعليل النموذجي",
        modelAnswerHelp: "أدخل الإجابة النموذجية أو معايير التصحيح هنا...",
        cancel: "إلغاء",
        save: "حفظ السؤال",
        // FIX: Added missing questionTypes translations.
        questionTypes: {
            [QuestionType.MultipleChoice]: 'اختيار من متعدد',
            [QuestionType.MultipleSelect]: 'تحديد متعدد',
            [QuestionType.TrueFalse]: 'صح / خطأ',
            [QuestionType.TrueFalseWithJustification]: 'صح / خطأ مع تعليل',
            [QuestionType.ShortAnswer]: 'إجابة قصيرة',
            [QuestionType.Essay]: 'مقالي',
            [QuestionType.Ordering]: 'ترتيب',
            [QuestionType.Matching]: 'مطابقة',
        }
    }
}

type EditableQuestion = Omit<Question, 'id'>;
const DEFAULT_QUESTION: EditableQuestion = {
    ownerId: '', // Will be set on save
    text: '',
    type: QuestionType.MultipleChoice,
    category: '',
    subCategory: '',
    options: ['', ''],
    correctAnswer: '',
    points: 5,
    tags: [],
};

const QuestionFormModal: React.FC<QuestionFormModalProps> = ({ isOpen, onClose, onSave, question }) => {
  const [formData, setFormData] = useState<EditableQuestion | Question>(DEFAULT_QUESTION);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [categories, setCategories] = useState<Record<string, string[]>>({});
  const { lang } = useLanguage();
  const t = translations[lang];

  useEffect(() => {
    if (isOpen) {
        const fetchCats = async () => {
            const data = await getCategories();
            setCategories(data);
        };
        fetchCats();
        setFormData(question ? { ...question } : DEFAULT_QUESTION);
    }
  }, [isOpen, question]);
  
  const handleChange = (field: keyof EditableQuestion, value: any) => {
    const newData = {...formData, [field]: value};
    if (field === 'category') {
        (newData as EditableQuestion).subCategory = ''; // Reset subcategory when category changes
    }
    setFormData(newData);
  };
  
  const handleOptionChange = (oIndex: number, value: string, field: 'options' | 'prompts' = 'options') => {
    const newFormData = {...formData};
    if (newFormData[field]) {
      newFormData[field]![oIndex] = value;
      setFormData(newFormData);
    }
  };

  const addListItem = (field: 'options' | 'prompts' = 'options') => {
    const newFormData = {...formData};
    if (newFormData[field]) {
      newFormData[field]!.push('');
    } else {
        (newFormData as any)[field] = [''];
    }
    setFormData(newFormData);
  };

  const removeListItem = (oIndex: number, field: 'options' | 'prompts' = 'options') => {
    const newFormData = {...formData};
    if (newFormData[field]) {
      newFormData[field]!.splice(oIndex, 1);
      setFormData(newFormData);
    }
  };
  
  const handleTypeChange = (type: QuestionType) => {
    let q: Partial<EditableQuestion> = { type };
    const baseQuestion = { ...DEFAULT_QUESTION, text: formData.text, points: formData.points, category: formData.category, subCategory: formData.subCategory, type, tags: formData.tags };

    switch (type) {
        case QuestionType.MultipleChoice: q = { ...baseQuestion, options: ['', ''], correctAnswer: '' }; break;
        case QuestionType.MultipleSelect: q = { ...baseQuestion, options: ['', ''], correctAnswer: [] }; break;
        case QuestionType.TrueFalse: q = { ...baseQuestion, options: ['True', 'False'], correctAnswer: 'True' }; break;
        case QuestionType.TrueFalseWithJustification: q = { ...baseQuestion, correctAnswer: { selection: 'True', justification: '' } }; break;
        case QuestionType.ShortAnswer:
        case QuestionType.Essay: q = { ...baseQuestion, correctAnswer: '' }; break;
        case QuestionType.Ordering: q = { ...baseQuestion, options: ['', ''], correctAnswer: [] }; break;
        case QuestionType.Matching: q = { ...baseQuestion, prompts: ['', ''], options: ['', ''], correctAnswer: [] }; break;
    }
    setFormData(q as EditableQuestion);
  };

  const handleAiAssist = async () => {
      if (formData.text.length < 15) return;
      setIsAiLoading(true);
      try {
          const suggestions = await getAIQuestionSuggestions({ partialQuestionText: formData.text });
          setFormData(prev => ({
              ...(prev as EditableQuestion),
              text: suggestions.text,
              options: suggestions.options,
              correctAnswer: suggestions.correctAnswer,
              points: suggestions.points,
              tags: suggestions.tags,
              type: QuestionType.MultipleChoice,
          }));
      } catch (error) {
          console.error("AI assist failed", error);
          alert("AI assistance failed. Please try again.");
      } finally {
          setIsAiLoading(false);
      }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
        alert("Please fill all required fields correctly.");
        return;
    }
    let finalData = { ...formData };
    if (finalData.type === QuestionType.Ordering) {
      finalData.correctAnswer = finalData.options || [];
    }
    onSave(finalData);
  };
  
  const validateForm = () => {
      const q = formData;
      if (!q.text || !q.category || !q.subCategory || q.points <= 0) return false;
      
      switch (q.type) {
        case QuestionType.MultipleChoice:
          return q.options && q.options.length >= 2 && q.options.every(opt => opt.trim() !== '') && q.correctAnswer;
        case QuestionType.MultipleSelect:
          return q.options && q.options.length >= 2 && q.options.every(opt => opt.trim() !== '') && Array.isArray(q.correctAnswer) && q.correctAnswer.length > 0;
        case QuestionType.ShortAnswer:
        case QuestionType.Essay:
          return q.correctAnswer && (q.correctAnswer as string).trim() !== '';
        case QuestionType.TrueFalseWithJustification:
            const answer = q.correctAnswer as TrueFalseJustificationAnswer;
            return answer && (answer.selection === 'True' || answer.selection === 'False') && answer.justification.trim() !== '';
        default:
          return true;
      }
  };
  
  const isFormValid = validateForm();
  
  if (!isOpen) return null;
  const q = formData; // alias for brevity

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-[100] flex justify-center items-center p-4" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-labelledby="question-form-modal-title" className="modal-content-container bg-white dark:bg-slate-800 rounded-lg shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <h2 id="question-form-modal-title" className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100">{question ? t.editTitle : t.createTitle}</h2>
        <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="relative">
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{t.questionText}</label>
                <textarea placeholder={t.questionText} value={q.text} onChange={e => handleChange('text', e.target.value)} className="p-2 bg-slate-100 dark:bg-slate-700 rounded-md w-full h-24" required />
                <button type="button" onClick={handleAiAssist} disabled={isAiLoading || formData.text.length < 15} className="absolute top-8 right-2 p-1.5 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded-full hover:bg-purple-200 dark:hover:bg-purple-800 disabled:opacity-50" title={t.aiAssist} aria-label={t.aiAssist}><Wand2Icon className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                     <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{t.category}</label>
                     <select value={q.category} onChange={e => handleChange('category', e.target.value)} className="p-2 bg-slate-100 dark:bg-slate-700 rounded-md w-full" required>
                         <option value="" disabled>{t.selectCategory}</option>
                         {Object.keys(categories).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                     </select>
                </div>
                <div>
                     <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{t.subCategory}</label>
                     <select value={q.subCategory} onChange={e => handleChange('subCategory', e.target.value)} className="p-2 bg-slate-100 dark:bg-slate-700 rounded-md w-full" disabled={!q.category} required>
                         <option value="" disabled>{t.selectSubCategory}</option>
                         {(categories[q.category] || []).map(sub => <option key={sub} value={sub}>{sub}</option>)}
                     </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{t.questionType}</label>
                    <select value={q.type} onChange={e => handleTypeChange(e.target.value as QuestionType)} className="p-2 bg-slate-100 dark:bg-slate-700 rounded-md w-full">
                        {/* FIX: Use translations for question types. */}
                        {Object.values(QuestionType).map(type => (
                          <option key={type} value={type}>{t.questionTypes[type]}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{t.points}</label>
                    <input type="number" placeholder="Points" value={q.points} onChange={e => handleChange('points', parseInt(e.target.value))} className="p-2 bg-slate-100 dark:bg-slate-700 rounded-md w-full" required />
                </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <h3 className="font-semibold mb-3">{t.answerConfig}</h3>
                {q.type === QuestionType.MultipleChoice && (
                    <div className="space-y-2">
                        {q.options?.map((opt, oIndex) => (
                            <div key={oIndex} className="flex items-center gap-2">
                                <input type="radio" name={`correct-answer`} value={opt} checked={q.correctAnswer === opt} onChange={e => handleChange('correctAnswer', e.target.value)} />
                                <input type="text" placeholder={`Option ${oIndex + 1}`} value={opt} onChange={e => handleOptionChange(oIndex, e.target.value)} className="p-2 bg-white dark:bg-slate-600 rounded-md w-full" required/>
                                <button type="button" onClick={() => removeListItem(oIndex)} className="text-red-500 hover:text-red-600 disabled:opacity-50" disabled={q.options && q.options.length <= 2}><XCircleIcon className="w-5 h-5" /></button>
                            </div>
                        ))}
                        <button type="button" onClick={() => addListItem()} className="text-sm text-blue-500 hover:text-blue-600 font-semibold mt-2">{t.addOption}</button>
                    </div>
                )}
                {q.type === QuestionType.MultipleSelect && (
                    <div className="space-y-2">
                        {q.options?.map((opt, oIndex) => (
                            <div key={oIndex} className="flex items-center gap-2">
                                <input type="checkbox" name={`correct-answer`} value={opt} 
                                    checked={(q.correctAnswer as string[]).includes(opt)} 
                                    onChange={e => {
                                        const currentAnswers = (q.correctAnswer as string[] || []);
                                        const newAnswers = e.target.checked ? [...currentAnswers, opt] : currentAnswers.filter(a => a !== opt);
                                        handleChange('correctAnswer', newAnswers);
                                    }} />
                                <input type="text" placeholder={`Option ${oIndex + 1}`} value={opt} onChange={e => handleOptionChange(oIndex, e.target.value)} className="p-2 bg-white dark:bg-slate-600 rounded-md w-full" required/>
                                <button type="button" onClick={() => removeListItem(oIndex)} className="text-red-500 hover:text-red-600 disabled:opacity-50" disabled={q.options && q.options.length <= 2}>
                                    <XCircleIcon className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                        <button type="button" onClick={() => addListItem()} className="text-sm text-blue-500 hover:text-blue-600 font-semibold mt-2">{t.addOption}</button>
                    </div>
                )}
                 {q.type === QuestionType.TrueFalse && (
                    <div className="flex gap-4">
                        <label className="flex items-center"><input type="radio" name={`correct-answer`} value="True" checked={q.correctAnswer === 'True'} onChange={() => handleChange('correctAnswer', 'True')} className="mr-2" /> True</label>
                        <label className="flex items-center"><input type="radio" name={`correct-answer`} value="False" checked={q.correctAnswer === 'False'} onChange={() => handleChange('correctAnswer', 'False')} className="mr-2" /> False</label>
                    </div>
                )}
                 {q.type === QuestionType.TrueFalseWithJustification && (
                    <div>
                        <div className="flex gap-4 mb-2">
                            <label className="flex items-center"><input type="radio" name={`correct-answer`} value="True" checked={(q.correctAnswer as TrueFalseJustificationAnswer).selection === 'True'} onChange={() => handleChange('correctAnswer', { ...(q.correctAnswer as TrueFalseJustificationAnswer), selection: 'True' })} className="mr-2" /> True</label>
                            <label className="flex items-center"><input type="radio" name={`correct-answer`} value="False" checked={(q.correctAnswer as TrueFalseJustificationAnswer).selection === 'False'} onChange={() => handleChange('correctAnswer', { ...(q.correctAnswer as TrueFalseJustificationAnswer), selection: 'False' })} className="mr-2" /> False</label>
                        </div>
                        <textarea placeholder={t.modelJustification} value={(q.correctAnswer as TrueFalseJustificationAnswer).justification} onChange={e => handleChange('correctAnswer', { ...(q.correctAnswer as TrueFalseJustificationAnswer), justification: e.target.value })} className="p-2 bg-white dark:bg-slate-600 rounded-md w-full h-24" />
                    </div>
                )}
                {(q.type === QuestionType.Essay || q.type === QuestionType.ShortAnswer) && (
                    <textarea placeholder={t.modelAnswerHelp} value={q.correctAnswer as string} onChange={e => handleChange('correctAnswer', e.target.value)} className={`p-2 bg-white dark:bg-slate-600 rounded-md w-full ${q.type === QuestionType.ShortAnswer ? 'h-16' : 'h-24'}`} required />
                )}
                {q.type === QuestionType.Ordering && (
                    <div className="space-y-2">
                        <p className="text-sm text-slate-500 dark:text-slate-400">{t.orderingHelp}</p>
                         {q.options?.map((opt, oIndex) => (
                            <div key={oIndex} className="flex items-center gap-2">
                                <span className="text-slate-500">{oIndex+1}.</span>
                                <input type="text" placeholder={`${t.addItem} ${oIndex + 1}`} value={opt} onChange={e => handleOptionChange(oIndex, e.target.value)} className="p-2 bg-white dark:bg-slate-600 rounded-md w-full" required/>
                                <button type="button" onClick={() => removeListItem(oIndex)} className="text-red-500 hover:text-red-600 disabled:opacity-50" disabled={q.options && q.options.length <= 2}>
                                    <XCircleIcon className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                        <button type="button" onClick={() => addListItem()} className="text-sm text-blue-500 hover:text-blue-600 font-semibold mt-2">{t.addItem}</button>
                    </div>
                )}
                {q.type === QuestionType.Matching && (
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-semibold mb-2">{t.prompts}</h4>
                            {q.prompts?.map((prompt, pIndex) => (
                                <div key={pIndex} className="flex items-center gap-2 mb-2">
                                    <input type="text" placeholder={`${t.prompts} ${pIndex+1}`} value={prompt} onChange={e => handleOptionChange(pIndex, e.target.value, 'prompts')} className="p-2 bg-white dark:bg-slate-600 rounded-md w-full" required/>
                                    <button type="button" onClick={() => removeListItem(pIndex, 'prompts')} className="text-red-500 hover:text-red-600 disabled:opacity-50" disabled={q.prompts && q.prompts.length <= 1}><XCircleIcon className="w-5 h-5"/></button>
                                </div>
                            ))}
                             <button type="button" onClick={() => addListItem('prompts')} className="text-sm text-blue-500 hover:text-blue-600 font-semibold mt-2">{t.addPrompt}</button>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">{t.options}</h4>
                            {q.options?.map((opt, oIndex) => (
                                <div key={oIndex} className="flex items-center gap-2 mb-2">
                                    <input type="text" placeholder={`${t.options} ${oIndex+1}`} value={opt} onChange={e => handleOptionChange(oIndex, e.target.value, 'options')} className="p-2 bg-white dark:bg-slate-600 rounded-md w-full" required/>
                                    <button type="button" onClick={() => removeListItem(oIndex, 'options')} className="text-red-500 hover:text-red-600 disabled:opacity-50" disabled={q.options && q.options.length <= 1}><XCircleIcon className="w-5 h-5"/></button>
                                </div>
                            ))}
                             <button type="button" onClick={() => addListItem('options')} className="text-sm text-blue-500 hover:text-blue-600 font-semibold mt-2">{t.addOption}</button>
                        </div>
                        <div className="col-span-2">
                            <h4 className="font-semibold mb-2">{t.correctMatches}</h4>
                            {q.prompts?.map((prompt, pIndex) => (
                                <div key={pIndex} className="flex items-center gap-4 mb-2">
                                    <span className="w-1/3 truncate" title={prompt}>{prompt || `${t.prompts} ${pIndex+1}`}</span>
                                    <select value={(q.correctAnswer as string[])[pIndex] || ''} onChange={e => {
                                        const newAnswers = [...(q.correctAnswer as string[])];
                                        newAnswers[pIndex] = e.target.value;
                                        handleChange('correctAnswer', newAnswers);
                                    }} className="p-2 bg-white dark:bg-slate-600 rounded-md w-2/3">
                                        <option value="" disabled>{t.selectMatch}</option>
                                        {q.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
          
          <div className="flex justify-end gap-4 mt-6 pt-4 border-t border-slate-200 dark:border-slate-600">
            <button type="button" onClick={onClose} className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-500 text-slate-800 dark:text-slate-200 font-bold py-2 px-6 rounded-lg">{t.cancel}</button>
            <button type="submit" disabled={!isFormValid} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">{t.save}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuestionFormModal;
