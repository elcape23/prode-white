import { Skeleton } from "@/components/ui/skeleton";

/**
 * Placeholder de la barra superior fija, usado en los estados de carga
 * (loading.tsx) mientras el server component de la página resuelve. Reproduce
 * la geometría del `Header` real para que la transición no "salte".
 */
export function HeaderSkeleton() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex h-[100px] w-full items-end justify-between border-b border-border bg-card px-5 py-4">
      <div className="flex flex-col justify-center text-fg-brand">
        <p className="font-display text-xl font-black leading-6 tracking-tight">2O26</p>
        <p className="font-display text-base font-black leading-4 tracking-wide">PRODE WHITE</p>
      </div>

      <Skeleton className="size-10 rounded-full" />
    </header>
  );
}
