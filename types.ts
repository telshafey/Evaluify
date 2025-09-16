// types.ts

export enum UserRole {
  Teacher = 'teacher',
  Corporate = 'corporate',
  TrainingCompany = 'training-company',
  Admin = 'admin',
  Examinee = 'examinee',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  registeredAt: string;
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

export type ExamDifficulty = 'Easy' | 'Medium' | 'Hard';

export type Answer = string | string[] | Record<string, string> | TrueFalseJustificationAnswer | null;

export type TrueFalseJustificationAnswer = {
    selection: 'True' | 'False' | '';
    justification: string;
};

export interface Question {
  id: string;
  ownerId: string; // ID of the user/entity that owns this question
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

export enum QuestionStatus {
  Draft = 'draft',
  Pending = 'pending',
  Approved = 'approved',
  Rejected = 'rejected',
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  difficulty: ExamDifficulty;
  questionCount: number;
  questions: Question[];
  ownerId: string;
  ownerName?: string;
  availableFrom?: string;
  availableUntil?: string;
}

export type StudentAnswer = Record<string, Answer>;

export interface ProctoringEvent {
    type: 'tab_switch' | 'paste_content' | 'face_detection' | 'noise_detection';
    timestamp: number; // ms from exam start
    details?: string;
    severity?: 'low' | 'medium' | 'high';
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
  stat1: { title: string; value: string; trend: string; };
  stat2: { title: string; value: string; trend: string; };
  stat3: { title: string; value: string; trend: string; };
  stat4: { title: string; value: string; trend: string; };
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
  icon: string;
  title:string;
  text: string;
  color: 'blue' | 'green' | 'purple';
}

export interface PlatformSettings {
    platformName: string;
    primaryColor: string;
    proctoringSensitivity: 'low' | 'medium' | 'high';
    enableMarketplace: boolean;
}

export enum CandidateStatus {
    Applied = 'applied',
    Screening = 'screening',
    Assessment = 'assessment',
    Interview = 'interview',
    Offer = 'offer',
    Hired = 'hired',
}

export interface Candidate {
    id: string;
    name: string;
    role: string;
    lastActivity: string;
    stage: CandidateStatus;
}

export interface Interview {
    id: string;
    candidateName: string;
    interviewerName: string;
    role: string;
    type: 'Technical' | 'Behavioral' | 'Final';
    typeColor: string;
}

export interface AnalyticsData {
    scoresOverTime: {
        labels: string[];
        scores: number[];
    };
    passFailRate: {
        pass: number;
        fail: number;
    };
    performanceByCategory: {
        labels: string[];
        scores: number[];
    };
    avgScoreByDifficulty: {
        labels: string[];
        scores: number[];
    };
}