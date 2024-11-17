export function SkeletonTask() {
  return (
    <div className="bg-white p-4 rounded-lg shadow animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          {/* Title skeleton */}
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
          {/* Description skeleton */}
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          {/* Sets and reps skeleton */}
          <div className="h-4 bg-gray-200 rounded w-1/4 mt-2"></div>
        </div>
        {/* Action buttons skeleton */}
        <div className="flex items-center space-x-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-10 h-10 bg-gray-200 rounded-full"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
