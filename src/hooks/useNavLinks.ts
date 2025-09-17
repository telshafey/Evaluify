import { useAuth } from '../contexts/AuthContext.tsx';
import { UserRole } from '../types.ts';
import { useLanguage } from '../App.tsx';
import { 
    ChartBarIcon, BookOpenIcon, UsersIcon, CheckCircleIcon,
    DocumentTextIcon, BuildingIcon, BriefcaseIcon, SettingsIcon, WrenchIcon,
    VideoCameraIcon, UserGroupIcon, DocumentReportIcon, SparklesIcon,
} from '../components/icons.tsx';

interface NavLink {
    path: string;
    icon: React.FC<{ className?: string }>;
    label: string;
}

const navTranslations = {
    en: {
        dashboard: 'Dashboard',
        assessments: 'Assessments',
        interviews: 'Interviews',
        candidates: 'Candidates',
        testBuilder: 'Test Builder',
        aiTools: 'AI Tools',
        reports: 'Reports',
        questionBank: 'Question Bank',
        analytics: 'Analytics',
        results: 'Results',
        companyQBank: 'Company Q-Bank',
        courses: 'Courses',
        traineeResults: 'Trainee Results',
        curriculumQBank: 'Curriculum Q-Bank',
        userManagement: 'User Management',
        examManagement: 'Exam Management',
        masterQBank: 'Master Q-Bank',
        categories: 'Categories',
        settings: 'Settings',
        examineeDashboard: 'Dashboard',
        myResults: 'My Results',
    },
    ar: {
        dashboard: 'لوحة التحكم',
        assessments: 'التقييمات',
        interviews: 'المقابلات',
        candidates: 'المرشحون',
        testBuilder: 'منشئ الاختبارات',
        aiTools: 'أدوات الذكاء الاصطناعي',
        reports: 'التقارير',
        questionBank: 'بنك الأسئلة',
        analytics: 'التحليلات',
        results: 'النتائج',
        companyQBank: 'بنك أسئلة الشركة',
        courses: 'الدورات',
        traineeResults: 'نتائج المتدربين',
        curriculumQBank: 'بنك أسئلة المناهج',
        userManagement: 'إدارة المستخدمين',
        examManagement: 'إدارة الاختبارات',
        masterQBank: 'بنك الأسئلة الرئيسي',
        categories: 'الفئات',
        settings: 'الإعدادات',
        examineeDashboard: 'لوحة التحكم',
        myResults: 'نتائجي',
    }
};


const useNavLinks = (): NavLink[] => {
    const { userRole } = useAuth();
    const { lang } = useLanguage();
    const t = navTranslations[lang];

    const teacherLinks: NavLink[] = [
        { path: '/', icon: ChartBarIcon, label: t.dashboard },
        { path: '/assessments', icon: DocumentTextIcon, label: t.assessments },
        { path: '/interviews', icon: VideoCameraIcon, label: t.interviews },
        { path: '/candidates', icon: UserGroupIcon, label: t.candidates },
        { path: '/test-builder', icon: WrenchIcon, label: t.testBuilder },
        { path: '/ai-tools', icon: SparklesIcon, label: t.aiTools },
        { path: '/reports', icon: DocumentReportIcon, label: t.reports },
        { path: '/question-bank', icon: BookOpenIcon, label: t.questionBank },
        { path: '/analytics', icon: ChartBarIcon, label: t.analytics },
    ];

    const corporateLinks: NavLink[] = [
        { path: '/', icon: ChartBarIcon, label: t.dashboard },
        { path: '/assessments', icon: DocumentTextIcon, label: t.assessments },
        { path: '/interviews', icon: VideoCameraIcon, label: t.interviews },
        { path: '/results', icon: CheckCircleIcon, label: t.results },
        { path: '/question-bank', icon: BriefcaseIcon, label: t.companyQBank },
        { path: '/analytics', icon: ChartBarIcon, label: t.analytics },
    ];

    const trainingLinks: NavLink[] = [
        { path: '/', icon: ChartBarIcon, label: t.dashboard },
        { path: '/assessments', icon: DocumentTextIcon, label: t.courses },
        { path: '/results', icon: CheckCircleIcon, label: t.traineeResults },
        { path: '/question-bank', icon: BuildingIcon, label: t.curriculumQBank },
        { path: '/analytics', icon: ChartBarIcon, label: t.analytics },
    ];

    const adminLinks: NavLink[] = [
        { path: '/', icon: ChartBarIcon, label: t.dashboard },
        { path: '/users', icon: UsersIcon, label: t.userManagement },
        { path: '/exams', icon: DocumentTextIcon, label: t.examManagement },
        { path: '/questions', icon: BookOpenIcon, label: t.masterQBank },
        { path: '/categories', icon: BriefcaseIcon, label: t.categories },
        { path: '/settings', icon: SettingsIcon, label: t.settings },
    ];

    const examineeLinks: NavLink[] = [
        { path: '/examinee', icon: ChartBarIcon, label: t.examineeDashboard },
        { path: '/examinee/results', icon: CheckCircleIcon, label: t.myResults },
    ];
    
    switch (userRole) {
        case UserRole.Teacher:
            return teacherLinks;
        case UserRole.Corporate:
            return corporateLinks;
        case UserRole.TrainingCompany:
            return trainingLinks;
        case UserRole.Admin:
            return adminLinks;
        case UserRole.Examinee:
            return examineeLinks;
        default:
            return [];
    }
};

export default useNavLinks;