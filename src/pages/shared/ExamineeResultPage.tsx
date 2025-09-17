import React, { useState, useEffect } from 'react';
import { useParams, Link } from "react-router-dom";
import DashboardLayout from '../../components/DashboardLayout';
import useNavLinks from '../../hooks/useNavLinks';
import { getExamResultDetails } from '../../services/mockApi';
import { ExamResult, Exam, QuestionType, Answer, TrueFalseJustificationAnswer } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import { ShieldCheckIcon, CheckCircleIcon, XCircleIcon, DownloadIcon } from '../../components/icons';
import { useTheme } from '../../App';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';


const formatAnswerForPdf = (answer: Answer, type: QuestionType): string => {
    if (answer === null || answer === undefined) return "Not Answered";
    if (Array.isArray(answer)) return answer.join(', ');
    if (type === QuestionType.TrueFalseWithJustification) {
        const tfAnswer = answer as TrueFalseJustificationAnswer;
        return `Selection: ${tfAnswer.selection}\nJustification: ${tfAnswer.justification}`;
    }
    return String(answer);
};

export const generateResultPdf = (result: ExamResult, exam: Exam, platformName: string) => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.text(`Result for: ${exam.title}`, 14, 22);
    doc.setFontSize(12);
    doc.text(`Examinee: ${result.userName}`, 14, 30);
    doc.text(`Date: ${result.submittedAt.toLocaleString()}`, 14, 36);

    // Summary table
    (doc as any).autoTable({
        startY: 45,
        head: [['Metric', 'Value']],
        body: [
            ['Score', `${result.score} / ${result.totalPoints}`],
            ['Percentage', `${Math.round((result.score / result.totalPoints) * 100)}%`],
            ['Proctoring Flags', `${result.proctoringEvents?.length ?? 0}`],
        ],
        theme: 'striped',
    });

    // Question Breakdown
    const tableBody = exam.questions.map((q, index) => {
        const userAnswer = result.answers[q.id] ?? null;
        const isCorrectCheck = JSON.stringify(userAnswer) === JSON.stringify(q.correctAnswer);
        
        return [
            index + 1,
            q.text,
            formatAnswerForPdf(userAnswer, q.type),
            formatAnswerForPdf(q.correctAnswer, q.type),
            { content: isCorrectCheck ? 'Correct' : 'Incorrect', styles: { textColor: isCorrectCheck ? [0, 128, 0] : [255, 0, 0] } }
        ];
    });

    (doc as any).autoTable({
        startY: (doc as any).lastAutoTable.finalY + 15,
        head: [['#', 'Question', 'Their Answer', 'Correct Answer', 'Result']],
        body: tableBody,
        headStyles: { fillColor: [13, 148, 136] }, // primary-600
        columnStyles: {
            0: { cellWidth: 10 },
            1: { cellWidth: 70 },
            2: { cellWidth: 35 },
            3: { cellWidth: 35 },
            4: { cellWidth: 20 },
        }
    });

    // Footer
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.text(`Page ${i} of ${pageCount} | ${platformName}`, 14, doc.internal.pageSize.height - 10);
    }
    
    doc.save(`result_${result.userName.replace(/\s/g, '_')}_${exam.title.replace(/\s/g, '_')}.pdf`);
};


const isCorrect = (userAnswer: Answer, correctAnswer: Answer): boolean => {
    return JSON.stringify(userAnswer) === JSON.stringify(correctAnswer);
};

const AnswerDisplay: React.FC<{ answer: Answer }> = ({ answer }) => {
    if (answer === null || answer === undefined) {
        return <p className="text-slate-500 italic">Not Answered</p>;
    }
    if (Array.isArray(answer)) {
        return <ul className="list-disc list-inside">{(answer as string[]).map((item, i) => <li key={i}>{item}</li>)}</ul>;
    }
     if (typeof answer === 'object' && 'selection' in answer) {
        const tfAnswer = answer as TrueFalseJustificationAnswer;
        return (
            <div>
                <p><strong>{tfAnswer.selection}</strong></p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 italic">Justification: {tfAnswer.justification}</p>
            </div>
        );
    }
    return <p>{String(answer)}</p>;
};

const ExamineeResultPage: React.FC = () => {
    const { resultId } = useParams<{ resultId: string }>();
    const navLinks = useNavLinks();
    const { theme } = useTheme();
    const [result, setResult] = useState<ExamResult | null>(null);
    const [exam, setExam] = useState<Exam | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            if (!resultId) return;
            try {
                const data = await getExamResultDetails(resultId);
                setResult(data?.result || null);
                setExam(data?.exam || null);
            } catch (error) {
                console.error("Failed to fetch result details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [resultId]);

    if (loading) {
        return <DashboardLayout navLinks={navLinks} pageTitle="Loading Result..."><div className="flex justify-center items-center h-full"><LoadingSpinner /></div></DashboardLayout>;
    }

    if (!result || !exam) {
        return <DashboardLayout navLinks={navLinks} pageTitle="Error"><p className="text-center">Result not found.</p></DashboardLayout>;
    }

    const percentage = Math.round((result.score / result.totalPoints) * 100);

    return (
        <DashboardLayout navLinks={navLinks} pageTitle={`Result: ${result.userName}`}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
                        <h3 className="text-xl font-bold mb-4">Question Breakdown</h3>
                        <div className="space-y-4">
                            {exam.questions.map((q, index) => {
                                const userAnswer = result.answers[q.id] ?? null;
                                const correct = isCorrect(userAnswer, q.correctAnswer);
                                return (
                                    <div key={q.id} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                                        <div className="flex justify-between items-start">
                                            <p className="font-semibold text-slate-800 dark:text-slate-100">{index + 1}. {q.text}</p>
                                            {correct ? <CheckCircleIcon className="w-6 h-6 text-green-500" /> : <XCircleIcon className="w-6 h-6 text-red-500" />}
                                        </div>
                                        <div className="mt-2 text-sm">
                                            <p className="text-slate-500"><strong>Their Answer:</strong></p>
                                            <div className={`p-2 rounded mt-1 ${correct ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                                                <AnswerDisplay answer={userAnswer}/>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg text-center">
                        <h3 className="text-xl font-bold mb-4">Overall Score</h3>
                        <p className="text-6xl font-extrabold text-primary-500">{percentage}%</p>
                        <p className="text-lg font-semibold">{result.score} / {result.totalPoints}</p>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
                        <h3 className="text-xl font-bold mb-4 flex items-center"><ShieldCheckIcon className="w-6 h-6 mr-2" /> Proctoring Summary</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between"><span>Tab Switches:</span><span className="font-bold">{result.proctoringEvents?.filter(e=>e.type === 'tab_switch').length ?? 0}</span></div>
                            <div className="flex justify-between"><span>Paste Events:</span><span className="font-bold">{result.proctoringEvents?.filter(e=>e.type === 'paste_content').length ?? 0}</span></div>
                            <div className="flex justify-between"><span>Face Anomalies:</span><span className="font-bold">{result.proctoringEvents?.filter(e=>e.type === 'face_detection').length ?? 0}</span></div>
                        </div>
                        <Link to={`/results/${resultId}/proctoring`} className="mt-4 block text-center bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded-lg w-full">
                            View Full Report
                        </Link>
                    </div>
                     <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
                        <button
                           onClick={() => generateResultPdf(result, exam, theme.platformName)}
                           className="bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center w-full"
                         >
                            <DownloadIcon className="w-5 h-5 mr-2" />
                            Download Full PDF Report
                         </button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ExamineeResultPage;