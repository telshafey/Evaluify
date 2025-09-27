import React from 'react';
import { SpinnerIcon } from './icons.tsx';

const FullPageSpinner: React.FC = () => (
  <div className="flex items-center justify-center h-screen w-screen bg-slate-100 dark:bg-slate-900">
    <SpinnerIcon className="w-12 h-12 text-primary-500" />
  </div>
);

export default FullPageSpinner;
