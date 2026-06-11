import { HeaderSkeleton } from "@/components/layout/header-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="flex flex-1 flex-col bg-background">
      <HeaderSkeleton />

      <main className="grid flex-1 grid-cols-2 content-start gap-2 bg-background p-5">
        {/* Hero — posición y puntos */}
        <Skeleton className="col-span-2 h-[170px] rounded-md" />

        {/* Tiles cuadrados */}
        <Skeleton className="aspect-square rounded-md" />
        <Skeleton className="aspect-square rounded-md" />

        {/* Ranking — ancho completo */}
        <Skeleton className="col-span-2 h-[165px] rounded-md" />
      </main>
    </div>
  );
}
