import { HeaderSkeleton } from "@/components/layout/header-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

function MatchRowSkeleton() {
  return (
    <div className="flex items-center justify-between gap-3 px-1 py-2">
      <Skeleton className="h-5 w-28" />
      <Skeleton className="h-8 w-16 rounded-md" />
      <Skeleton className="h-5 w-28" />
    </div>
  );
}

export default function PronosticosLoading() {
  return (
    <div className="flex flex-1 flex-col items-center bg-background">
      <HeaderSkeleton />

      <div className="w-full max-w-lg flex-1 space-y-6 p-5">
        {[0, 1].map((section) => (
          <div key={section} className="space-y-3">
            <Skeleton className="h-6 w-32" />
            <div className="overflow-hidden rounded-md border border-border bg-card p-2">
              <MatchRowSkeleton />
              <MatchRowSkeleton />
              <MatchRowSkeleton />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
