import React from 'react';
import SitePageLayout from './SitePageLayout';

interface LegalPageLayoutProps {
    title: string;
    lastUpdated: string;
    children: React.ReactNode;
}

const LegalPageLayout: React.FC<LegalPageLayoutProps> = ({ title, lastUpdated, children }) => (
    <SitePageLayout>
        <main className="bg-white dark:bg-slate-900">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <header className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100">{title}</h1>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{lastUpdated}</p>
                </header>
                <article className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300">
                    {children}
                </article>
            </div>
        </main>
    </SitePageLayout>
);

export default LegalPageLayout;
