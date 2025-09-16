import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import useNavLinks from '../hooks/useNavLinks';
import { Exam, ExamDifficulty } from '../types';
import { getAssessments, addAssessment, updateAssessment, deleteAssessment } from '../services/mockApi';
import { useNotification } from '../contexts/NotificationContext';
import { PlusCircleIcon, SparklesIcon, TrashIcon, PencilIcon, ClockIcon, BookOpenIcon } from '../components/icons';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import ExamFormModal from '../components/ExamFormModal';
import AIGenerateExamModal from '../components/AIGenerateExamModal';
import { useLanguage } from '../App';

const translations = {
    en: {
        pageTitle: "Assessments",
        aiGenerate: "AI Generate",
        createAssessment: "Create Assessment",
        searchPlaceholder: "Search assessments by title...",
        allDifficulties: "All Difficulties",
        allStatuses: "All Statuses",
        active: "Active",
        upcoming: "Upcoming",
        expired: "Expired",
        noAssessmentsFound: "No Assessments Found",
        noAssessmentsMessage: "No assessments match your current filters. Try adjusting your search.",
        noAssessmentsCreated: "No Assessments Created",
        noAssessmentsCreatedMessage: "Create your first assessment or use the AI generator to get started.",
        from: "From",
        until: "Until",
        edit: "Edit",
        delete: "Delete",
        deleteConfirm: "Are you sure you want to delete this assessment?",
        loadError: "Failed to load assessments.",
        updateSuccess: "Assessment updated successfully!",
        createSuccess: "Assessment created successfully!",
        saveError: "Failed to save assessment.",
        deleteSuccess: "Assessment deleted successfully.",
        deleteError: "Failed to delete assessment.",
    },
    ar: {
        pageTitle: "التقييمات",
        aiGenerate: "توليد بالذكاء الاصطناعي",
        createAssessment: "إنشاء تقييم",
        searchPlaceholder: "ابحث عن التقييمات بالعنوان...",
        allDifficulties: "كل الصعوبات",
        allStatuses: "كل الحالات",
        active: "نشط",
        upcoming: "قادم",
        expired: "منتهي الصلاحية",
        noAssessmentsFound: "لم يتم العثور على تقييمات",
        noAssessmentsMessage: "لا توجد تقييمات تطابق الفلاتر الحالية. حاول تعديل بحثك.",
        noAssessmentsCreated: "لم يتم إنشاء تقييمات",
        noAssessmentsCreatedMessage: "أنشئ تقييمك الأول أو استخدم المولد بالذكاء الاصطناعي للبدء.",
        from: "من",
        until: "حتى",
        edit: "تعديل",
        delete: "حذف",
        deleteConfirm: "هل أنت متأكد أنك تريد حذف هذا التقييم؟",
        loadError: "فشل تحميل التقييمات.",
        updateSuccess: "تم تحديث التقييم بنجاح!",
        createSuccess: "تم إنشاء التقييم بنجاح!",
        saveError: "فشل حفظ التقييم.",
        deleteSuccess: "تم حذف التقييم بنجاح.",
        deleteError: "فشل حذف التقييم.",
    }
};

const TeacherAssessmentsPage: React.FC = () => {
    const navLinks = useNavLinks();
    const { addNotification } = useNotification();
    const { lang } = useLanguage();
    const t = translations[lang];

    const [exams, setExams] = useState<Exam[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [difficultyFilter, setDifficultyFilter] = useState<'All' | ExamDifficulty>('All');
    const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Upcoming' | 'Expired'>('All');


    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const [examToEdit, setExamToEdit] = useState<Exam | null>(null);

    useEffect(() => {
        const loadExams = async () => {
            try {
                setLoading(true);
                const data = await getAssessments('teacher-1'); // Hardcoded ownerId for demo
                setExams(data);
            } catch (error) {
                addNotification(t.loadError, "error");
            } finally {
                setLoading(false);
            }
        };
        loadExams();
    }, [addNotification, t.loadError]);
    
    const handleOpenCreateModal = () => {
        setExamToEdit(null);
        setIsFormModalOpen(true);
    };

    const handleOpenEditModal = (exam: Exam) => {
        setExamToEdit(exam);
        setIsFormModalOpen(true);
    };
    
    const handleSaveExam = async (examData: Omit<Exam, 'id' | 'questionCount'> | Exam) => {
        try {
            if ('id' in examData) {
                const updatedExam = await updateAssessment(examData as Exam);
                setExams(prev => prev.map(e => e.id === updatedExam.id ? updatedExam : e));
                addNotification(t.updateSuccess, "success");
            } else {
                const newExam = await addAssessment({ ...examData, ownerId: 'teacher-1' });
                setExams(prev => [...prev, newExam]);
                addNotification(t.createSuccess, "success");
            }
            setIsFormModalOpen(false);
            setIsAiModalOpen(false);
        } catch (error) {
            addNotification(t.saveError, "error");
        }
    };
    
    const handleDeleteExam = async (examId: string) => {
        if (window.confirm(t.deleteConfirm)) {
            try {
                await deleteAssessment(examId);
                setExams(prev => prev.filter(e => e.id !== examId));
                addNotification(t.deleteSuccess, "success");
            } catch (error) {
                addNotification(t.deleteError, "error");
            }
        }
    };

    const getExamStatus = (exam: Exam): 'Active' | 'Upcoming' | 'Expired' => {
        const now = new Date();
        const from = exam.availableFrom ? new Date(exam.availableFrom) : null;
        const until = exam.availableUntil ? new Date(exam.availableUntil) : null;

        if (from && from > now) {
            return 'Upcoming';
        }
        if (until && until < now) {
            return 'Expired';
        }
        return 'Active';
    };


    const filteredExams = useMemo(() => {
        return exams.filter(exam => {
            const matchesSearch = exam.title.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesDifficulty = difficultyFilter === 'All' || exam.difficulty === difficultyFilter;
            const examStatus = getExamStatus(exam);
            const matchesStatus = statusFilter === 'All' || examStatus === statusFilter;
            
            return matchesSearch && matchesDifficulty && matchesStatus;
        });
    }, [exams, searchTerm, difficultyFilter, statusFilter]);
    
    const headerActions = (
        <div className="flex items-center gap-4">
             <button onClick={() => setIsAiModalOpen(true)} className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg flex items-center">
                <SparklesIcon className="w-5 h-5 mr-2" />
                {t.aiGenerate}
            </button>
            <button onClick={handleOpenCreateModal} className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded-lg flex items-center">
                <PlusCircleIcon className="w-5 h-5 mr-2" />
                {t.createAssessment}
            </button>
        </div>
    );

    return (
        <DashboardLayout navLinks={navLinks} pageTitle={t.pageTitle} headerActions={headerActions}>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <input
                        type="text"
                        placeholder={t.searchPlaceholder}
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg w-full md:flex-grow"
                    />
                    <div className="flex gap-4">
                        <select
                            value={difficultyFilter}
                            onChange={e => setDifficultyFilter(e.target.value as any)}
                            className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg w-full"
                        >
                            <option value="All">{t.allDifficulties}</option>
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                         <select
                            value={statusFilter}
                            onChange={e => setStatusFilter(e.target.value as any)}
                            className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg w-full"
                        >
                            <option value="All">{t.allStatuses}</option>
                            <option value="Active">{t.active}</option>
                            <option value="Upcoming">{t.upcoming}</option>
                            <option value="Expired">{t.expired}</option>
                        </select>
                    </div>
                </div>


                {loading ? <LoadingSpinner /> : (
                    <>
                        {exams.length > 0 && filteredExams.length === 0 ? (
                             <EmptyState icon={BookOpenIcon} title={t.noAssessmentsFound} message={t.noAssessmentsMessage} />
                        ) : exams.length === 0 ? (
                             <EmptyState icon={BookOpenIcon} title={t.noAssessmentsCreated} message={t.noAssessmentsCreatedMessage} action={headerActions} />
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredExams.map(exam => {
                                    const examStatus = getExamStatus(exam);
                                    const statusColors = {
                                        Active: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
                                        Upcoming: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
                                        Expired: 'bg-slate-200 text-slate-800 dark:bg-slate-600 dark:text-slate-300 opacity-80'
                                    };
                                    return (
                                        <div key={exam.id} className="bg-slate-50 dark:bg-slate-700/50 p-5 rounded-xl flex flex-col">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-bold text-lg pr-2">{exam.title}</h4>
                                                <span className={`font-semibold px-2 py-1 rounded-full text-xs flex-shrink-0 ${statusColors[examStatus]}`}>
                                                    {t[examStatus.toLowerCase() as keyof typeof t]}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 flex-grow">{exam.description}</p>
                                            
                                            {(exam.availableFrom || exam.availableUntil) && (
                                                <div className="mt-3 text-xs text-slate-500 dark:text-slate-400 space-y-1 bg-slate-100 dark:bg-slate-600/50 p-2 rounded-md">
                                                    {exam.availableFrom && (
                                                        <p><strong>{t.from}:</strong> {new Date(exam.availableFrom).toLocaleString()}</p>
                                                    )}
                                                    {exam.availableUntil && (
                                                        <p><strong>{t.until}:</strong> {new Date(exam.availableUntil).toLocaleString()}</p>
                                                    )}
                                                </div>
                                            )}

                                            <div className="flex items-center space-x-4 mt-3 text-sm text-slate-500 dark:text-slate-300">
                                                <span className="flex items-center"><ClockIcon className="w-4 h-4 mr-1"/> {exam.duration} min</span>
                                                <span className="flex items-center"><BookOpenIcon className="w-4 h-4 mr-1"/> {exam.questionCount} Qs</span>
                                                <span className={`font-semibold px-2 py-1 rounded-full text-xs ${exam.difficulty === 'Easy' ? 'bg-green-100 text-green-800' : exam.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                                    {exam.difficulty}
                                                </span>
                                            </div>
                                            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-600 flex justify-end gap-2">
                                                <button onClick={() => handleOpenEditModal(exam)} className="p-2 text-blue-500 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full" title={t.edit}><PencilIcon className="w-4 h-4"/></button>
                                                <button onClick={() => handleDeleteExam(exam.id)} className="p-2 text-red-500 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full" title={t.delete}><TrashIcon className="w-4 h-4"/></button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </>
                )}
            </div>

            <ExamFormModal
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                onSave={handleSaveExam}
                examToEdit={examToEdit}
            />
             <AIGenerateExamModal
                isOpen={isAiModalOpen}
                onClose={() => setIsAiModalOpen(false)}
                onSave={handleSaveExam}
            />
        </DashboardLayout>
    );
};

export default TeacherAssessmentsPage;
