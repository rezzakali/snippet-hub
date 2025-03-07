import { Skeleton } from '@/components/ui/skeleton';

export default function SnippetCardSkeleton() {
  return (
    <div className="p-4 border rounded-lg shadow-sm animate-pulse">
      {/* Title */}
      <Skeleton className="h-6 w-3/4 mb-2" />
      {/* Tags */}
      <div className="flex gap-2 mb-4">
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
      {/* Description */}
      <Skeleton className="h-4 w-full mb-4" />

      {/* Code Block */}
      <Skeleton className="h-24 w-full rounded-md mb-4" />

      {/* Bottom Row */}
      <div className="flex justify-between">
        <Skeleton className="h-4 w-20" />
        <div className="flex gap-2">
          <Skeleton className="h-4 w-6" />
          <Skeleton className="h-4 w-6" />
        </div>
      </div>
      {/* share */}
      <Skeleton className="h-4 w-6 mt-2" />
    </div>
  );
}
