// app/components/CurrencyBoardSkeleton.tsx
export default function CurrencyBoardSkeleton() {
  return (
    <div className="bg-white py-1 antialiased dark:bg-zinc-900 md:py-2 h-full rounded-lg overflow-hidden animate-pulse">
      <div className="mx-auto max-w-full-xl px-4 2xl:px-4 mb-4">
        {/* Header Skeleton */}
        <div className="mb-2 md:mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64" />
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-40" />
          </div>
        </div>

        {/* Cards Grid Skeleton */}
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="p-6 rounded-lg bg-gray-100 dark:bg-gray-800 space-y-3"
            >
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}