export function ProductCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="aspect-square bg-gray-200 dark:bg-gray-700" />
      
      {/* Content skeleton */}
      <div className="p-6 space-y-4">
        {/* Title */}
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        
        {/* Description */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
        </div>
        
        {/* Features */}
        <div className="flex gap-4">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24" />
        </div>
        
        {/* Price */}
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32" />
        
        {/* Button */}
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    </div>
  );
}

export function CategoryCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="aspect-video bg-gray-200 dark:bg-gray-700" />
      
      {/* Content skeleton */}
      <div className="p-6 space-y-3">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
      </div>
    </div>
  );
}

export function CompactCategoryCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-4 animate-pulse">
      <div className="flex items-center space-y-3">
        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl" />
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        </div>
      </div>
    </div>
  );
}
