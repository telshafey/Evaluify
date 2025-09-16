


import React from 'react';
// Fix: Added import for UserRole.
import { UserRole } from '../types';
import { BookOpenIcon, UsersIcon, BuildingIcon, BriefcaseIcon, ShieldCheckIcon } from './icons';
import { useTheme, useLanguage } from '../App';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRole: (role: UserRole) => void;
}

const getTranslations = (platformName: string) => ({
    en: {
        title: "Sign In to Your Workspace",
        forOrganizations: "For Organizations & Institutions",
        forIndividuals: "For Individuals",
        
        school: "School / University",
        schoolDesc: "Manage courses and track student progress.",
        corporate: "Corporate / Business",
        corporateDesc: "Assess candidates and develop teams.",
        trainingCenter: "Training Center",
        trainingCenterDesc: "Manage curricula and assess trainees.",
        
        instructor: "Instructor / Teacher",
        instructorDesc: "Create exams and assess learners.",
        student: `${platformName} User`,
        studentDesc: "Take assessments and earn certificates.",
        
        admin: "Platform Admin",
        adminDesc: "Manage the entire platform.",
    },
    ar: {
        title: "اختر دورك لتسجيل الدخول",
        forOrganizations: "للمنظمات والمؤسسات",
        forIndividuals: "للأفراد",
        
        school: "مدرسة / جامعة",
        schoolDesc: "إدارة المقررات الدراسية وتتبع أداء الطلاب.",
        corporate: "شركة / أعمال",
        corporateDesc: "تقييم المرشحين للوظائف وتطوير فرق العمل.",
        trainingCenter: "مركز تدريب",
        trainingCenterDesc: "إدارة المناهج التدريبية وتقييم المتدربين.",
        
        instructor: "مدرب / معلم",
        instructorDesc: "إنشاء الاختبارات وتقييم أداء المتعلمين.",
        student: `مستخدم ${platformName}`,
        studentDesc: "إجراء التقييمات والحصول على الشهادات.",
        
        admin: "مسؤول المنصة",
        adminDesc: "إدارة المنصة بأكملها.",
    }
});

const RoleCard: React.FC<{
    onClick: () => void;
    icon: React.ElementType;
    title: string;
    description: string;
    colorClasses: string;
}> = ({ onClick, icon: Icon, title, description, colorClasses }) => (
    <button
        type="button"
        onClick={onClick}
        className={`group relative h-48 bg-white dark:bg-slate-900 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden transform hover:-translate-y-1 w-full text-left`}
    >
        <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses} opacity-80 group-hover:opacity-95 transition-opacity duration-300`}></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full p-4 text-white text-center">
            <Icon className="w-16 h-16 mb-2 transition-transform duration-300 group-hover:scale-110" />
            <h3 className="text-2xl font-bold">{title}</h3>
            <p className="mt-1 text-sm">{description}</p>
        </div>
    </button>
);


const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSelectRole }) => {
  const { theme } = useTheme();
  const { lang } = useLanguage();
  const t = getTranslations(theme.platformName)[lang];

  const handleRoleSelect = (role: UserRole) => {
    onSelectRole(role);
    onClose();
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-labelledby="login-modal-title" className="bg-slate-100 dark:bg-slate-800 rounded-2xl shadow-2xl p-8 w-full max-w-5xl" onClick={e => e.stopPropagation()}>
        <h2 id="login-modal-title" className="text-3xl font-bold mb-6 text-center text-slate-800 dark:text-slate-100">{t.title}</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
                <h3 className="text-lg font-semibold text-center text-slate-600 dark:text-slate-300 mb-4">{t.forOrganizations}</h3>
                <div className="grid grid-cols-1 gap-6">
                    <RoleCard onClick={() => handleRoleSelect(UserRole.Corporate)} icon={BriefcaseIcon} title={t.corporate} description={t.corporateDesc} colorClasses="from-primary-700 to-primary-900" />
                    <RoleCard onClick={() => handleRoleSelect(UserRole.TrainingCompany)} icon={BuildingIcon} title={t.trainingCenter} description={t.trainingCenterDesc} colorClasses="from-purple-600 to-purple-800" />
                    <RoleCard onClick={() => handleRoleSelect(UserRole.Teacher)} icon={BookOpenIcon} title={t.school} description={t.schoolDesc} colorClasses="from-teal-600 to-teal-800" />
                </div>
            </div>
            <div>
                 <h3 className="text-lg font-semibold text-center text-slate-600 dark:text-slate-300 mb-4">{t.forIndividuals}</h3>
                 <div className="grid grid-cols-1 gap-6">
                    <RoleCard onClick={() => handleRoleSelect(UserRole.Teacher)} icon={UsersIcon} title={t.instructor} description={t.instructorDesc} colorClasses="from-sky-600 to-sky-800" />
                    <RoleCard onClick={() => handleRoleSelect(UserRole.Examinee)} icon={UsersIcon} title={t.student} description={t.studentDesc} colorClasses="from-green-600 to-green-800" />
                 </div>
                 <div className="mt-6">
                     <RoleCard onClick={() => handleRoleSelect(UserRole.Admin)} icon={ShieldCheckIcon} title={t.admin} description={t.adminDesc} colorClasses="from-red-600 to-red-800" />
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;