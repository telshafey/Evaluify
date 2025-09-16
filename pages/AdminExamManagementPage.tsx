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

const AdminExamManagementPage: React.FC = () => {
    const navLinks = useNavLinks();
    const { addNotification } = useNotification();
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
                addNotification("Failed to load exams.", "error");
            } finally {
                setLoading(false);
            }
        };
        loadExams();
    }, [addNotification]);
    
    const handleOpenEditModal = (exam: Exam) => {
        setExamToEdit(exam);
        setIsModalOpen(true);
    };

    const handleSaveExam = async (examData: Omit<Exam, 'id' | 'questionCount'> | Exam) => {
        if (!('id' in examData)) return; // Admins only edit
        try {
            const updatedExam = await updateAssessment(examData as Exam);
            setExams(prev => prev.map(e => e.id === updatedExam.id ? updatedExam : e));
            addNotification("Assessment updated successfully!", "success");
            setIsModalOpen(false);
        } catch (error) {
            addNotification("Failed to update assessment.", "error");
        }
    };
    
    const handleDeleteExam = async (examId: string) => {
        if (window.confirm("Are you sure you want to delete this assessment? This action cannot be undone.")) {
            try {
                await deleteAssessment(examId);
                setExams(prev => prev.filter(e => e.id !== examId));
                addNotification("Assessment deleted successfully.", "success");
            } catch (error) {
                addNotification("Failed to delete assessment.", "error");
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
        <DashboardLayout navLinks={navLinks} pageTitle="Exam Management">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                    As an admin, you can view, edit, or delete any exam on the platform.
                </p>
                <input
                    type="text"
                    placeholder="Search by title or owner..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg w-full mb-4"
                />
                
                {loading ? <LoadingSpinner /> : (
                    <>
                        {filteredExams.length === 0 ? (
                            <EmptyState icon={DocumentTextIcon} title="No Exams Found" message="There are no exams matching your search criteria." />
                        ) : (
                             <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                                    <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
                                        <tr>
                                            <th scope="col" className="px-6 py-3">Exam Title</th>
                                            <th scope="col" className="px-6 py-3">Owner</th>
                                            <th scope="col" className="px-6 py-3">Difficulty</th>
                                            <th scope="col" className="px-6 py-3">Questions</th>
                                            <th scope="col" className="px-6 py-3">Actions</th>
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
                                                    <button onClick={() => handleOpenEditModal(exam)} className="p-2 text-blue-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full" title="Edit"><PencilIcon className="w-4 h-4" /></button>
                                                    <button onClick={() => handleDeleteExam(exam.id)} className="p-2 text-red-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full" title="Delete"><TrashIcon className="w-4 h-4" /></button>
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