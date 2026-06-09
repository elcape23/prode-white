import { logout } from "@/actions/auth";
import { Logout03Icon } from "hugeicons-react";

type HeaderProps = {
  /** Pronósticos cargados (para la barra de progreso). Opcional. */
  filled?: number;
  /** Total de pronósticos posibles. Opcional. */
  total?: number;
};

/** Barra superior de la app: marca, progreso opcional y salir. */
export function Header({ filled, total }: HeaderProps) {
  const showProgress = typeof filled === "number" && typeof total === "number";
  const pct = showProgress && total! > 0 ? Math.round((filled! / total!) * 100) : 0;

  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex h-[120px] w-full items-end justify-between border-b border-border bg-card px-5 py-4">
      <div className="flex flex-col justify-center text-fg-brand">
        <p className="font-display text-xl font-black leading-6 tracking-tight">2O26</p>
        <p className="font-display text-base font-black leading-4 tracking-wide">PRODE WHITE</p>
      </div>

      <div className="flex items-center gap-3">
        {showProgress && (
          <div className="flex flex-col items-end gap-1">
            <p className="text-[13px] tracking-tight text-fg-brand/40">
              {filled}/{total}
            </p>
            <div className="h-1.5 w-[100px] overflow-hidden rounded-full bg-fg-brand/30">
              <div
                className="h-full rounded-full bg-fg-brand transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
