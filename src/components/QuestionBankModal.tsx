import React, { useState, useEffect, useCallback } from 'react';
// Fix: Added imports for types and mockApi
import { getQuestionBank } from '../services/mockApi';
import { Question, QuestionStatus, QuestionType } from '../types';
import { useLanguage } from '../App';

interface QuestionBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddQuestions: (questions: Question[]) => void;
}

const translations = {
    en: {
        title: "Add Questions from Bank",
        searchPlaceholder: "Search questions...",
        allTypes: "All Types",
        allStatuses: "All Statuses",
        loading: "Loading...",
        noQuestions: "No questions found.",
        cancel: "Cancel",
        add: "Add",
        questions: "Questions",
        questionTypes: {
            [QuestionType.MultipleChoice]: 'Multiple Choice',
            [QuestionType.MultipleSelect]: 'Multiple Select',
            [QuestionType.TrueFalse]: 'True/False',
            [QuestionType.TrueFalseWithJustification]: 'True/False + Justification',
            [QuestionType.ShortAnswer]: 'Short Answer',
            [QuestionType.Essay]: 'Essay',
            [QuestionType.Ordering]: 'Ordering',
            [QuestionType.Matching]: 'Matching',
        },
        questionStatuses: {
            [QuestionStatus.Draft]: 'Draft',
            [QuestionStatus.Pending]: 'Pending',
            [QuestionStatus.Approved]: 'Approved',
            [QuestionStatus.Rejected]: 'Rejected',
        }
    },
    ar: {
        title: "إضافة أسئلة من البنك",
        searchPlaceholder: "ابحث عن أسئلة...",
        allTypes: "كل الأنواع",
        allStatuses: "كل الحالات",
        loading: "جاري التحميل...",
        noQuestions: "لم يتم العثور على أسئلة.",
        cancel: "إلغاء",
        add: "إضافة",
        questions: "أسئلة",
        questionTypes: {
            [QuestionType.MultipleChoice]: 'اختيار من متعدد',
            [QuestionType.MultipleSelect]: 'تحديد متعدد',
            [QuestionType.TrueFalse]: 'صح / خطأ',
            [QuestionType.TrueFalseWithJustification]: 'صح / خطأ مع تبرير',
            [QuestionType.ShortAnswer]: 'إجابة قصيرة',
            [QuestionType.Essay]: 'مقالي',
            [QuestionType.Ordering]: 'ترتيب',
            [QuestionType.Matching]: 'مطابقة',
        },
        questionStatuses: {
            [QuestionStatus.Draft]: 'مسودة',
            [QuestionStatus.Pending]: 'قيد المراجعة',
            [QuestionStatus.Approved]: 'معتمد',
            [QuestionStatus.Rejected]: 'مرفوض',
        }
    }
}

const QuestionBankModal: React.FC<QuestionBankModalProps> = ({ isOpen, onClose, onAddQuestions }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<QuestionType | ''>('');
  const [filterStatus, setFilterStatus] = useState<QuestionStatus | ''>(QuestionStatus.Approved);
  const { lang } = useLanguage();
  const t = translations[lang];
  
  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getQuestionBank({
        ownerId: 'marketplace',
        status: filterStatus || undefined,
        searchTerm: searchTerm,
        questionType: filterType || undefined
      });
      setQuestions(data);
    } catch (error) {
      console.error("Failed to fetch question bank:", error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filterType, filterStatus]);

  useEffect(() => {
    if (isOpen) {
      fetchQuestions();
    }
  }, [isOpen, fetchQuestions]);

  const handleSelectQuestion = (questionId: string) => {
    const newSelection = new Set(selectedQuestionIds);
    if (newSelection.has(questionId)) {
      newSelection.delete(questionId);
    } else {
      newSelection.add(questionId);
    }
    setSelectedQuestionIds(newSelection);
  };
  
  const handleAddSelected = () => {
    const selectedQuestions = questions.filter(q => selectedQuestionIds.has(q.id));
    onAddQuestions(selectedQuestions);
    setSelectedQuestionIds(new Set()); // Reset selection
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-[60] flex justify-center items-center" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-labelledby="q-bank-modal-title" className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl p-8 w-full max-w-3xl max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <h2 id="q-bank-modal-title" className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-100">{t.title}</h2>
        
        <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="p-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md w-full focus:ring-2 focus:ring-blue-500 md:col-span-3"
            />
            <select
                value={filterType}
                onChange={e => setFilterType(e.target.value as QuestionType | '')}
                className="p-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-blue-500"
            >
                <option value="">{t.allTypes}</option>
                {Object.entries(t.questionTypes).map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
                ))}
            </select>
             <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value as QuestionStatus | '')}
                className="p-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-blue-500"
            >
                <option value="">{t.allStatuses}</option>
                {Object.entries(t.questionStatuses).map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
                ))}
            </select>
        </div>

        <div className="flex-grow overflow-y-auto space-y-3 pr-2">
            {loading && <p>{t.loading}</p>}
            {!loading && questions.map(q => (
                <div key={q.id} className="flex items-center p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <input 
                        type="checkbox"
                        checked={selectedQuestionIds.has(q.id)}
                        onChange={() => handleSelectQuestion(q.id)}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                        aria-labelledby={`q-bank-item-${q.id}`}
                    />
                    <div className="ms-4">
                        <p id={`q-bank-item-${q.id}`} className="font-semibold text-slate-800 dark:text-slate-200">{q.text}</p>
                        <span className="text-xs text-slate-500 dark:text-slate-400">{q.type} - {q.points} pts</span>
                    </div>
                </div>
            ))}
            {!loading && questions.length === 0 && <p className="text-center text-slate-500">{t.noQuestions}</p>}
        </div>

        <div className="flex justify-end gap-4 mt-6 pt-4 border-t border-slate-200 dark:border-slate-600">
            <button onClick={onClose} className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover-bg-slate-500 text-slate-800 dark:text-slate-200 font-bold py-2 px-6 rounded-lg">{t.cancel}</button>
            <button onClick={handleAddSelected} disabled={selectedQuestionIds.size === 0} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg disabled:opacity-50">
                {t.add} {selectedQuestionIds.size > 0 ? `(${selectedQuestionIds.size})` : ''} {selectedQuestionIds.size > 0 ? t.questions : ''}
            </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionBankModal;