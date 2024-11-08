// app/components/CardSkeleton.tsx
import React from 'react';

const CardSkeleton: React.FC = () => (
  <div className="bg-gray-200 dark:bg-gray-700 rounded-md shadow-md animate-pulse h-full w-full p-4 space-y-2">
    <div className="h-6 w-3/4 bg-gray-300 dark:bg-gray-600 rounded"></div>
    <div className="h-4 w-1/2 bg-gray-300 dark:bg-gray-600 rounded"></div>
    <div className="h-24 bg-gray-300 dark:bg-gray-600 rounded"></div>
  </div>
);

export default CardSkeleton;
