"use client";

import { useState, useEffect, useTransition } from "react";
import { GlobeIcon, SquareLock02Icon } from "hugeicons-react";
import { savePrediction } from "@/actions/predictions";
import { flagSrc, teamNameShort } from "@/lib/flags";

const LOCK_MS = 30 * 60 * 1000;

function msUntilLock(scheduledAt: Date) {
  return new Date(scheduledAt).getTime() - LOCK_MS - Date.now();
}

/** Bandera de la selección. Si no se reconoce el nombre del equipo
 *  (ej. "Por definir", "Ganador A") cae al ícono genérico. */
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

type ScoreBoxProps = {
  value: number | string;
  disabled: boolean;
  onChange: (v: string) => void;
  onCommit: () => void;
  label: string;
};

function ScoreBox({ value, disabled, onChange, onCommit, label }: ScoreBoxProps) {
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
      className="size-10 shrink-0 rounded-lg border border-[color:var(--color-input)] bg-card text-center text-base font-medium text-foreground tabular-nums disabled:bg-muted disabled:text-fg-disabled focus:outline-none focus:ring-2 focus:ring-fg-brand [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
    />
  );
}

export type MatchRowProps = {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  scheduledAt: Date;
  initialHome: number | null;
  initialAway: number | null;
};

export function MatchRow({
  matchId, homeTeam, awayTeam, scheduledAt, initialHome, initialAway,
}: MatchRowProps) {
  const [home, setHome] = useState<number | string>(initialHome ?? "");
  const [away, setAway] = useState<number | string>(initialAway ?? "");
  const [locked, setLocked] = useState(msUntilLock(scheduledAt) <= 0);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const remaining = msUntilLock(scheduledAt);
    // El estado inicial ya cubre el caso "ya bloqueado"; aquí solo
    // programamos el bloqueo automático cuando aún falta tiempo.
    if (remaining <= 0) return;
    const timer = setTimeout(() => setLocked(true), remaining);
    return () => clearTimeout(timer);
  }, [scheduledAt]);

  const handleSave = () => {
    if (home === "" || away === "") return;
    const h = Number(home);
    const a = Number(away);
    if (isNaN(h) || isNaN(a) || h < 0 || a < 0) return;

    startTransition(async () => {
      await savePrediction(matchId, h, a);
    });
  };

  return (
    <div className={`flex w-full flex-col gap-1 px-3 ${locked ? "opacity-60" : ""}`}>
      <div className="flex items-center justify-center gap-3">
        {/* Equipo local */}
        <div className="flex min-w-0 flex-1 items-center justify-end gap-1">
          <p className="min-w-0 flex-1 truncate text-right text-[13px] font-medium tracking-tight text-foreground">
            {teamNameShort(homeTeam)}
          </p>
          <Flag team={homeTeam} />
        </div>

        {/* Marcador */}
        <div className="flex shrink-0 items-center gap-1">
          <ScoreBox
            value={home}
            disabled={locked || isPending}
            onChange={(v) => setHome(v)}
            onCommit={handleSave}
            label={`Goles ${homeTeam}`}
          />
          <span className="text-base font-medium text-fg-secondary">-</span>
          <ScoreBox
            value={away}
            disabled={locked || isPending}
            onChange={(v) => setAway(v)}
            onCommit={handleSave}
            label={`Goles ${awayTeam}`}
          />
        </div>

        {/* Equipo visitante */}
        <div className="flex min-w-0 flex-1 items-center gap-1">
          <Flag team={awayTeam} />
          <p className="min-w-0 flex-1 truncate text-left text-[13px] font-medium tracking-tight text-foreground">
            {teamNameShort(awayTeam)}
          </p>
        </div>
      </div>

      {/* Estado: solo bloqueo o guardado en curso */}
      {(locked || isPending) && (
        <div className="flex h-3 items-center justify-center">
          {locked ? (
            <span className="flex items-center gap-1 text-[11px] text-fg-tertiary">
              <SquareLock02Icon size={12} strokeWidth={2} /> Cerrado
            </span>
          ) : (
            <span className="text-[11px] text-fg-tertiary">Guardando…</span>
          )}
        </div>
      )}
    </div>
  );
}
