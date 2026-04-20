import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-xl bg-sand-200", className)} />;
}

export function JobCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-sand-200 p-5 space-y-3">
      <div className="flex gap-3">
        <Skeleton className="w-11 h-11 rounded-xl shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-9 w-full rounded-xl" />
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-sand-200 overflow-hidden">
        <Skeleton className="h-32 rounded-none" />
        <div className="p-6 space-y-3">
          <Skeleton className="w-24 h-24 rounded-2xl -mt-12" />
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-16 w-full" />
        </div>
      </div>
    </div>
  );
}
