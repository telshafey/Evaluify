
import React from 'react';
import Skeleton from './Skeleton.tsx';

const RecentActivitySkeleton: React.FC = () => (
  <div className="space-y-4">
    <Skeleton className="h-6 w-1/2 mb-4" />
    {[...Array(4)].map((_, i) => (
      <div key={i} className="flex items-center">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="ml-4 flex-grow">
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <Skeleton className="h-6 w-12" />
      </div>
    ))}
  </div>
);

export default RecentActivitySkeleton;
