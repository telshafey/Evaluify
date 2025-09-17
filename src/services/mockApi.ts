import { 
    UserRole, 
    DashboardStats, 
    RecentAssessment, 
    PerformanceData, 
    AIInsight, 
    Exam, 
    Question, 
    QuestionType, 
    StudentAnswer, 
    ProctoringEvent,
    ExamResult,
    ExamDifficulty,
    User,
    PlatformSettings,
    QuestionStatus,
    CvAnalysisResult,
    Candidate,
    CandidateStatus,
    Interview,
    AnalyticsData,
    TrueFalseJustificationAnswer,
    SmartReport
} from '../types.ts';

// --- MOCK DATABASE ---

let mockQuestions: Question[] = [
    { id: 'q1', ownerId: 'teacher-1', text: 'What is the capital of France?', type: QuestionType.ShortAnswer, correctAnswer: 'Paris', points: 5, tags: ['geography'], category: 'Geography', subCategory: 'Europe', status: QuestionStatus.Approved },
    { id: 'q2', ownerId: 'teacher-1', text: 'Which of these are React hooks?', type: QuestionType.MultipleSelect, options: ['useState', 'useQuery', 'useClass', 'useEffect'], correctAnswer: ['useState', 'useEffect'], points: 10, tags: ['react', 'frontend'], category: 'Programming', subCategory: 'React', status: QuestionStatus.Approved },
    { id: 'q3', ownerId: 'corp-1', text: 'True or False: `const` variables can be reassigned.', type: QuestionType.TrueFalse, options: ['True', 'False'], correctAnswer: 'False', points: 5, tags: ['javascript'], category: 'Programming', subCategory: 'JavaScript', status: QuestionStatus.Approved },
    { id: 'q4', ownerId: 'admin-1', text: 'What is the time complexity of a binary search?', type: QuestionType.MultipleChoice, options: ['O(n)', 'O(log n)', 'O(n^2)', 'O(1)'], correctAnswer: 'O(log n)', points: 10, tags: ['algorithms', 'cs'], category: 'Computer Science', subCategory: 'Algorithms', status: QuestionStatus.Approved },
    { id: 'q5', ownerId: 'teacher-1', text: 'Write a short essay on the causes of World War I.', type: QuestionType.Essay, correctAnswer: 'Model answer covering militarism, alliances, imperialism, and nationalism...', points: 20, tags: ['history'], category: 'History', subCategory: 'World History' },
    { id: 'q6', ownerId: 'training-1', text: 'The sun is a star.', type: QuestionType.TrueFalseWithJustification, correctAnswer: { selection: 'True', justification: 'The sun is a G-type main-sequence star (G2V) at the center of the Solar System.' } as TrueFalseJustificationAnswer, points: 10, tags: ['astronomy'], category: 'Science', subCategory: 'Astronomy' },
];

let mockExams: Exam[] = [
    { id: 'exam1', ownerId: 'teacher-1', ownerName: 'Dr. Anya Sharma', title: 'React Fundamentals Quiz', description: 'A short quiz on the basics of React.', duration: 15, difficulty: 'Easy', questions: [mockQuestions[1], mockQuestions[2]], questionCount: 2 },
    { id: 'exam2', ownerId: 'corp-1', ownerName: 'Innovate Corp', title: 'Senior Developer Screening', description: 'Advanced algorithms and system design questions.', duration: 60, difficulty: 'Hard', questions: [mockQuestions[3]], questionCount: 1, availableFrom: new Date().toISOString() },
    { id: 'exam3', ownerId: 'training-1', ownerName: 'Global Certs', title: 'History Midterm', description: 'Midterm exam for World History 101.', duration: 50, difficulty: 'Medium', questions: [mockQuestions[0], mockQuestions[4]], questionCount: 2, availableFrom: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'exam4', ownerId: 'teacher-1', ownerName: 'Dr. Anya Sharma', title: 'European Geography', description: 'Test your knowledge of European capitals.', duration: 10, difficulty: 'Easy', questions: [mockQuestions[0]], questionCount: 1, availableFrom: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString() },
];

let mockUsers: User[] = [
    { id: 'user1', name: 'Alice Johnson', email: 'alice@example.com', role: UserRole.Teacher, registeredAt: '2023-01-15T10:00:00Z' },
    { id: 'user2', name: 'Bob Williams', email: 'bob@example.com', role: UserRole.Examinee, registeredAt: '2023-02-20T11:30:00Z' },
    { id: 'user3', name: 'Charlie Brown', email: 'charlie@example.com', role: UserRole.Admin, registeredAt: '2023-01-10T09:00:00Z' },
    { id: 'user4', name: 'Diana Prince', email: 'diana@example.com', role: UserRole.Corporate, registeredAt: '2023-03-05T14:00:00Z' },
    { id: 'user5', name: 'Ethan Hunt', email: 'ethan@example.com', role: UserRole.TrainingCompany, registeredAt: '2023-04-01T18:00:00Z' },
];

let mockExamResults: ExamResult[] = [
    { id: 'res1', examId: 'exam1', examTitle: 'React Fundamentals Quiz', userId: 'user2', userName: 'Bob Williams', submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), score: 10, totalPoints: 15, answers: { 'q2': ['useState', 'useEffect'], 'q3': 'True' }, proctoringEvents: [{type: 'tab_switch', timestamp: 120000, severity: 'medium'}, {type: 'noise_detection', timestamp: 340000, severity: 'low'}] },
    { id: 'res2', examId: 'exam2', examTitle: 'Senior Developer Screening', userId: 'user-ext', userName: 'Jane Doe', submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), score: 5, totalPoints: 5, answers: { 'q4': 'O(log n)' }, proctoringEvents: [{type: 'face_detection', timestamp: 650000, severity: 'high', details: 'Second face detected.'}] },
];

let mockCategories: Record<string, string[]> = {
    "Programming": ["React", "JavaScript", "Python"],
    "History": ["World History", "US History"],
    "Science": ["Physics", "Biology", "Astronomy"],
    "Geography": ["Europe", "Asia"],
    "Computer Science": ["Algorithms", "Data Structures"]
};

let mockPlatformSettings: PlatformSettings = {
    platformName: 'evaluify',
    primaryColor: '#10b981',
    enableMarketplace: true,
    proctoringSensitivity: 'medium',
};

let mockCandidates: Candidate[] = [
  { id: 'cand1', name: 'John Doe', role: 'Frontend Developer', stage: CandidateStatus.Applied, lastActivity: '2 days ago' },
  { id: 'cand2', name: 'Jane Smith', role: 'Backend Developer', stage: CandidateStatus.Assessment, lastActivity: '1 day ago' },
  { id: 'cand3', name: 'Peter Jones', role: 'UI/UX Designer', stage: CandidateStatus.Interview, lastActivity: '5 hours ago' },
  { id: 'cand4', name: 'Mary Johnson', role: 'Product Manager', stage: CandidateStatus.Offer, lastActivity: '3 days ago' },
  { id: 'cand5', name: 'David Chen', role: 'DevOps Engineer', stage: CandidateStatus.Hired, lastActivity: '1 week ago' },
  { id: 'cand6', name: 'Sarah Lee', role: 'Frontend Developer', stage: CandidateStatus.Screening, lastActivity: 'yesterday' },
];

let mockInterviews: Interview[] = [
    { id: 'int1', candidateName: 'Jane Smith', role: 'Backend Developer', date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), interviewerName: 'Ahmad M.', status: 'Scheduled' },
    { id: 'int2', candidateName: 'Peter Jones', role: 'UI/UX Designer', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), interviewerName: 'Ahmad M.', status: 'Completed' },
    // Fix: Changed 'name' to 'candidateName' to match the Interview type.
    { id: 'int3', candidateName: 'John Doe', role: 'Frontend Developer', date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), interviewerName: 'Ahmad M.', status: 'Scheduled' },
];


// --- API FUNCTIONS ---

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const getDashboardStats = async (role: UserRole): Promise<DashboardStats> => {
    await delay(500);
    // This would fetch data based on role
    switch(role) {
        case UserRole.Teacher:
            return {
                stat1: { title: 'Active Courses', value: '12', trend: '+5 this month' },
                stat2: { title: 'Total Students', value: '350', trend: '+12 since last week' },
                stat3: { title: 'Assessments Graded', value: '89', trend: '5 pending' },
                stat4: { title: 'Avg. Score', value: '82%', trend: '-2% vs. last month' },
            };
        case UserRole.Corporate:
            return {
                stat1: { title: 'Open Roles', value: '8', trend: '+2 new roles' },
                stat2: { title: 'Candidates Assessed', value: '128', trend: '+30 this week' },
                stat3: { title: 'Interviews Scheduled', value: '45', trend: '12 this week' },
                stat4: { title: 'Avg. Time to Hire', value: '24 days', trend: '-3 days' },
            };
        case UserRole.TrainingCompany:
             return {
                stat1: { title: 'Active Programs', value: '25', trend: '+3 this quarter' },
                stat2: { title: 'Enrolled Trainees', value: '850', trend: '+50 this month' },
                stat3: { title: 'Certificates Issued', value: '450', trend: '+120 this quarter' },
                stat4: { title: 'Avg. Completion Rate', value: '91%', trend: '+3%' },
            };
        case UserRole.Admin:
            return {
                stat1: { title: 'Total Users', value: '1,250', trend: '+50 this week' },
                stat2: { title: 'Total Exams Taken', value: '5,830', trend: '+500 this month' },
                stat3: { title: 'Active Subscriptions', value: '150', trend: '+10 this month' },
                stat4: { title: 'Platform Integrity Flags', value: '89', trend: '-5% vs. last month' },
            };
        default:
             return { stat1: {title: '', value: '', trend: ''}, stat2: {title: '', value: '', trend: ''}, stat3: {title: '', value: '', trend: ''}, stat4: {title: '', value: '', trend: ''}}
    }
};

export const getRecentAssessments = async (): Promise<RecentAssessment[]> => {
    await delay(600);
    return [
        { name: 'John Doe', test: 'React Basics', score: 85, avatar: 'JD', avatarColor: 'bg-blue-500' },
        { name: 'Jane Smith', test: 'JavaScript Algorithms', score: 92, avatar: 'JS', avatarColor: 'bg-purple-500' },
        { name: 'Peter Jones', test: 'CSS Grid & Flexbox', score: 78, avatar: 'PJ', avatarColor: 'bg-green-500' },
        { name: 'Mary Johnson', test: 'React Basics', score: 95, avatar: 'MJ', avatarColor: 'bg-yellow-500' },
    ];
};

export const getPerformanceByType = async (): Promise<PerformanceData[]> => {
    await delay(700);
    return [
        { title: 'Multiple Choice', percentage: 85, color: '#3b82f6' },
        { title: 'Short Answer', percentage: 72, color: '#8b5cf6' },
        { title: 'Essay', percentage: 65, color: '#10b981' },
    ];
};

export const getAIInsights = async (): Promise<AIInsight[]> => {
    await delay(800);
    return [
        { icon: 'LightbulbIcon', color: 'blue', title: 'Top Performing Topic', text: 'Students are excelling in "React Hooks". Consider introducing more advanced concepts.' },
        { icon: 'ChartBarIcon', color: 'green', title: 'Improvement Area', text: 'Scores for "JavaScript Algorithms" are 15% lower on average. Suggest review sessions.' },
        { icon: 'SparklesIcon', color: 'purple', title: 'New Question Suggestion', text: 'Generate questions about "React Server Components" to stay current.' },
    ];
};

export const getExamDetails = async (examId: string): Promise<Exam | null> => {
    await delay(500);
    return mockExams.find(e => e.id === examId) || null;
};

export const submitExam = async (examId: string, answers: StudentAnswer, proctoringEvents: ProctoringEvent[]): Promise<ExamResult> => {
    await delay(1000);
    const exam = mockExams.find(e => e.id === examId);
    if (!exam) throw new Error("Exam not found");

    let score = 0;
    const totalPoints = exam.questions.reduce((sum, q) => sum + q.points, 0);

    exam.questions.forEach(q => {
        if (JSON.stringify(answers[q.id]) === JSON.stringify(q.correctAnswer)) {
            score += q.points;
        }
    });

    const newResult: ExamResult = {
        id: `res-${Date.now()}`,
        examId,
        examTitle: exam.title,
        userId: 'current-user-id',
        userName: 'Current User', // Replace with actual user name
        submittedAt: new Date(),
        score,
        totalPoints,
        answers,
        proctoringEvents
    };
    mockExamResults.push(newResult);
    return newResult;
};

export const getExamineeDashboardData = async (userId: string) => {
    await delay(800);
    const now = new Date();
    return {
        availableExams: mockExams.filter(e => {
            const from = e.availableFrom ? new Date(e.availableFrom) : null;
            const until = e.availableUntil ? new Date(e.availableUntil) : null;
            return (!from || from <= now) && (!until || until >= now);
        }).map(({questions, ...rest}) => rest),
        upcomingExams: mockExams.filter(e => e.availableFrom && new Date(e.availableFrom) > now).map(({questions, ...rest}) => rest),
        completedResults: mockExamResults.filter(r => r.userId === userId || userId === 'current-user-id').slice(0, 5),
    };
};

export const getExamineeResults = async (userId: string): Promise<ExamResult[]> => {
    await delay(500);
    if (userId === 'all') return mockExamResults;
    return mockExamResults.filter(r => r.userId === userId);
};

export const getExamResultDetails = async (resultId: string): Promise<{ result: ExamResult; exam: Exam } | null> => {
    await delay(700);
    const result = mockExamResults.find(r => r.id === resultId);
    if (!result) return null;
    const exam = mockExams.find(e => e.id === result.examId);
    if (!exam) return null; // Should not happen in real app
    return { result, exam };
};


// Admin/Teacher APIs
export const getAssessments = async (ownerId: string): Promise<Exam[]> => {
    await delay(500);
    return mockExams.filter(e => e.ownerId === ownerId);
};

export const addAssessment = async (examData: Omit<Exam, 'id' | 'questionCount'>): Promise<Exam> => {
    await delay(300);
    const newExam: Exam = {
        ...examData,
        id: `exam-${Date.now()}`,
        questionCount: examData.questions.length
    };
    mockExams.push(newExam);
    return newExam;
};

export const updateAssessment = async (examData: Exam): Promise<Exam> => {
    await delay(300);
    const index = mockExams.findIndex(e => e.id === examData.id);
    if (index === -1) throw new Error("Exam not found");
    const updatedExam = { ...examData, questionCount: examData.questions.length };
    mockExams[index] = updatedExam;
    return updatedExam;
};

export const deleteAssessment = async (examId: string): Promise<void> => {
    await delay(300);
    mockExams = mockExams.filter(e => e.id !== examId);
};

export const getAllExams = async (): Promise<Exam[]> => {
    await delay(600);
    return mockExams;
};


// Question Bank APIs
export const getQuestionBank = async (filters: { ownerId?: string, status?: QuestionStatus, searchTerm?: string, questionType?: QuestionType | '' }): Promise<Question[]> => {
    await delay(500);
    return mockQuestions.filter(q => 
        (!filters.ownerId || q.ownerId === filters.ownerId || filters.ownerId === 'marketplace') &&
        (!filters.status || q.status === filters.status) &&
        (!filters.searchTerm || q.text.toLowerCase().includes(filters.searchTerm.toLowerCase())) &&
        (!filters.questionType || q.type === filters.questionType)
    );
};

export const addQuestionToBank = async (questionData: Omit<Question, 'id'>): Promise<Question> => {
    await delay(300);
    const newQuestion: Question = {
        ...questionData,
        id: `q-${Date.now()}`,
        status: QuestionStatus.Approved, // Default for this mock
    };
    mockQuestions.push(newQuestion);
    return newQuestion;
};

export const updateQuestionInBank = async (questionData: Question): Promise<Question> => {
    await delay(300);
    const index = mockQuestions.findIndex(q => q.id === questionData.id);
    if (index === -1) throw new Error("Question not found");
    mockQuestions[index] = questionData;
    return questionData;
};

export const deleteQuestionFromBank = async (questionId: string): Promise<void> => {
    await delay(300);
    mockQuestions = mockQuestions.filter(q => q.id !== questionId);
};


// Category APIs
export const getCategories = async (): Promise<Record<string, string[]>> => {
    await delay(200);
    return JSON.parse(JSON.stringify(mockCategories));
};

export const addCategory = async (name: string): Promise<void> => {
    await delay(100);
    if (!mockCategories[name]) {
        mockCategories[name] = [];
    }
};

export const deleteCategory = async (name: string): Promise<void> => {
    await delay(100);
    delete mockCategories[name];
};

export const addSubCategory = async (category: string, subCategory: string): Promise<void> => {
    await delay(100);
    if (mockCategories[category] && !mockCategories[category].includes(subCategory)) {
        mockCategories[category].push(subCategory);
    }
};

export const deleteSubCategory = async (category: string, subCategory: string): Promise<void> => {
    await delay(100);
    if (mockCategories[category]) {
        mockCategories[category] = mockCategories[category].filter(s => s !== subCategory);
    }
};


// User Management APIs
export const getUsers = async (): Promise<User[]> => {
    await delay(500);
    return mockUsers;
};

export const updateUserRole = async (userId: string, newRole: UserRole): Promise<User> => {
    await delay(300);
    const user = mockUsers.find(u => u.id === userId);
    if (!user) throw new Error("User not found");
    user.role = newRole;
    return user;
};

export const deleteUser = async (userId: string): Promise<void> => {
    await delay(300);
    mockUsers = mockUsers.filter(u => u.id !== userId);
};


// Platform Settings API
export const getPlatformSettings = async (): Promise<PlatformSettings> => {
    await delay(200);
    return mockPlatformSettings;
};

export const savePlatformSettings = async (settings: PlatformSettings): Promise<PlatformSettings> => {
    await delay(400);
    mockPlatformSettings = settings;
    return mockPlatformSettings;
};


// AI Generation APIs
export const generateQuestionsWithAI = async (params: { topic: string; questionType: QuestionType; difficulty: string; count: number }): Promise<Omit<Question, 'id'>[]> => {
    await delay(1500);
    const newQuestions: Omit<Question, 'id'>[] = [];
    for (let i = 0; i < params.count; i++) {
        newQuestions.push({
            ownerId: 'ai-generated',
            text: `AI-generated ${params.questionType} question about ${params.topic} #${i + 1}?`,
            type: params.questionType,
            options: ['Option A', 'Option B', 'Option C'],
            correctAnswer: 'Option A',
            points: 10,
            tags: [params.topic.toLowerCase(), 'ai-generated'],
            category: 'AI Generated',
            subCategory: params.topic,
        });
    }
    return newQuestions;
};

export const getAIQuestionSuggestions = async (params: { partialQuestionText: string }): Promise<Question> => {
    await delay(1000);
    return {
        id: 'ai-suggest',
        ownerId: 'ai-suggest',
        text: `${params.partialQuestionText} ... and what is the main benefit?`,
        type: QuestionType.MultipleChoice,
        options: ['Speed', 'Reliability', 'Scalability'],
        correctAnswer: 'Scalability',
        points: 10,
        tags: ['ai-assisted'],
        category: 'AI Assisted',
        subCategory: 'Suggestion',
    };
};

export const generateFullExamWithAI = async (params: { topic: string, difficulty: ExamDifficulty, count: number}): Promise<Omit<Exam, 'id' | 'questionCount'>> => {
    await delay(2000);
    const questions = await generateQuestionsWithAI({ ...params, questionType: QuestionType.MultipleChoice });
    return {
        ownerId: 'ai-generated',
        title: `AI-Generated Exam: ${params.topic}`,
        description: `An exam about ${params.topic} with ${params.count} questions, generated by AI.`,
        duration: params.count * 2, // 2 mins per question
        difficulty: params.difficulty,
        questions: questions.map(q => ({...q, id: `ai-q-${Math.random()}`})),
    };
};

export const analyzeCvWithAI = async (cvText: string, jobDescription: string): Promise<CvAnalysisResult> => {
    await delay(2500);
    // Simulate some basic analysis
    const score = Math.floor(60 + Math.random() * 40);
    return {
        matchScore: score,
        summary: `The candidate appears to be a ${score > 80 ? 'strong' : 'moderate'} fit for the role based on their experience with keywords found in the job description.`,
        strengths: ["Experience with React and TypeScript.", "Strong problem-solving skills mentioned.", "Team leadership experience."],
        weaknesses: ["Lacks experience with GraphQL.", "No mention of cloud-based services like AWS or Azure."],
        suggestedQuestions: [
            "Can you describe a challenging project you worked on using React and how you overcame it?",
            "How would you approach learning a new technology like GraphQL for a project?",
            "Tell me about your experience leading a development team.",
        ]
    };
};

export const generateSmartReportWithAI = async (ownerId: string): Promise<SmartReport> => {
    await delay(2500);
    // This simulates analyzing all data for a given owner (e.g., teacher-1)
    // In a real app, this would be a complex backend process feeding data to Gemini
    return {
        summary: "Overall candidate performance shows a strong grasp of fundamental concepts, particularly in React, with an average score of 82%. However, a noticeable weakness exists in algorithm-based questions, which could indicate a need for more focused training in that area.",
        strengths: [
            "High success rate (95%) on questions related to React Hooks.",
            "Candidates consistently demonstrate good coding practices in essay-style questions.",
            "Assessment completion times are 15% faster than the benchmark average."
        ],
        areasForImprovement: [
            "Average score on 'Hard' difficulty algorithm questions is low at 45%.",
            "There's a 20% drop-off rate for assessments longer than 60 minutes.",
            "Feedback suggests candidates find 'CSS Grid' questions confusingly worded."
        ],
        recommendations: [
            "Introduce a dedicated module or pre-assessment focusing on common data structures and algorithms.",
            "Consider breaking longer assessments into two shorter, more focused parts to improve completion rates.",
            "Review and rephrase questions in the 'CSS' category for clarity, possibly adding visual aids."
        ]
    };
};


// Candidate/Interview APIs
export const getCandidates = async (): Promise<Candidate[]> => {
    await delay(800);
    return mockCandidates;
};

export const updateCandidateStatus = async (candidateId: string, newStatus: CandidateStatus): Promise<Candidate> => {
    await delay(400);
    const candidate = mockCandidates.find(c => c.id === candidateId);
    if (!candidate) throw new Error("Candidate not found");
    candidate.stage = newStatus;
    candidate.lastActivity = "Just now";
    return candidate;
};


export const getInterviews = async (): Promise<Interview[]> => {
    await delay(500);
    return mockInterviews;
};

export const addInterview = async (interviewData: Omit<Interview, 'id'>): Promise<Interview> => {
    await delay(300);
    const newInterview: Interview = {
        ...interviewData,
        id: `int-${Date.now()}`,
    };
    mockInterviews.push(newInterview);
    return newInterview;
};

export const getInterviewDetails = async (interviewId: string): Promise<Interview | null> => {
    await delay(400);
    return mockInterviews.find(i => i.id === interviewId) || null;
};

export const getAnalyticsData = async (): Promise<AnalyticsData> => {
    await delay(1200);
    return {
        scoresOverTime: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            scores: [75, 78, 82, 81, 85, 88]
        },
        passFailRate: { pass: 180, fail: 45 },
        performanceByCategory: {
            labels: ['React', 'JavaScript', 'CSS', 'Algorithms', 'System Design'],
            scores: [88, 82, 90, 75, 70]
        },
        avgScoreByDifficulty: {
            labels: ['Easy', 'Medium', 'Hard'],
            scores: [92, 81, 68]
        }
    };
};