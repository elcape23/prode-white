"use client";

import { useEffect, useState, useTransition } from "react";
import { GlobeIcon, SquareLock02Icon } from "hugeicons-react";
import { savePrediction } from "@/actions/predictions";
import { flagSrc, teamNameEs, teamNameShort } from "@/lib/flags";

const TZ = "America/Argentina/Buenos_Aires";
const LOCK_MS = 30 * 60 * 1000;

/** ms hasta que el partido se bloquea (30 min antes del saque). */
function msUntilLock(scheduledAt: Date) {
  return new Date(scheduledAt).getTime() - LOCK_MS - Date.now();
}

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
  /** Pronóstico guardado del usuario (null si aún no cargó). */
  predHome: number | null;
  predAway: number | null;
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

/** Estado compartido del pronóstico editable de una card. */
function usePrediction(match: FeaturedMatch) {
  const [home, setHome] = useState<number | string>(match.predHome ?? "");
  const [away, setAway] = useState<number | string>(match.predAway ?? "");
  const [locked, setLocked] = useState(msUntilLock(match.scheduledAt) <= 0);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const remaining = msUntilLock(match.scheduledAt);
    // El estado inicial ya cubre "ya bloqueado"; aquí solo programamos el
    // bloqueo automático cuando todavía falta tiempo.
    if (remaining <= 0) return;
    const timer = setTimeout(() => setLocked(true), remaining);
    return () => clearTimeout(timer);
  }, [match.scheduledAt]);

  const save = (h: number | string, a: number | string) => {
    if (h === "" || a === "") return;
    const hn = Number(h);
    const an = Number(a);
    if (isNaN(hn) || isNaN(an) || hn < 0 || an < 0) return;
    startTransition(async () => {
      await savePrediction(match.id, hn, an);
    });
  };

  return { home, setHome, away, setAway, locked, isPending, save };
}

type ScoreBoxProps = {
  value: number | string;
  disabled: boolean;
  onChange: (v: string) => void;
  onCommit: () => void;
  label: string;
  sm?: boolean;
};

/** Casillero de marcador editable (input). 40px en la card destacada, 32px en
 *  las compactas. Cuando está bloqueado se muestra disabled con el pronóstico
 *  guardado. */
function ScoreBox({ value, disabled, onChange, onCommit, label, sm = false }: ScoreBoxProps) {
  return (
    <input
      type="number"
      inputMode="numeric"
      min={0}
      max={99}
      aria-label={label}
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onCommit}
      className={`shrink-0 rounded-lg border border-border bg-card text-center font-medium tabular-nums text-foreground disabled:bg-muted disabled:text-fg-disabled focus:outline-none focus:ring-2 focus:ring-fg-brand [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${
        sm ? "size-8 text-sm" : "size-10 text-base"
      }`}
    />
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

/** Indicador "Cerrado" cuando el pronóstico ya está bloqueado. */
function LockedHint() {
  return (
    <div className="flex h-3 items-center justify-center">
      <span className="flex items-center gap-1 text-[11px] text-fg-tertiary">
        <SquareLock02Icon size={12} strokeWidth={2} /> Cerrado
      </span>
    </div>
  );
}

/**
 * Card destacada (ancho completo) para el próximo partido o partido en juego.
 * El marcador es el pronóstico editable del usuario. Diseño Figma node
 * 263:11337 (estado "on-match").
 */
export function FeaturedMatchCard({ match }: { match: FeaturedMatch }) {
  const home = teamNameEs(match.homeTeam);
  const away = teamNameEs(match.awayTeam);
  const { home: h, setHome, away: a, setAway, locked, isPending, save } = usePrediction(match);

  return (
    <div className="col-span-2 flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[0px_4px_12px_0px_rgba(0,0,0,0.15)]">
      <GroupHeading round={match.round} />
      <div className={`flex flex-col items-center gap-3 py-3 ${locked ? "opacity-60" : ""}`}>
        <div className="flex w-full items-center gap-3 px-3">
          {/* Equipo local */}
          <div className="flex min-w-0 flex-1 items-center justify-end gap-1">
            <p className="min-w-0 flex-1 truncate text-right text-[13px] font-medium tracking-tight text-foreground">
              {teamNameShort(home)}
            </p>
            <Flag team={match.homeTeam} />
          </div>

          {/* Marcador (pronóstico del usuario) */}
          <div className="flex shrink-0 items-center gap-1">
            <ScoreBox
              value={h}
              disabled={locked || isPending}
              onChange={setHome}
              onCommit={() => save(h, a)}
              label={`Goles ${home}`}
            />
            <span className="text-base font-medium text-foreground">-</span>
            <ScoreBox
              value={a}
              disabled={locked || isPending}
              onChange={setAway}
              onCommit={() => save(h, a)}
              label={`Goles ${away}`}
            />
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

        {locked && <LockedHint />}
      </div>
    </div>
  );
}

/**
 * Card compacta (media columna) usada cuando hay más de un partido por
 * comenzar. El marcador es el pronóstico editable del usuario. Diseño Figma
 * node 263:11868 (estado "on-matches").
 */
export function CompactMatchCard({ match }: { match: FeaturedMatch }) {
  const home = teamNameEs(match.homeTeam);
  const away = teamNameEs(match.awayTeam);
  const { home: h, setHome, away: a, setAway, locked, isPending, save } = usePrediction(match);

  return (
    <div className="flex flex-col self-start overflow-hidden rounded-2xl border border-border bg-card shadow-[0px_4px_12px_0px_rgba(0,0,0,0.15)]">
      <GroupHeading round={match.round} />
      <div className={`flex flex-col gap-2 py-3 ${locked ? "opacity-60" : ""}`}>
        <div className="flex flex-col gap-2 px-3">
          {/* Equipo local */}
          <div className="flex items-center gap-1">
            <div className="flex min-w-0 flex-1 items-center justify-end gap-1">
              <p className="min-w-0 flex-1 truncate text-right text-[13px] font-medium tracking-tight text-foreground">
                {teamNameShort(home)}
              </p>
              <Flag team={match.homeTeam} />
            </div>
            <ScoreBox
              value={h}
              disabled={locked || isPending}
              onChange={setHome}
              onCommit={() => save(h, a)}
              label={`Goles ${home}`}
              sm
            />
          </div>

          {/* Equipo visitante */}
          <div className="flex items-center gap-1">
            <div className="flex min-w-0 flex-1 items-center justify-end gap-1">
              <p className="min-w-0 flex-1 truncate text-right text-[13px] font-medium tracking-tight text-foreground">
                {teamNameShort(away)}
              </p>
              <Flag team={match.awayTeam} />
            </div>
            <ScoreBox
              value={a}
              disabled={locked || isPending}
              onChange={setAway}
              onCommit={() => save(h, a)}
              label={`Goles ${away}`}
              sm
            />
          </div>
        </div>

        {/* Día y hora */}
        <div className="flex items-center justify-end gap-0.5 px-3 text-[13px] tracking-tight text-fg-secondary">
          <span>{formatDay(match.scheduledAt)}</span>
          <span>{formatHour(match.scheduledAt)}</span>
        </div>

        {locked && <LockedHint />}
      </div>
    </div>
  );
}

type LaidOutCard = { match: FeaturedMatch; variant: "featured" | "compact" };

/**
 * Decide el layout según cuántos partidos haya por comenzar:
 *  - 1 → uno horizontal (destacado).
 *  - 2 → dos horizontales apilados.
 *  - 3 → el primero horizontal y debajo dos cuadrados (compactos).
 *  - 4 → los cuatro cuadrados, en dos filas (2×2).
 *  - ≥5 → par: todos cuadrados; impar: el primero horizontal y el resto
 *    cuadrados.
 */
function layoutFor(matches: FeaturedMatch[]): LaidOutCard[] {
  const featured = (m: FeaturedMatch): LaidOutCard => ({ match: m, variant: "featured" });
  const compact = (m: FeaturedMatch): LaidOutCard => ({ match: m, variant: "compact" });
  const n = matches.length;

  if (n === 0) return [];
  if (n === 1) return [featured(matches[0])];
  if (n === 2) return matches.map(featured);
  if (n === 3) return [featured(matches[0]), compact(matches[1]), compact(matches[2])];
  if (n === 4) return matches.map(compact);
  if (n % 2 === 0) return matches.map(compact);
  return matches.map((m, i) => (i === 0 ? featured(m) : compact(m)));
}

/**
 * Renderiza el bloque de partidos "por comenzar" en la home, eligiendo entre
 * la variante horizontal (FeaturedMatchCard) y la cuadrada (CompactMatchCard)
 * según la cantidad. Devuelve hijos directos del grid de 2 columnas.
 */
export function MatchCards({ matches }: { matches: FeaturedMatch[] }) {
  return (
    <>
      {layoutFor(matches).map(({ match, variant }) =>
        variant === "featured" ? (
          <FeaturedMatchCard key={match.id} match={match} />
        ) : (
          <CompactMatchCard key={match.id} match={match} />
        ),
      )}
    </>
  );
}
