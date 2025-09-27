
import React from 'react';
import Skeleton from './Skeleton.tsx';

const StatCardSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
    <div className="flex items-center justify-between">
      <div>
        <Skeleton className="h-4 w-24 mb-3" />
        <Skeleton className="h-8 w-16 mb-2" />
        <Skeleton className="h-4 w-28" />
      </div>
      <Skeleton className="w-16 h-16 rounded-2xl" />
    </div>
  </div>
);

export default StatCardSkeleton;
