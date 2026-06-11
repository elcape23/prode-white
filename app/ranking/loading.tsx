import { Skeleton } from "@/components/ui/skeleton";

export default function RankingLoading() {
  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-[16px] border border-border bg-card drop-shadow-[0px_4px_6px_rgba(0,0,0,0.15)]">
        {/* Encabezado del grupo */}
        <div className="flex items-center gap-3 bg-surface-sunken p-3">
          <Skeleton className="h-[37px] w-6" />
          <Skeleton className="h-5 w-24" />
        </div>

        {/* Filas */}
        <div className="divide-y divide-border bg-card">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-3">
              <Skeleton className="size-6 rounded-full" />
              <Skeleton className="h-5 flex-1 max-w-[160px]" />
              <Skeleton className="h-5 w-10" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
