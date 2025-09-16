import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import useNavLinks from '../../hooks/useNavLinks';
import { getQuestionBank } from '../../services/mockApi'; // Assuming a function to add/update/delete exists
import { Question } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import { PlusCircleIcon, PencilIcon, TrashIcon, BookOpenIcon } from '../../components/icons';
import EmptyState from '../../components/EmptyState';
import QuestionFormModal from '../../components/QuestionFormModal';
import { useNotification } from '../../contexts/NotificationContext';

interface QuestionBankPageProps {
    pageTitle: string;
    description: string;
    ownerId: string;
}

const QuestionBankPage: React.FC<QuestionBankPageProps> = ({ pageTitle, description, ownerId }) => {
    const navLinks = useNavLinks();
    const { addNotification } = useNotification();

    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [questionToEdit, setQuestionToEdit] = useState<Question | null>(null);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                setLoading(true);
                const data = await getQuestionBank({ ownerId });
                setQuestions(data);
            } catch (error) {
                addNotification("Failed to load questions.", "error");
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();
    }, [ownerId, addNotification]);

    const handleOpenCreateModal = () => {
        setQuestionToEdit(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (question: Question) => {
        setQuestionToEdit(question);
        setIsModalOpen(true);
    };
    
    const handleSaveQuestion = (questionData: Omit<Question, 'id'> | Question) => {
        // Mock save logic
        if ('id' in questionData) {
            setQuestions(prev => prev.map(q => q.id === questionData.id ? questionData as Question : q));
            addNotification("Question updated successfully!", "success");
        } else {
            const newQuestion: Question = { ...questionData, id: `q-${Date.now()}`, ownerId };
            setQuestions(prev => [...prev, newQuestion]);
            addNotification("Question created successfully!", "success");
        }
        setIsModalOpen(false);
    };
    
    const handleDeleteQuestion = (questionId: string) => {
        if (window.confirm("Are you sure you want to delete this question?")) {
            setQuestions(prev => prev.filter(q => q.id !== questionId));
            addNotification("Question deleted.", "success");
        }
    };

    const filteredQuestions = useMemo(() => {
        return questions.filter(q =>
            q.text.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [questions, searchTerm]);
    
    const headerActions = (
        <button onClick={handleOpenCreateModal} className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded-lg flex items-center">
            <PlusCircleIcon className="w-5 h-5 mr-2" />
            Add New Question
        </button>
    );

    return (
        <DashboardLayout navLinks={navLinks} pageTitle={pageTitle} headerActions={headerActions}>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
                <p className="text-slate-600 dark:text-slate-400 mb-4">{description}</p>
                <input
                    type="text"
                    placeholder="Search questions..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg w-full mb-4"
                />

                {loading ? <LoadingSpinner /> : (
                    <>
                        {filteredQuestions.length === 0 ? (
                            <EmptyState icon={BookOpenIcon} title="No Questions Found" message="Get started by adding a new question to your bank." action={headerActions} />
                        ) : (
                             <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                                    <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
                                        <tr>
                                            <th scope="col" className="px-6 py-3">Question Text</th>
                                            <th scope="col" className="px-6 py-3">Type</th>
                                            <th scope="col" className="px-6 py-3">Category</th>
                                            <th scope="col" className="px-6 py-3">Points</th>
                                            <th scope="col" className="px-6 py-3">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredQuestions.map(q => (
                                            <tr key={q.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700">
                                                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white truncate" style={{maxWidth: '400px'}}>{q.text}</td>
                                                <td className="px-6 py-4">{q.type}</td>
                                                <td className="px-6 py-4">{q.category} / {q.subCategory}</td>
                                                <td className="px-6 py-4">{q.points}</td>
                                                <td className="px-6 py-4 flex items-center gap-2">
                                                     <button onClick={() => handleOpenEditModal(q)} className="p-2 text-blue-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full" title="Edit"><PencilIcon className="w-4 h-4" /></button>
                                                     <button onClick={() => handleDeleteQuestion(q.id)} className="p-2 text-red-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full" title="Delete"><TrashIcon className="w-4 h-4" /></button>
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
             <QuestionFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveQuestion}
                question={questionToEdit}
            />
        </DashboardLayout>
    );
};

export default QuestionBankPage;
