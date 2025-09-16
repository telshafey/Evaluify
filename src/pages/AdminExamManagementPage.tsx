import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import useNavLinks from '../hooks/useNavLinks';
import { Exam } from '../types';
import { getAllExams, updateAssessment, deleteAssessment } from '../services/mockApi';
import { useNotification } from '../contexts/NotificationContext';
import { TrashIcon, PencilIcon, DocumentTextIcon } from '../components/icons';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import ExamFormModal from '../components/ExamFormModal';
import { useLanguage } from '../App';

const translations = {
    en: {
        pageTitle: "Exam Management",
        description: "As an admin, you can view, edit, or delete any exam on the platform.",
        searchPlaceholder: "Search by title or owner...",
        tableTitle: "Exam Title",
        tableOwner: "Owner",
        tableDifficulty: "Difficulty",
        tableQuestions: "Questions",
        tableActions: "Actions",
        edit: "Edit",
        delete: "Delete",
        deleteConfirm: "Are you sure you want to delete this assessment? This action cannot be undone.",
        noExamsFound: "No Exams Found",
        noExamsMessage: "There are no exams matching your search criteria.",
        loadError: "Failed to load exams.",
        updateSuccess: "Assessment updated successfully!",
        updateError: "Failed to update assessment.",
        deleteSuccess: "Assessment deleted successfully.",
        deleteError: "Failed to delete assessment.",
    },
    ar: {
        pageTitle: "إدارة الاختبارات",
        description: "بصفتك مسؤولاً، يمكنك عرض أو تعديل أو حذف أي اختبار على المنصة.",
        searchPlaceholder: "ابحث بالعنوان أو المالك...",
        tableTitle: "عنوان الاختبار",
        tableOwner: "المالك",
        tableDifficulty: "الصعوبة",
        tableQuestions: "الأسئلة",
        tableActions: "الإجراءات",
        edit: "تعديل",
        delete: "حذف",
        deleteConfirm: "هل أنت متأكد أنك تريد حذف هذا التقييم؟ لا يمكن التراجع عن هذا الإجراء.",
        noExamsFound: "لم يتم العثور على اختبارات",
        noExamsMessage: "لا توجد اختبارات تطابق معايير البحث الحالية.",
        loadError: "فشل تحميل الاختبارات.",
        updateSuccess: "تم تحديث التقييم بنجاح!",
        updateError: "فشل تحديث التقييم.",
        deleteSuccess: "تم حذف التقييم بنجاح.",
        deleteError: "فشل حذف التقييم.",
    }
};

const AdminExamManagementPage: React.FC = () => {
    const navLinks = useNavLinks();
    const { addNotification } = useNotification();
    const { lang } = useLanguage();
    const t = translations[lang];

    const [exams, setExams] = useState<Exam[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [examToEdit, setExamToEdit] = useState<Exam | null>(null);

    useEffect(() => {
        const loadExams = async () => {
            try {
                setLoading(true);
                const data = await getAllExams();
                setExams(data);
            } catch (error) {
                addNotification(t.loadError, "error");
            } finally {
                setLoading(false);
            }
        };
        loadExams();
    }, [addNotification, t.loadError]);
    
    const handleOpenEditModal = (exam: Exam) => {
        setExamToEdit(exam);
        setIsModalOpen(true);
    };

    const handleSaveExam = async (examData: Omit<Exam, 'id' | 'questionCount'> | Exam) => {
        if (!('id' in examData)) return; // Admins only edit
        try {
            const updatedExam = await updateAssessment(examData as Exam);
            setExams(prev => prev.map(e => e.id === updatedExam.id ? updatedExam : e));
            addNotification(t.updateSuccess, "success");
            setIsModalOpen(false);
        } catch (error) {
            addNotification(t.updateError, "error");
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
    
    const filteredExams = useMemo(() => {
        return exams.filter(e =>
            e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            e.ownerName?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [exams, searchTerm]);

    return (
        <DashboardLayout navLinks={navLinks} pageTitle={t.pageTitle}>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
                <p className="text-slate-600 dark:text-slate-400 mb-4">{t.description}</p>
                <input
                    type="text"
                    placeholder={t.searchPlaceholder}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg w-full mb-4"
                />
                
                {loading ? <LoadingSpinner /> : (
                    <>
                        {filteredExams.length === 0 ? (
                            <EmptyState icon={DocumentTextIcon} title={t.noExamsFound} message={t.noExamsMessage} />
                        ) : (
                             <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                                    <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
                                        <tr>
                                            <th scope="col" className="px-6 py-3">{t.tableTitle}</th>
                                            <th scope="col" className="px-6 py-3">{t.tableOwner}</th>
                                            <th scope="col" className="px-6 py-3">{t.tableDifficulty}</th>
                                            <th scope="col" className="px-6 py-3">{t.tableQuestions}</th>
                                            <th scope="col" className="px-6 py-3">{t.tableActions}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredExams.map(exam => (
                                            <tr key={exam.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700">
                                                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{exam.title}</td>
                                                <td className="px-6 py-4">{exam.ownerName}</td>
                                                <td className="px-6 py-4">{exam.difficulty}</td>
                                                <td className="px-6 py-4">{exam.questionCount}</td>
                                                <td className="px-6 py-4 flex items-center gap-2">
                                                    <button onClick={() => handleOpenEditModal(exam)} className="p-2 text-blue-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full" title={t.edit}><PencilIcon className="w-4 h-4" /></button>
                                                    <button onClick={() => handleDeleteExam(exam.id)} className="p-2 text-red-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full" title={t.delete}><TrashIcon className="w-4 h-4" /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}
            </div>
            <ExamFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveExam}
                examToEdit={examToEdit}
            />
        </DashboardLayout>
    );
};

export default AdminExamManagementPage;
