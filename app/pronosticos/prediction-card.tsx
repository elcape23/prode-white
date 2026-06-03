"use client";

import { useState, useEffect, useTransition } from "react";
import { savePrediction } from "@/actions/predictions";

type Props = {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  scheduledAt: Date;
  initialHome: number | null;
  initialAway: number | null;
};

const LOCK_MS = 30 * 60 * 1000;

function msUntilLock(scheduledAt: Date) {
  return new Date(scheduledAt).getTime() - LOCK_MS - Date.now();
}

export function PredictionCard({
  matchId, homeTeam, awayTeam, scheduledAt, initialHome, initialAway,
}: Props) {
  const [home, setHome] = useState(initialHome ?? "");
  const [away, setAway] = useState(initialAway ?? "");
  const [saved, setSaved] = useState(!!initialHome || initialHome === 0);
  const [locked, setLocked] = useState(msUntilLock(scheduledAt) <= 0);
  const [isPending, startTransition] = useTransition();

  // Auto-lock when countdown hits zero
  useEffect(() => {
    const remaining = msUntilLock(scheduledAt);
    if (remaining <= 0) { setLocked(true); return; }
    const timer = setTimeout(() => setLocked(true), remaining);
    return () => clearTimeout(timer);
  }, [scheduledAt]);

  const handleSave = () => {
    const h = Number(home);
    const a = Number(away);
    if (isNaN(h) || isNaN(a) || h < 0 || a < 0) return;

    startTransition(async () => {
      const result = await savePrediction(matchId, h, a);
      if (result.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    });
  };

  const timeLabel = () => {
    const d = new Date(scheduledAt);
    return d.toLocaleString("es-AR", {
      weekday: "short", day: "numeric", month: "short",
      hour: "2-digit", minute: "2-digit",
      timeZone: "America/Argentina/Buenos_Aires",
    });
  };

  return (
    <div className={`bg-white border rounded-xl px-4 py-3 ${locked ? "opacity-60" : ""}`}>
      <p className="text-xs text-muted-foreground mb-3 capitalize">{timeLabel()}</p>

      <div className="flex items-center gap-2">
        {/* Home */}
        <span className="flex-1 text-right font-bold text-sm truncate">{homeTeam}</span>
        <input
          type="number"
          min={0}
          max={99}
          value={home}
          disabled={locked || isPending}
          onChange={(e) => { setHome(e.target.value); setSaved(false); }}
          onBlur={handleSave}
          className="w-12 h-10 text-center text-lg font-black border rounded-lg disabled:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <span className="text-muted-foreground font-mono text-sm">–</span>
        <input
          type="number"
          min={0}
          max={99}
          value={away}
          disabled={locked || isPending}
          onChange={(e) => { setAway(e.target.value); setSaved(false); }}
          onBlur={handleSave}
          className="w-12 h-10 text-center text-lg font-black border rounded-lg disabled:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <span className="flex-1 text-left font-bold text-sm truncate">{awayTeam}</span>
      </div>

      <div className="text-center mt-2 h-4">
        {locked && <p className="text-xs text-muted-foreground">🔒 Cerrado</p>}
        {!locked && isPending && <p className="text-xs text-muted-foreground">Guardando...</p>}
        {!locked && !isPending && saved && <p className="text-xs text-green-600">✓ Guardado</p>}
      </div>
    </div>
  );
}
