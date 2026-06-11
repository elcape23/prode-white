import { HeaderSkeleton } from "@/components/layout/header-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function BonusLoading() {
  return (
    <div className="flex flex-1 flex-col bg-background">
      <HeaderSkeleton />

      <div className="flex flex-1 flex-col gap-6 p-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-12 w-full rounded-md" />
          </div>
        ))}
        <Skeleton className="h-12 w-full rounded-md" />
      </div>
    </div>
  );
}
