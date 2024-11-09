// app/components/SettingsFormSkeleton.tsx
import React from 'react';

const SettingsFormSkeleton = () => {
  const SettingCardSkeleton = () => (
    <div className="bg-white dark:bg-background-alternativedark p-6 rounded-lg animate-pulse">

      <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-4" />

      <div className="space-y-4">
        <div>
          <div className="h-5 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-1" />
          <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
          <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded" />
        </div>

        <div>
          <div className="h-5 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-1" />
          <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
          <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-8xl mx-auto p-2">
      <div className="bg-white dark:bg-background-alternativedark shadow-sm rounded-lg">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex space-x-1">
            {[1, 2].map((tab) => (
              <div
                key={tab}
                className="w-32 h-12 bg-gray-200 dark:bg-gray-700 rounded-t-lg animate-pulse"
              />
            ))}
          </div>
        </div>

        <div className="px-0.5 py-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2].map((card) => (
              <SettingCardSkeleton key={card} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsFormSkeleton;