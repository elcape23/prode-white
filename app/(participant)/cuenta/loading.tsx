import { HeaderSkeleton } from "@/components/layout/header-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function CuentaLoading() {
  return (
    <div className="flex flex-1 flex-col bg-background">
      <HeaderSkeleton />

      <main className="flex flex-1 flex-col p-5">
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0px_4px_6px_0px_rgba(0,0,0,0.15)]">
          {/* Encabezado de la tarjeta */}
          <div className="flex items-center bg-muted px-3 py-3">
            <Skeleton className="h-5 w-24" />
          </div>

          {/* Cuerpo */}
          <div className="flex flex-col gap-1 bg-card py-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 flex-1 max-w-[140px]" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
