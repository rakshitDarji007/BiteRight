import React from 'react';

const SkeletonCard = () => (
  <div className="apple-card mb-6 animate-pulse">
    <div className="h-6 bg-gray-300 rounded-md w-1/3 mb-4"></div>
    <div className="space-y-4">
      <div>
        <div className="h-4 bg-gray-300 rounded-md w-1/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded-md w-full"></div>
      </div>
      <div>
        <div className="h-4 bg-gray-300 rounded-md w-1/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded-md w-3/4"></div>
      </div>
      <div>
        <div className="h-4 bg-gray-300 rounded-md w-1/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded-md w-5/6"></div>
      </div>
    </div>
  </div>
);

const SkeletonPlan = () => (
  <>
    <SkeletonCard />
    <SkeletonCard />
  </>
);

export default SkeletonPlan;