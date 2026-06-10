import { GlobeIcon } from "hugeicons-react";
import { flagSrc, teamNameEs, teamNameShort } from "@/lib/flags";

const TZ = "America/Argentina/Buenos_Aires";

/** Etiqueta de la cabecera: "Grupo A" para fase de grupos, o el nombre de la
 *  ronda de eliminación. Replica la lógica de la pantalla de Pronósticos. */
function sectionLabel(round: string): string {
  if (/grupo/i.test(round)) {
    return round.replace(/^\s*grupos\s*[–-]\s*/i, "").trim() || round;
  }
  const map: Record<string, string> = { LAST_32: "16vos", LAST_16: "8vos" };
  return map[round] ?? round;
}

/** "11 de Junio" (mes capitalizado). */
function formatDay(d: Date): string {
  const s = new Intl.DateTimeFormat("es-AR", {
    day: "numeric",
    month: "long",
    timeZone: TZ,
  }).format(d);
  return s.replace(/de (\p{L})/u, (_, c: string) => `de ${c.toUpperCase()}`);
}

/** "16:00" */
function formatHour(d: Date): string {
  return new Intl.DateTimeFormat("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: TZ,
  }).format(d);
}

export type FeaturedMatch = {
  id: string;
  round: string;
  homeTeam: string;
  awayTeam: string;
  scheduledAt: Date;
  homeScore: number | null;
  awayScore: number | null;
};

/** Bandera de la selección. Cae al ícono genérico si no se reconoce. */
function Flag({ team }: { team: string }) {
  const src = flagSrc(team);
  return (
    <div className="flex h-6 w-9 shrink-0 items-center justify-center overflow-hidden rounded-br-lg rounded-tl-lg border border-[color:var(--color-neutral-300)] bg-muted">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={`Bandera de ${team}`}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      ) : (
        <GlobeIcon size={12} className="text-fg-tertiary" strokeWidth={1.5} />
      )}
    </div>
  );
}

/** Casillero de marcador (solo lectura). 40px en la card destacada, 32px en
 *  las compactas. */
function Score({ value, sm = false }: { value: number | null; sm?: boolean }) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-card text-center font-medium tabular-nums text-foreground ${
        sm ? "size-8 text-sm" : "size-10 text-base"
      }`}
    >
      {value ?? 0}
    </div>
  );
}

/** Cabecera con el logo del torneo y el grupo / ronda. */
function GroupHeading({ round }: { round: string }) {
  return (
    <div className="flex items-center gap-3 bg-[#F8F8F8] p-3">
      <div className="flex h-9 w-6 shrink-0 items-center justify-center overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/logo.svg" alt="" className="h-full w-auto object-contain" />
      </div>
      <span className="flex-1 text-sm font-semibold tracking-tight text-foreground">
        {sectionLabel(round)}
      </span>
    </div>
  );
}

/**
 * Card destacada (ancho completo) para el próximo partido o partido en juego.
 * Diseño Figma node 263:11337 (estado "on-match").
 */
export function FeaturedMatchCard({ match }: { match: FeaturedMatch }) {
  const home = teamNameEs(match.homeTeam);
  const away = teamNameEs(match.awayTeam);

  return (
    <div className="col-span-2 flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[0px_4px_12px_0px_rgba(0,0,0,0.15)]">
      <GroupHeading round={match.round} />
      <div className="flex flex-col items-center gap-3 py-3">
        <div className="flex w-full items-center gap-3 px-3">
          {/* Equipo local */}
          <div className="flex min-w-0 flex-1 items-center justify-end gap-1">
            <p className="min-w-0 flex-1 truncate text-right text-[13px] font-medium tracking-tight text-foreground">
              {teamNameShort(home)}
            </p>
            <Flag team={match.homeTeam} />
          </div>

          {/* Marcador */}
          <div className="flex shrink-0 items-center gap-1">
            <Score value={match.homeScore} />
            <span className="text-base font-medium text-foreground">-</span>
            <Score value={match.awayScore} />
          </div>

          {/* Equipo visitante */}
          <div className="flex min-w-0 flex-1 items-center gap-1">
            <Flag team={match.awayTeam} />
            <p className="min-w-0 flex-1 truncate text-left text-[13px] font-medium tracking-tight text-foreground">
              {teamNameShort(away)}
            </p>
          </div>
        </div>

        {/* Día y hora */}
        <div className="flex w-full items-center justify-center gap-1 text-[13px] tracking-tight text-fg-secondary">
          <span>{formatDay(match.scheduledAt)}</span>
          <span>{formatHour(match.scheduledAt)}</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Card compacta (media columna) usada cuando hay más de un partido por
 * comenzar. Diseño Figma node 263:11868 (estado "on-matches").
 */
export function CompactMatchCard({ match }: { match: FeaturedMatch }) {
  const home = teamNameEs(match.homeTeam);
  const away = teamNameEs(match.awayTeam);

  return (
    <div className="flex flex-col self-start overflow-hidden rounded-2xl border border-border bg-card shadow-[0px_4px_12px_0px_rgba(0,0,0,0.15)]">
      <GroupHeading round={match.round} />
      <div className="flex flex-col gap-2 py-3">
        <div className="flex flex-col gap-2 px-3">
          {/* Equipo local */}
          <div className="flex items-center gap-1">
            <div className="flex min-w-0 flex-1 items-center justify-end gap-1">
              <p className="min-w-0 flex-1 truncate text-right text-[13px] font-medium tracking-tight text-foreground">
                {teamNameShort(home)}
              </p>
              <Flag team={match.homeTeam} />
            </div>
            <Score value={match.homeScore} sm />
          </div>

          {/* Equipo visitante */}
          <div className="flex items-center gap-1">
            <div className="flex min-w-0 flex-1 items-center justify-end gap-1">
              <p className="min-w-0 flex-1 truncate text-right text-[13px] font-medium tracking-tight text-foreground">
                {teamNameShort(away)}
              </p>
              <Flag team={match.awayTeam} />
            </div>
            <Score value={match.awayScore} sm />
          </div>
        </div>

        {/* Día y hora */}
        <div className="flex items-center justify-end gap-0.5 px-3 text-[13px] tracking-tight text-fg-secondary">
          <span>{formatDay(match.scheduledAt)}</span>
          <span>{formatHour(match.scheduledAt)}</span>
        </div>
      </div>
    </div>
  );
}
