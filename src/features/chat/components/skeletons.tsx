import { Skeleton } from '@/components/ui/skeleton';

export function SkeletonMessages() {
  return (
    <div className="space-y-3">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-10 w-1/2 rounded-lg" />
      ))}
    </div>
  );
}
