
import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import useNavLinks from '../hooks/useNavLinks';

const QuestionBankPage: React.FC = () => {
    const navLinks = useNavLinks();

    return (
        <DashboardLayout
            navLinks={navLinks}
            pageTitle="My Question Bank"
        >
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">My Questions</h3>
                <p className="text-slate-600 dark:text-slate-400">
                    Here you can create, edit, and manage your personal question bank. These questions can be used to build your custom exams.
                </p>
                {/* Question Bank content would go here */}
            </div>
        </DashboardLayout>
    );
};

export default QuestionBankPage;
