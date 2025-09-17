import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '../components/DashboardLayout.tsx';
import useNavLinks from '../hooks/useNavLinks.ts';
import { Exam, ExamDifficulty } from '../types.ts';
import { getAssessments, addAssessment, updateAssessment, deleteAssessment } from '../services/mockApi.ts';
import { useNotification } from '../contexts/NotificationContext.tsx';
import { PlusCircleIcon, SparklesIcon, TrashIcon, PencilIcon, ClockIcon, BookOpenIcon } from '../components/icons.tsx';
import EmptyState from '../components/EmptyState.tsx';
import LoadingSpinner from '../components/LoadingSpinner.tsx';
import ExamFormModal from '../components/ExamFormModal.tsx';
import AIGenerateExamModal from '../components/AIGenerateExamModal.tsx';

const TeacherAssessmentsPage: React.FC = () => {
    const navLinks = useNavLinks();
    const { addNotification } = useNotification();

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
                addNotification("Failed to load assessments.", "error");
            } finally {
                setLoading(false);
            }
        };
        loadExams();
    }, [addNotification]);
    
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
                addNotification("Assessment updated successfully!", "success");
            } else {
                const newExam = await addAssessment({ ...examData, ownerId: 'teacher-1' });
                setExams(prev => [...prev, newExam]);
                addNotification("Assessment created successfully!", "success");
            }
            setIsFormModalOpen(false);
            setIsAiModalOpen(false);
        } catch (error) {
            addNotification("Failed to save assessment.", "error");
        }
    };
    
    const handleDeleteExam = async (examId: string) => {
        if (window.confirm("Are you sure you want to delete this assessment?")) {
            try {
                await deleteAssessment(examId);
                setExams(prev => prev.filter(e => e.id !== examId));
                addNotification("Assessment deleted successfully.", "success");
            } catch (error) {
                addNotification("Failed to delete assessment.", "error");
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
                AI Generate
            </button>
            <button onClick={handleOpenCreateModal} className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded-lg flex items-center">
                <PlusCircleIcon className="w-5 h-5 mr-2" />
                Create Assessment
            </button>
        </div>
    );

    return (
        <DashboardLayout navLinks={navLinks} pageTitle="Assessments" headerActions={headerActions}>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <input
                        type="text"
                        placeholder="Search assessments by title..."
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
                            <option value="All">All Difficulties</option>
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                         <select
                            value={statusFilter}
                            onChange={e => setStatusFilter(e.target.value as any)}
                            className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg w-full"
                        >
                            <option value="All">All Statuses</option>
                            <option value="Active">Active</option>
                            <option value="Upcoming">Upcoming</option>
                            <option value="Expired">Expired</option>
                        </select>
                    </div>
                </div>


                {loading ? <LoadingSpinner /> : (
                    <>
                        {exams.length > 0 && filteredExams.length === 0 ? (
                             <EmptyState icon={BookOpenIcon} title="No Assessments Found" message="No assessments match your current filters. Try adjusting your search." />
                        ) : exams.length === 0 ? (
                             <EmptyState icon={BookOpenIcon} title="No Assessments Created" message="Create your first assessment or use the AI generator to get started." action={headerActions} />
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
                                                    {examStatus}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 flex-grow">{exam.description}</p>
                                            
                                            {(exam.availableFrom || exam.availableUntil) && (
                                                <div className="mt-3 text-xs text-slate-500 dark:text-slate-400 space-y-1 bg-slate-100 dark:bg-slate-600/50 p-2 rounded-md">
                                                    {exam.availableFrom && (
                                                        <p><strong>From:</strong> {new Date(exam.availableFrom).toLocaleString()}</p>
                                                    )}
                                                    {exam.availableUntil && (
                                                        <p><strong>Until:</strong> {new Date(exam.availableUntil).toLocaleString()}</p>
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
                                                <button onClick={() => handleOpenEditModal(exam)} className="p-2 text-blue-500 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full" title="Edit"><PencilIcon className="w-4 h-4"/></button>
                                                <button onClick={() => handleDeleteExam(exam.id)} className="p-2 text-red-500 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full" title="Delete"><TrashIcon className="w-4 h-4"/></button>
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