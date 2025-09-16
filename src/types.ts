
export enum UserRole {
  Teacher = 'teacher',
  Corporate = 'corporate',
  TrainingCompany = 'training-company',
  Admin = 'admin',
  Examinee = 'examinee',
}

export enum QuestionType {
  MultipleChoice = 'multiple-choice',
  MultipleSelect = 'multiple-select',
  TrueFalse = 'true-false',
  TrueFalseWithJustification = 'true-false-justification',
  ShortAnswer = 'short-answer',
  Essay = 'essay',
  Ordering = 'ordering',
  Matching = 'matching',
}

export enum QuestionStatus {
    Draft = 'draft',
    Pending = 'pending',
    Approved = 'approved',
    Rejected = 'rejected',
}

export enum CandidateStatus {
    Applied = 'Applied',
    Screening = 'Screening',
    Assessment = 'Assessment',
    Interview = 'Interview',
    Offer = 'Offer',
    Hired = 'Hired',
}


export type ExamDifficulty = 'Easy' | 'Medium' | 'Hard';

export type Answer = string | string[] | TrueFalseJustificationAnswer | null;

export interface TrueFalseJustificationAnswer {
    selection: 'True' | 'False' | '';
    justification: string;
}

export interface Question {
  id: string;
  ownerId: string;
  text: string;
  type: QuestionType;
  category: string;
  subCategory: string;
  options?: string[];
  prompts?: string[]; // For matching questions
  correctAnswer: Answer;
  points: number;
  tags: string[];
  status?: QuestionStatus;
}

export interface Exam {
  id: string;
  ownerId: string;
  ownerName?: string;
  title: string;
  description: string;
  duration: number; // in minutes
  difficulty: ExamDifficulty;
  questions: Question[];
  questionCount: number;
  availableFrom?: string;
  availableUntil?: string;
}

export type StudentAnswer = Record<string, Answer>;

export interface ProctoringEvent {
    type: 'tab_switch' | 'paste_content' | 'face_detection' | 'noise_detection';
    timestamp: number; // ms from start of exam
    severity: 'low' | 'medium' | 'high';
    details?: string;
}

export interface ExamResult {
    id: string;
    examId: string;
    examTitle: string;
    userId: string;
    userName: string;
    submittedAt: Date;
    score: number;
    totalPoints: number;
    answers: StudentAnswer;
    proctoringEvents?: ProctoringEvent[];
}

export interface DashboardStats {
    stat1: { title: string; value: string; trend: string };
    stat2: { title: string; value: string; trend: string };
    stat3: { title: string; value: string; trend: string };
    stat4: { title: string; value: string; trend: string };
}

export interface RecentAssessment {
    name: string;
    test: string;
    score: number;
    avatar: string;
    avatarColor: string;
}

export interface PerformanceData {
    title: string;
    percentage: number;
    color: string;
}

export interface AIInsight {
    icon: 'SparklesIcon' | 'ChartBarIcon' | 'LightbulbIcon';
    color: 'blue' | 'green' | 'purple';
    title: string;
    text: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    registeredAt: string;
}

export interface PlatformSettings {
    platformName: string;
    primaryColor: string;
    enableMarketplace: boolean;
    proctoringSensitivity: 'low' | 'medium' | 'high';
}

export interface CvAnalysisResult {
    matchScore: number;
    summary: string;
    strengths: string[];
    weaknesses: string[];
    suggestedQuestions: string[];
}

export interface Candidate {
    id: string;
    name: string;
    role: string;
    stage: CandidateStatus;
    lastActivity: string;
    avatarUrl?: string;
}

export interface Interview {
    id: string;
    candidateName: string;
    role: string;
    date: string;
    interviewerName: string;
    status: 'Scheduled' | 'Completed' | 'Canceled';
}

export interface AnalyticsData {
    scoresOverTime: { labels: string[]; scores: number[] };
    passFailRate: { pass: number; fail: number };
    performanceByCategory: { labels: string[]; scores: number[] };
    avgScoreByDifficulty: { labels: string[]; scores: number[] };
}

export interface SmartReport {
    summary: string;
    strengths: string[];
    areasForImprovement: string[];
    recommendations: string[];
}
