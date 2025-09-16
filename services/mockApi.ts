import {
  User, UserRole, Exam, Question, QuestionType, ExamResult, DashboardStats, RecentAssessment,
  PerformanceData, AIInsight, ProctoringEvent, StudentAnswer, PlatformSettings, ExamDifficulty,
  Candidate, CandidateStatus, QuestionStatus, Answer, Interview, AnalyticsData
} from '../types';
// Fix: Corrected import for @google/genai to use GoogleGenAI as per guidelines.
import { GoogleGenAI } from "@google/genai";

// --- MOCK DATA ---

const MOCK_USERS: User[] = [
  { id: 'user-1', name: 'Admin User', email: 'admin@evaluify.com', role: UserRole.Admin, registeredAt: '2023-01-15T09:00:00Z' },
  { id: 'user-2', name: 'Teacher User', email: 'teacher@evaluify.com', role: UserRole.Teacher, registeredAt: '2023-02-20T14:30:00Z' },
  { id: 'user-3', name: 'Corporate User', email: 'corp@evaluify.com', role: UserRole.Corporate, registeredAt: '2023-03-10T11:00:00Z' },
  { id: 'user-4', name: 'Training Co User', email: 'training@evaluify.com', role: UserRole.TrainingCompany, registeredAt: '2023-04-05T16:45:00Z' },
  { id: 'user-5', name: 'Examinee User', email: 'student@evaluify.com', role: UserRole.Examinee, registeredAt: '2023-05-01T08:00:00Z' },
  { id: 'user-6', name: 'John Doe', email: 'john.d@example.com', role: UserRole.Examinee, registeredAt: '2023-05-02T10:20:00Z' },
  { id: 'user-7', name: 'Jane Smith', email: 'jane.s@example.com', role: UserRole.Teacher, registeredAt: '2023-05-03T11:30:00Z' },
];

const MOCK_QUESTIONS: Question[] = [
    { id: 'q1', ownerId: 'teacher-1', text: 'What is the capital of France?', type: QuestionType.MultipleChoice, options: ['Berlin', 'Madrid', 'Paris', 'Rome'], correctAnswer: 'Paris', points: 5, tags: ['geography'], category: 'Geography', subCategory: 'Europe' },
    { id: 'q2', ownerId: 'teacher-1', text: 'Select all prime numbers.', type: QuestionType.MultipleSelect, options: ['2', '4', '7', '9', '11'], correctAnswer: ['2', '7', '11'], points: 10, tags: ['math'], category: 'Mathematics', subCategory: 'Number Theory' },
    { id: 'q3', ownerId: 'corp-1', text: 'Explain the concept of closures in JavaScript.', type: QuestionType.Essay, correctAnswer: 'A closure is the combination of a function bundled together (enclosed) with references to its surrounding state (the lexical environment).', points: 15, tags: ['javascript', 'programming'], category: 'Programming', subCategory: 'JavaScript' },
    { id: 'q4', ownerId: 'marketplace', text: 'The sun revolves around the Earth.', type: QuestionType.TrueFalse, options:['True','False'], correctAnswer: 'False', points: 5, tags: ['science'], category: 'Science', subCategory: 'Astronomy', status: QuestionStatus.Approved },
    { id: 'q5', ownerId: 'marketplace', text: 'What does CSS stand for?', type: QuestionType.ShortAnswer, correctAnswer: 'Cascading Style Sheets', points: 5, tags: ['webdev'], category: 'Programming', subCategory: 'Web Development', status: QuestionStatus.Approved },
    { id: 'q6', ownerId: 'teacher-1', text: 'This is a draft question.', type: QuestionType.MultipleChoice, options: ['A', 'B'], correctAnswer: 'A', points: 5, tags: ['draft'], category: 'Geography', subCategory: 'Europe', status: QuestionStatus.Draft },
];

let MOCK_EXAMS: Exam[] = [
  { id: 'exam-1', ownerId: 'teacher-1', title: 'React Fundamentals Quiz', description: 'A quiz covering the basics of React, including components, state, and props.', duration: 30, difficulty: 'Medium', questionCount: 2, questions: [MOCK_QUESTIONS[0], MOCK_QUESTIONS[1]], ownerName: 'Teacher User' },
  { id: 'exam-2', ownerId: 'corp-1', title: 'JavaScript Advanced Concepts', description: 'Assessment for senior JavaScript developers.', duration: 60, difficulty: 'Hard', questionCount: 1, questions: [MOCK_QUESTIONS[2]], ownerName: 'Corporate User' },
  { id: 'exam-3', ownerId: 'teacher-1', title: 'World Geography', description: 'Test your knowledge of world capitals.', duration: 15, difficulty: 'Easy', questionCount: 1, questions: [MOCK_QUESTIONS[0]], ownerName: 'Teacher User' },
  { id: 'exam-4', ownerId: 'teacher-1', title: 'Upcoming Final Exam', description: 'This exam is scheduled for a future date.', duration: 90, difficulty: 'Hard', questionCount: 50, questions: [], ownerName: 'Teacher User', availableFrom: new Date(Date.now() + 86400000 * 3).toISOString() },
];

const MOCK_RESULTS: ExamResult[] = [
  { id: 'result-1', examId: 'exam-1', examTitle: 'React Fundamentals Quiz', userId: 'user-5', userName: 'Examinee User', submittedAt: new Date(), score: 10, totalPoints: 15, answers: { 'q1': 'Paris', 'q2': ['2', '7'] }, proctoringEvents: [{type: 'tab_switch', timestamp: 120000, severity: 'medium'}, {type: 'paste_content', timestamp: 340000, severity: 'low'}] },
  { id: 'result-2', examId: 'exam-3', examTitle: 'World Geography', userId: 'user-6', userName: 'John Doe', submittedAt: new Date(Date.now() - 86400000), score: 5, totalPoints: 5, answers: { 'q1': 'Paris' }, proctoringEvents: [] },
];

const MOCK_CANDIDATES: Candidate[] = [
    { id: 'cand-1', name: 'Ahmad M.', role: 'Frontend Developer', lastActivity: '2 days ago', stage: CandidateStatus.Applied },
    { id: 'cand-2', name: 'Fatima Z.', role: 'UI/UX Designer', lastActivity: '5 hours ago', stage: CandidateStatus.Screening },
    { id: 'cand-3', name: 'Yusuf H.', role: 'Backend Developer', lastActivity: '1 day ago', stage: CandidateStatus.Assessment },
    { id: 'cand-4', name: 'Layla K.', role: 'Product Manager', lastActivity: '3 days ago', stage: CandidateStatus.Interview },
    { id: 'cand-5', name: 'Omar N.', role: 'DevOps Engineer', lastActivity: '1 week ago', stage: CandidateStatus.Offer },
    { id: 'cand-6', name: 'Hana S.', role: 'QA Engineer', lastActivity: '2 weeks ago', stage: CandidateStatus.Hired },
];

const MOCK_INTERVIEWS: Interview[] = [
    { id: 'live-1', candidateName: 'Ahmed Salem', interviewerName: 'Sara M.', role: 'Frontend Dev', type: 'Technical', typeColor: 'bg-green-500' },
    { id: 'live-2', candidateName: 'Fatima Ali', interviewerName: 'Mohamed A.', role: 'UI/UX Designer', type: 'Behavioral', typeColor: 'bg-purple-500' },
];

let MOCK_CATEGORIES: Record<string, string[]> = {
    'Programming': ['JavaScript', 'Python', 'Web Development'],
    'Science': ['Physics', 'Biology', 'Astronomy'],
    'Geography': ['Europe', 'Asia', 'Africa'],
    'Mathematics': ['Algebra', 'Geometry', 'Number Theory']
};

let MOCK_PLATFORM_SETTINGS: PlatformSettings = {
  platformName: 'evaluify',
  primaryColor: '#10b981',
  proctoringSensitivity: 'medium',
  enableMarketplace: true,
};


// --- HELPERS ---
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
const ai = process.env.API_KEY ? new GoogleGenAI({ apiKey: process.env.API_KEY }) : null;

// --- API FUNCTIONS ---

export const getDashboardStats = async (role: UserRole): Promise<DashboardStats> => {
    await delay(500);
    // Return different stats based on role
    if (role === UserRole.Teacher) {
        return {
            stat1: { title: 'Active Courses', value: '12', trend: '+2 this month' },
            stat2: { title: 'Total Students', value: '450', trend: '+15 this month' },
            stat3: { title: 'Assessments Graded', value: '320', trend: '8 pending' },
            stat4: { title: 'Average Score', value: '82%', trend: '+1.5% improvement' },
        };
    }
    if (role === UserRole.Corporate) {
         return {
            stat1: { title: 'Open Positions', value: '8', trend: '+1 this week' },
            stat2: { title: 'Candidates Assessed', value: '128', trend: '+25 this week' },
            stat3: { title: 'Avg. Pass Rate', value: '68%', trend: '-2% this week' },
            stat4: { title: 'Hired this Month', value: '6', trend: 'Target: 10' },
        };
    }
    // Add other roles here...
    return { // Default/Admin
        stat1: { title: 'Total Users', value: MOCK_USERS.length.toString(), trend: '+5 this week' },
        stat2: { title: 'Total Assessments', value: MOCK_EXAMS.length.toString(), trend: '+12 this week' },
        stat3: { title: 'Total Questions', value: MOCK_QUESTIONS.length.toString(), trend: '+50 this week' },
        stat4: { title: 'Integrity Flags', value: '89', trend: '-10% this week' },
    };
};

export const getRecentAssessments = async (): Promise<RecentAssessment[]> => {
    await delay(300);
    return [
        { name: 'John Doe', test: 'React Basics', score: 85, avatar: 'JD', avatarColor: 'bg-blue-500' },
        { name: 'Jane Smith', test: 'JS Advanced', score: 92, avatar: 'JS', avatarColor: 'bg-purple-500' },
        { name: 'Sam Wilson', test: 'CSS Grid', score: 78, avatar: 'SW', avatarColor: 'bg-green-500' },
    ];
};

export const getPerformanceByType = async (): Promise<PerformanceData[]> => {
    await delay(400);
    return [
        { title: 'Multiple Choice', percentage: 85, color: '#3b82f6' },
        { title: 'Essay', percentage: 72, color: '#8b5cf6' },
        { title: 'True/False', percentage: 91, color: '#10b981' },
    ];
};

export const getAIInsights = async (): Promise<AIInsight[]> => {
    await delay(600);
    return [
        { icon: 'LightbulbIcon', title: 'Top Performing Topic', text: 'Students are scoring highest in "React Hooks". Consider adding more advanced questions.', color: 'green' },
        { icon: 'ChartBarIcon', title: 'Question Difficulty', text: 'Question #8 in "JS Advanced" has a 90% failure rate. It might be too difficult.', color: 'blue' },
        { icon: 'SparklesIcon', title: 'New Trend Detected', text: 'Increased demand for "Web Sockets" skills. Suggest creating a new assessment.', color: 'purple' },
    ];
};

export const getExamDetails = async (examId: string): Promise<Exam | null> => {
    await delay(500);
    return MOCK_EXAMS.find(e => e.id === examId) || null;
};

export const submitExam = async (examId: string, answers: StudentAnswer, proctoringEvents: ProctoringEvent[]): Promise<ExamResult> => {
    await delay(1000);
    const exam = MOCK_EXAMS.find(e => e.id === examId);
    if (!exam) throw new Error("Exam not found");
    
    let score = 0;
    let totalPoints = 0;
    exam.questions.forEach(q => {
        totalPoints += q.points;
        if (JSON.stringify(answers[q.id]) === JSON.stringify(q.correctAnswer)) {
            score += q.points;
        }
    });

    const result: ExamResult = {
        id: `result-${Date.now()}`,
        examId,
        examTitle: exam.title,
        userId: 'current-user-id',
        userName: 'Examinee User',
        submittedAt: new Date(),
        score,
        totalPoints,
        answers,
        proctoringEvents
    };
    MOCK_RESULTS.push(result);
    return result;
};

export const getAIPerformanceFeedback = async ({ examTitle, result, exam }: { examTitle: string; result: ExamResult; exam: Exam; }): Promise<{ feedback: string }> => {
    if (!ai) {
        await delay(1000);
        return { feedback: "AI feedback is currently unavailable. You performed well in multiple-choice questions but could improve on essay-style answers." };
    }
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Generate a brief, encouraging, one-paragraph performance summary for a student who just finished an exam. Exam Title: "${examTitle}". Score: ${result.score}/${result.totalPoints}. Mention one area of strength and one area for improvement based on the questions they got right/wrong.`,
        });
        return { feedback: response.text };
    } catch (e) {
        console.error(e);
        return { feedback: "Could not generate AI feedback at this time." };
    }
};

export const getExamineeExams = async (): Promise<Omit<Exam, 'questions'>[]> => {
    await delay(500);
    return MOCK_EXAMS.map(({ questions, ...exam }) => exam);
};

export const getExamineeDashboardData = async (userId: string): Promise<{
    upcomingExams: Omit<Exam, 'questions'>[];
    completedResults: ExamResult[];
}> => {
    await delay(700);
    const upcomingExams = MOCK_EXAMS.filter(e => e.availableFrom && new Date(e.availableFrom) > new Date()).map(({ questions, ...exam }) => exam);
    const completedResults = MOCK_RESULTS.filter(r => ['current-user-id', 'user-5', 'user-6'].includes(r.userId));
    return { upcomingExams, completedResults };
};

export const getAssessments = async (ownerId: string): Promise<Exam[]> => {
    await delay(500);
    return MOCK_EXAMS.filter(e => e.ownerId === ownerId);
};

export const addAssessment = async (examData: Omit<Exam, 'id' | 'questionCount'>): Promise<Exam> => {
    await delay(500);
    const newExam: Exam = {
        ...examData,
        id: `exam-${Date.now()}`,
        questionCount: examData.questions.length,
    };
    MOCK_EXAMS.push(newExam);
    return newExam;
};

export const updateAssessment = async (examData: Exam): Promise<Exam> => {
    await delay(500);
    const index = MOCK_EXAMS.findIndex(e => e.id === examData.id);
    if (index === -1) throw new Error("Exam not found");
    const updatedExam = { ...examData, questionCount: examData.questions.length };
    MOCK_EXAMS[index] = updatedExam;
    return updatedExam;
};

export const deleteAssessment = async (examId: string): Promise<void> => {
    await delay(500);
    MOCK_EXAMS = MOCK_EXAMS.filter(e => e.id !== examId);
};

export const getQuestionBank = async (filters: { ownerId?: string; status?: QuestionStatus; searchTerm?: string; questionType?: QuestionType }): Promise<Question[]> => {
    await delay(500);
    return MOCK_QUESTIONS.filter(q => 
        (!filters.ownerId || q.ownerId === filters.ownerId) &&
        (!filters.status || q.status === filters.status) &&
        (!filters.searchTerm || q.text.toLowerCase().includes(filters.searchTerm.toLowerCase())) &&
        (!filters.questionType || q.type === filters.questionType)
    );
};

export const generateQuestionsWithAI = async (params: { topic: string; questionType: QuestionType; difficulty: ExamDifficulty; count: number }): Promise<Omit<Question, 'id'>[]> => {
    await delay(2000);
    
    return Array.from({ length: params.count }, (_, i) => {
        const baseQuestion = {
            ownerId: 'ai-generated',
            points: 10,
            tags: [params.topic.toLowerCase(), 'ai-generated'],
            category: 'AI Generated',
            subCategory: params.topic,
        };

        switch (params.questionType) {
            case QuestionType.TrueFalse:
                return {
                    ...baseQuestion,
                    text: `AI: Is it true that "${params.topic}" is related to concept ${i + 1}?`,
                    type: QuestionType.TrueFalse,
                    options: ['True', 'False'],
                    correctAnswer: i % 2 === 0 ? 'True' : 'False',
                };
            case QuestionType.Essay:
                return {
                    ...baseQuestion,
                    text: `AI: Explain the core principles of "${params.topic}" regarding aspect ${i + 1}.`,
                    type: QuestionType.Essay,
                    correctAnswer: `A model answer explaining the principles of ${params.topic}.`,
                };
            case QuestionType.ShortAnswer:
                return {
                     ...baseQuestion,
                    text: `AI: Briefly define the term related to "${params.topic}" number ${i + 1}.`,
                    type: QuestionType.ShortAnswer,
                    correctAnswer: `A short definition for ${params.topic} term ${i+1}.`,
                };
            case QuestionType.MultipleChoice:
            default:
                 return {
                    ...baseQuestion,
                    text: `AI Generated Question ${i + 1} about ${params.topic}?`,
                    type: QuestionType.MultipleChoice,
                    options: [`${params.topic} Option A`, `${params.topic} Option B`, `${params.topic} Correct Option`],
                    correctAnswer: `${params.topic} Correct Option`,
                };
        }
    });
};

export const generateFullExamWithAI = async (params: { topic: string; difficulty: ExamDifficulty; count: number }): Promise<Omit<Exam, 'id' | 'questionCount'>> => {
    await delay(3000);
    const questions = await generateQuestionsWithAI({ ...params, questionType: QuestionType.MultipleChoice });
    return {
        title: `AI Generated Exam: ${params.topic}`,
        description: `An exam about ${params.topic} generated by AI.`,
        duration: params.count * 2,
        difficulty: params.difficulty,
        questions: questions.map((q, i) => ({ ...q, id: `ai-q-${i}` })),
        ownerId: 'ai-generated'
    };
};

export const getAIQuestionSuggestions = async (params: { partialQuestionText: string }): Promise<Omit<Question, 'id' | 'ownerId' | 'category' | 'subCategory'>> => {
    await delay(1500);
    return {
        text: `${params.partialQuestionText} - AI completed this for you.`,
        type: QuestionType.MultipleChoice,
        options: ['AI Option 1', 'AI Option 2', 'Correct AI Option'],
        correctAnswer: 'Correct AI Option',
        points: 5,
        tags: ['ai-assisted'],
    };
};

export const getCategories = async (): Promise<Record<string, string[]>> => {
    await delay(200);
    return MOCK_CATEGORIES;
};

export const addCategory = async (name: string) => {
    await delay(200);
    if (!MOCK_CATEGORIES[name]) MOCK_CATEGORIES[name] = [];
};
export const deleteCategory = async (name: string) => {
    await delay(200);
    delete MOCK_CATEGORIES[name];
};
export const addSubCategory = async (categoryName: string, subName: string) => {
    await delay(200);
    if (MOCK_CATEGORIES[categoryName] && !MOCK_CATEGORIES[categoryName].includes(subName)) {
        MOCK_CATEGORIES[categoryName].push(subName);
    }
};
export const deleteSubCategory = async (categoryName: string, subName: string) => {
    await delay(200);
    if (MOCK_CATEGORIES[categoryName]) {
        MOCK_CATEGORIES[categoryName] = MOCK_CATEGORIES[categoryName].filter(s => s !== subName);
    }
};

export const getUsers = async (): Promise<User[]> => {
    await delay(500);
    return MOCK_USERS;
};
export const updateUserRole = async (userId: string, newRole: UserRole): Promise<User> => {
    await delay(300);
    const user = MOCK_USERS.find(u => u.id === userId);
    if (!user) throw new Error("User not found");
    user.role = newRole;
    return user;
};
export const deleteUser = async (userId: string): Promise<void> => {
    await delay(300);
    const index = MOCK_USERS.findIndex(u => u.id === userId);
    if (index > -1) MOCK_USERS.splice(index, 1);
};

export const getExamineeResults = async (userId: string): Promise<ExamResult[]> => {
    await delay(500);
    if (userId === 'all') return MOCK_RESULTS;
    return MOCK_RESULTS.filter(r => r.userId === userId || r.userId === 'current-user-id');
};

export const getExamResultDetails = async (resultId: string): Promise<{ result: ExamResult; exam: Exam } | null> => {
    await delay(500);
    const result = MOCK_RESULTS.find(r => r.id === resultId);
    if (!result) return null;
    const exam = MOCK_EXAMS.find(e => e.id === result.examId);
    if (!exam) return null;
    return { result, exam };
};

export const getAllExams = async (): Promise<Exam[]> => {
    await delay(500);
    return MOCK_EXAMS;
};

export const getPlatformSettings = async (): Promise<PlatformSettings> => {
    await delay(200);
    return MOCK_PLATFORM_SETTINGS;
};
export const savePlatformSettings = async (settings: PlatformSettings): Promise<PlatformSettings> => {
    await delay(500);
    MOCK_PLATFORM_SETTINGS = settings;
    return MOCK_PLATFORM_SETTINGS;
};

export const getCandidates = async (): Promise<Candidate[]> => {
    await delay(500);
    return MOCK_CANDIDATES;
};
export const updateCandidateStatus = async (candidateId: string, newStatus: CandidateStatus): Promise<Candidate> => {
    await delay(300);
    const candidate = MOCK_CANDIDATES.find(c => c.id === candidateId);
    if (!candidate) throw new Error("Candidate not found");
    candidate.stage = newStatus;
    return candidate;
};

export const getLiveInterviews = async (): Promise<Interview[]> => {
    await delay(300);
    return MOCK_INTERVIEWS;
};

export const getInterviewDetails = async (interviewId: string): Promise<Interview | null> => {
    await delay(300);
    return MOCK_INTERVIEWS.find(i => i.id === interviewId) || null;
};

// New function for Analytics Page
export const getAnalyticsData = async (): Promise<AnalyticsData> => {
    await delay(800);
    return {
        scoresOverTime: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            scores: [65, 72, 78, 75, 82, 88],
        },
        passFailRate: {
            pass: 76,
            fail: 24,
        },
        performanceByCategory: {
            labels: ['Geography', 'Math', 'Programming', 'Science', 'History'],
            scores: [88, 75, 92, 81, 70],
        },
        avgScoreByDifficulty: {
            labels: ['Easy', 'Medium', 'Hard'],
            scores: [91, 82, 71],
        }
    };
};
