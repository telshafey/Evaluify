import React, { useState, useEffect, useMemo } from 'react';
// FIX: Update import paths to remove .tsx extension and align with project structure.
import DashboardLayout from '../../components/DashboardLayout';
import useNavLinks from '../../hooks/useNavLinks';
import { Candidate, CandidateStatus, CvAnalysisResult } from '../../types';
import KanbanBoard from '../../components/kanban/KanbanBoard';
import { PlusCircleIcon, FunnelIcon } from '../../components/icons';
import { getCandidates, addCandidate, updateCandidateStatus } from '../../services/mockApi';
import { useNotification } from '../../contexts/NotificationContext';
import { useLanguage } from '../../contexts/AuthContext';
import KanbanSkeleton from '../../components/skeletons/KanbanSkeleton';
import CandidateFormModal from '../../components/candidates/CandidateFormModal';
import CvAnalyzerModal from '../../components/CvAnalyzerModal';
import CvAnalysisResultModal from '../../components/CvAnalysisResultModal';

const translations = {
    en: {
        addCandidate: "Add Candidate",
        loadError: "Could not load candidates.",
        updateSuccess: "Candidate status updated!",
        updateError: "Failed to update status.",
        addSuccess: "Candidate added successfully!",
        addError: "Failed to add candidate.",
        analyzeCv: "Analyze CV with AI",
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
        addCandidate: "إضافة مرشح",
        loadError: "تعذر تحميل المرشحين.",
        updateSuccess: "تم تحديث حالة المرشح!",
        updateError: "فشل تحديث الحالة.",
        addSuccess: "تمت إضافة المرشح بنجاح!",
        addError: "فشل في إضافة المرشح.",
        analyzeCv: "تحليل السيرة الذاتية",
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

interface CandidatesPageProps {
    pageTitle: string;
}

const CandidatesPage: React.FC<CandidatesPageProps> = ({ pageTitle }) => {
    const navLinks = useNavLinks();
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [loading, setLoading] = useState(true);
    const { addNotification } = useNotification();
    const { lang } = useLanguage();
    const t = translations[lang];

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isCvAnalyzerOpen, setIsCvAnalyzerOpen] = useState(false);
    const [isCvResultOpen, setIsCvResultOpen] = useState(false);
    const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
    const [analysisResult, setAnalysisResult] = useState<CvAnalysisResult | null>(null);

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
            c.id === candidateId ? { ...c, stage: newStatus, lastActivity: 'Just now' } : c
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

    const handleAddCandidate = async (candidateData: Omit<Candidate, 'id' | 'stage' | 'lastActivity' | 'matchScore'>) => {
        try {
            const newCandidate = await addCandidate(candidateData);
            setCandidates(prev => [newCandidate, ...prev]);
            addNotification(t.addSuccess, "success");
            setIsAddModalOpen(false);
        } catch(e) {
            addNotification(t.addError, "error");
        }
    };

    const openCvAnalyzer = (candidate: Candidate) => {
        setSelectedCandidate(candidate);
        setIsCvAnalyzerOpen(true);
    };

    const handleAnalysisComplete = (candidateId: string, result: CvAnalysisResult) => {
        setCandidates(prev => prev.map(c => c.id === candidateId ? { ...c, matchScore: result.matchScore } : c));
        setAnalysisResult(result);
        setIsCvResultOpen(true);
    };
    
    const headerActions = (
        <div className="flex items-center gap-2">
            <button className="bg-white dark:bg-slate-700 font-bold py-2 px-4 rounded-lg flex items-center border border-slate-300 dark:border-slate-600">
                <FunnelIcon className="w-5 h-5 me-2" />
                Filter
            </button>
             <button onClick={() => setIsAddModalOpen(true)} className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded-lg flex items-center">
                <PlusCircleIcon className="w-5 h-5 me-2" />
                {t.addCandidate}
            </button>
        </div>
    );

    const translatedStages = useMemo(() => {
        return Object.values(CandidateStatus).map(status => ({
            key: status,
            title: t.stages[status as CandidateStatus]
        }));
    }, [t.stages]);

    return (
        <>
            <DashboardLayout navLinks={navLinks} pageTitle={pageTitle} headerActions={headerActions}>
                {loading ? (
                    <KanbanSkeleton />
                ) : (
                    <KanbanBoard 
                        candidates={candidates} 
                        stages={translatedStages}
                        onStatusChange={handleStatusChange}
                        onAnalyzeCv={openCvAnalyzer}
                    />
                )}
            </DashboardLayout>
            <CandidateFormModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSave={handleAddCandidate}
            />
            <CvAnalyzerModal
                isOpen={isCvAnalyzerOpen}
                onClose={() => setIsCvAnalyzerOpen(false)}
                candidate={selectedCandidate}
                onAnalysisComplete={handleAnalysisComplete}
            />
             <CvAnalysisResultModal
                isOpen={isCvResultOpen}
                onClose={() => setIsCvResultOpen(false)}
                result={analysisResult}
            />
        </>
    );
};

export default CandidatesPage;