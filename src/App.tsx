import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from './contexts/AuthContext.tsx';
import { DarkModeProvider } from './contexts/DarkModeContext.tsx';
import { NotificationProvider } from './contexts/NotificationContext.tsx';
import { UserRole } from './types.ts';
import ProtectedRoute from './components/auth/ProtectedRoute.tsx';

// Page Imports
import LandingPage from './pages/LandingPage.tsx';
import DevRoleSwitcher from './components/DevRoleSwitcher.tsx';
import ProductsPage from './pages/ProductsPage.tsx';
import IndustriesPage from './pages/IndustriesPage.tsx';
import WhyEvaluifyPage from './pages/WhyEvaluifyPage.tsx';
import IntegrationsPage from './pages/IntegrationsPage.tsx';
import CustomersPage from './pages/CustomersPage.tsx';
import PricingPage from './pages/PricingPage.tsx';
import AboutUsPage from './pages/AboutUsPage.tsx';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage.tsx';
import TermsOfServicePage from './pages/TermsOfServicePage.tsx';


// Dashboard Imports
import TeacherDashboard from './pages/TeacherDashboard.tsx';
import CorporateDashboard from './pages/CorporateDashboard.tsx';
import TrainingCompanyDashboard from './pages/TrainingCompanyDashboard.tsx';
import AdminDashboard from './pages/AdminDashboard.tsx';
import ExamineeDashboard from './pages/ExamineeDashboard.tsx';
import ExamTaker from './pages/ExamTaker.tsx';

// Teacher-specific pages that are not duplicated
import TeacherAssessmentsPage from './pages/TeacherAssessmentsPage.tsx';
import LiveInterviewPage from './pages/LiveInterviewPage.tsx';
import TeacherCandidatesPage from './pages/TeacherCandidatesPage.tsx';
import TeacherAIToolsPage from './pages/TeacherAIToolsPage.tsx';
import TeacherReportsPage from './pages/TeacherReportsPage.tsx';
import TestBuilderPage from './pages/TestBuilderPage.tsx';

// Examinee pages
import ExamineeResultsPage from './pages/ExamineeResultsPage.tsx';
import ExamineeExamReviewPage from './pages/ExamineeExamReviewPage.tsx';

// Admin pages
import AdminUserManagementPage from './pages/AdminUserManagementPage.tsx';
import AdminExamManagementPage from './pages/AdminExamManagementPage.tsx';
import AdminCategoryManagementPage from './pages/AdminCategoryManagementPage.tsx';
import AdminSettingsPage from './pages/AdminSettingsPage.tsx';

// --- REFACTORED SHARED PAGES ---
import ExamResultsPage from './pages/shared/ExamResultsPage.tsx';
import ExamineeResultPage from './pages/shared/ExamineeResultPage.tsx';
import ProctoringReportPage from './pages/shared/ProctoringReportPage.tsx';
import QuestionBankPage from './pages/shared/QuestionBankPage.tsx';
import AnalyticsPage from './pages/shared/AnalyticsPage.tsx';
import InterviewsPage from './pages/shared/InterviewsPage.tsx';


// Theme and Language Context
export type Language = 'en' | 'ar';
interface Theme {
    platformName: string;
    primaryColor: string;
}
interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}
interface LanguageContextType {
    lang: Language;
    toggleLang: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const ThemeAndLanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>({ platformName: 'evaluify', primaryColor: '#10b981' });
    const [lang, setLang] = useState<Language>('en');
    
    const toggleLang = () => setLang(prev => (prev === 'en' ? 'ar' : 'en'));

    useEffect(() => {
        document.documentElement.lang = lang;
    }, [lang]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            <LanguageContext.Provider value={{ lang, toggleLang }}>
                {children}
            </LanguageContext.Provider>
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within a ThemeProvider');
    return context;
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
    return context;
};


// --- ROUTING LOGIC COMPONENTS ---

const DashboardRedirector: React.FC = () => {
    const { userRole } = useAuth();
    switch (userRole) {
        case UserRole.Teacher: return <TeacherDashboard />;
        case UserRole.Corporate: return <CorporateDashboard />;
        case UserRole.TrainingCompany: return <TrainingCompanyDashboard />;
        case UserRole.Admin: return <AdminDashboard />;
        case UserRole.Examinee: return <Navigate to="/examinee" replace />;
        default: return <Navigate to="/" replace />;
    }
};

const QuestionBankRouter: React.FC = () => {
    const { userRole } = useAuth();
    switch (userRole) {
        case UserRole.Teacher:
            return <QuestionBankPage pageTitle="My Question Bank" description="Manage your personal question bank for creating custom exams." ownerId="teacher-1" />;
        case UserRole.Corporate:
            return <QuestionBankPage pageTitle="Company Question Bank" description="Manage your company's private question bank for candidate assessments." ownerId="corp-1" />;
        case UserRole.TrainingCompany:
            return <QuestionBankPage pageTitle="Curriculum Question Bank" description="Manage questions for your training courses and certifications." ownerId="training-1" />;
        // Admin is handled separately due to different URL
        default:
            return <Navigate to="/" replace />;
    }
}

const AnalyticsRouter: React.FC = () => {
    const { userRole } = useAuth();
    switch (userRole) {
        case UserRole.Teacher:
            return <AnalyticsPage pageTitle="Performance Analytics" description="Analyze student performance trends, question difficulty, and overall exam effectiveness." />;
        case UserRole.Corporate:
            return <AnalyticsPage pageTitle="Hiring Analytics" description="Analyze candidate performance, assessment effectiveness, and hiring pipeline data." />;
        case UserRole.TrainingCompany:
            return <AnalyticsPage pageTitle="Trainee Analytics" description="Analyze trainee progress, course effectiveness, and certification rates." />;
        default:
            return <Navigate to="/" replace />;
    }
}

const InterviewsRouter: React.FC = () => {
    const { userRole } = useAuth();
    switch (userRole) {
        case UserRole.Teacher:
            return <InterviewsPage pageTitle="Interview Management" />;
        case UserRole.Corporate:
            return <InterviewsPage pageTitle="Candidate Interviews" />;
        default:
            return <Navigate to="/" replace />;
    }
}


const AppRoutes: React.FC = () => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return (
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/industries" element={<IndustriesPage />} />
                <Route path="/why-evaluify" element={<WhyEvaluifyPage />} />
                <Route path="/integrations" element={<IntegrationsPage />} />
                <Route path="/customers" element={<CustomersPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/about-us" element={<AboutUsPage />} />
                <Route path="/privacy" element={<PrivacyPolicyPage />} />
                <Route path="/terms" element={<TermsOfServicePage />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        );
    }

    return (
        <Routes>
            <Route path="/" element={<DashboardRedirector />} />
            
            {/* Teacher Only Routes */}
            <Route element={<ProtectedRoute allowedRoles={[UserRole.Teacher]} />}>
                <Route path="/candidates" element={<TeacherCandidatesPage />} />
                <Route path="/test-builder" element={<TestBuilderPage />} />
                <Route path="/ai-tools" element={<TeacherAIToolsPage />} />
                <Route path="/reports" element={<TeacherReportsPage />} />
            </Route>

            {/* Shared Interview Routes (Teacher, Corporate) */}
            <Route element={<ProtectedRoute allowedRoles={[UserRole.Teacher, UserRole.Corporate]} />}>
                <Route path="/interviews" element={<InterviewsRouter />} />
                <Route path="/interviews/:interviewId" element={<LiveInterviewPage />} />
            </Route>
            
            {/* Shared Routes (Teacher, Corp, Training) */}
            <Route element={<ProtectedRoute allowedRoles={[UserRole.Teacher, UserRole.Corporate, UserRole.TrainingCompany]} />}>
                <Route path="/assessments" element={<TeacherAssessmentsPage />} />
                <Route path="/results" element={<ExamResultsPage />} />
                <Route path="/results/:resultId" element={<ExamineeResultPage />} />
                <Route path="/results/:resultId/proctoring" element={<ProctoringReportPage />} />
                <Route path="/analytics" element={<AnalyticsRouter />} />
                <Route path="/question-bank" element={<QuestionBankRouter />} />
            </Route>

            {/* Admin Only Routes */}
            <Route element={<ProtectedRoute allowedRoles={[UserRole.Admin]} />}>
                <Route path="/users" element={<AdminUserManagementPage />} />
                <Route path="/exams" element={<AdminExamManagementPage />} />
                <Route path="/questions" element={<QuestionBankPage pageTitle="Master Question Bank" description="Manage all questions on the platform, including user-submitted and marketplace questions." ownerId="admin-1" />} />
                <Route path="/categories" element={<AdminCategoryManagementPage />} />
                <Route path="/settings" element={<AdminSettingsPage />} />
            </Route>

            {/* Examinee Only Routes */}
            <Route element={<ProtectedRoute allowedRoles={[UserRole.Examinee]} />}>
                <Route path="/examinee" element={<ExamineeDashboard />} />
                <Route path="/examinee/exam/:examId" element={<ExamTaker />} />
                <Route path="/examinee/results" element={<ExamineeResultsPage />} />
                <Route path="/examinee/result/:resultId" element={<ExamineeExamReviewPage />} />
            </Route>
            
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}

const App: React.FC = () => {
    const { lang } = useLanguage();
    return (
        <div dir={lang === 'ar' ? 'rtl' : 'ltr'}>
           <AppRoutes />
        </div>
    );
};

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};


const AppWrapper: React.FC = () => {
    return (
        <HashRouter>
            <ScrollToTop />
            <DarkModeProvider>
                <AuthProvider>
                    <NotificationProvider>
                        <ThemeAndLanguageProvider>
                            <App />
                            <DevRoleSwitcher />
                        </ThemeAndLanguageProvider>
                    </NotificationProvider>
                </AuthProvider>
            </DarkModeProvider>
        </HashRouter>
    );
};

export default AppWrapper;
