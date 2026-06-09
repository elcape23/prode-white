import Link from "next/link";

type HeaderProps = {
  /** Pronósticos cargados (para la barra de progreso). Opcional. */
  filled?: number;
  /** Total de pronósticos posibles. Opcional. */
  total?: number;
  /** Nombre del participante. Si se pasa y no hay progreso, muestra el avatar. */
  name?: string;
};

/** Iniciales a partir del nombre (máx. 2 letras), p. ej. "Juan Ledesma" → "JL". */
function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const letters = parts.slice(0, 2).map((p) => p[0]);
  return letters.join("").toUpperCase();
}

/**
 * Barra superior de la app: marca + progreso o avatar.
 * El avatar enlaza a la página de cuenta (/cuenta). La barra de progreso solo
 * se muestra en la pantalla de Pronósticos (cuando se pasan filled/total).
 */
export function Header({ filled, total, name }: HeaderProps) {
  const showProgress = typeof filled === "number" && typeof total === "number";
  const pct = showProgress && total! > 0 ? Math.round((filled! / total!) * 100) : 0;
  const showAvatar = !showProgress && !!name;

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

        {showAvatar && (
          <Link
            href="/cuenta"
            aria-label="Mi cuenta"
            className="flex size-10 items-center justify-center rounded-full border border-border bg-fill-brand text-fg-on-brand transition-opacity hover:opacity-90"
          >
            <span className="text-base font-semibold leading-5 tracking-tight">
              {initials(name!)}
            </span>
          </Link>
        )}
      </div>
    </header>
  );
}
