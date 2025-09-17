import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import useNavLinks from '../hooks/useNavLinks';
import { Candidate, CandidateStatus } from '../types';
import KanbanBoard from '../components/kanban/KanbanBoard';
import { PlusCircleIcon } from '../components/icons';
import { getCandidates, updateCandidateStatus } from '../services/mockApi';
import { useNotification } from '../contexts/NotificationContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { useLanguage } from '../App';

const translations = {
    en: {
        pageTitle: "Candidates",
        addCandidate: "Add Candidate",
        loadError: "Could not load candidates.",
        updateSuccess: "Candidate status updated successfully!",
        updateError: "Failed to update status. Reverting change.",
        stages: {
            [CandidateStatus.Applied]: 'Applied',
            [CandidateStatus.Screening]: 'Screening',
            [CandidateStatus.Assessment]: 'Assessment',
            [CandidateStatus.Interview]: 'Interview',
            [CandidateStatus.Offer]: 'Offer',
            [CandidateStatus.Hired]: 'Hired',
        }
    },
    ar: {
        pageTitle: "المرشحون",
        addCandidate: "إضافة مرشح",
        loadError: "تعذر تحميل المرشحين.",
        updateSuccess: "تم تحديث حالة المرشح بنجاح!",
        updateError: "فشل تحديث الحالة. يتم التراجع عن التغيير.",
        stages: {
            [CandidateStatus.Applied]: 'المتقدمون',
            [CandidateStatus.Screening]: 'الفرز',
            [CandidateStatus.Assessment]: 'التقييم',
            [CandidateStatus.Interview]: 'المقابلة',
            [CandidateStatus.Offer]: 'العرض',
            [CandidateStatus.Hired]: 'تم التوظيف',
        }
    }
};

const TeacherCandidatesPage: React.FC = () => {
    const navLinks = useNavLinks();
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [loading, setLoading] = useState(true);
    const { addNotification } = useNotification();
    const { lang } = useLanguage();
    const t = translations[lang];

    useEffect(() => {
        const loadCandidates = async () => {
            try {
                setLoading(true);
                const data = await getCandidates();
                setCandidates(data);
            } catch (error) {
                console.error("Failed to load candidates:", error);
                addNotification(t.loadError, "error");
            } finally {
                setLoading(false);
            }
        };
        loadCandidates();
    }, [addNotification, t.loadError]);
    
    const handleStatusChange = async (candidateId: string, newStatus: CandidateStatus) => {
        const originalCandidates = [...candidates];
        
        setCandidates(prev => prev.map(c => 
            c.id === candidateId ? { ...c, stage: newStatus } : c
        ));

        try {
            await updateCandidateStatus(candidateId, newStatus);
            addNotification(t.updateSuccess, "success");
        } catch (error) {
            console.error("Failed to update candidate status:", error);
            addNotification(t.updateError, "error");
            setCandidates(originalCandidates);
        }
    };
    
    const headerActions = (
        <button className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded-lg flex items-center">
            <PlusCircleIcon className="w-5 h-5 me-2" />
            {t.addCandidate}
        </button>
    );

    const translatedStages = useMemo(() => {
        return Object.values(CandidateStatus).map(status => ({
            key: status,
            title: t.stages[status as CandidateStatus]
        }));
    }, [t.stages]);

    return (
        <DashboardLayout navLinks={navLinks} pageTitle={t.pageTitle} headerActions={headerActions}>
            {loading ? (
                <div className="flex justify-center items-center h-full"><LoadingSpinner /></div>
            ) : (
                <KanbanBoard 
                    candidates={candidates} 
                    stages={translatedStages}
                    onStatusChange={handleStatusChange} 
                />
            )}
        </DashboardLayout>
    );
};

export default TeacherCandidatesPage;