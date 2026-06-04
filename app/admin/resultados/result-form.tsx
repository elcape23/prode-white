"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { enterMatchResult } from "@/actions/admin/results";

type Match = {
  id: string;
  homeTeam: string;
  awayTeam: string;
  scheduledAt: Date;
  homeScore: number | null;
  awayScore: number | null;
};

function formatDate(d: Date) {
  return new Date(d).toLocaleString("es-AR", {
    weekday: "short", day: "numeric", month: "short",
    hour: "2-digit", minute: "2-digit",
    timeZone: "America/Argentina/Buenos_Aires",
  });
}

export function ResultForm({ match }: { match: Match }) {
  const [home, setHome] = useState(match.homeScore ?? "");
  const [away, setAway] = useState(match.awayScore ?? "");
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    const h = Number(home);
    const a = Number(away);
    if (isNaN(h) || isNaN(a)) return;

    startTransition(async () => {
      await enterMatchResult(match.id, h, a);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  };

  return (
    <div className="bg-card border rounded-xl px-4 py-3">
      <p className="text-xs text-muted-foreground mb-2 capitalize">{formatDate(match.scheduledAt)}</p>
      <div className="flex items-center gap-2">
        <span className="flex-1 text-right font-bold text-sm truncate">{match.homeTeam}</span>
        <input
          type="number" min={0} max={99}
          value={home}
          onChange={(e) => { setHome(e.target.value); setSaved(false); }}
          className="w-12 h-10 text-center text-lg font-black border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <span className="text-muted-foreground font-mono">–</span>
        <input
          type="number" min={0} max={99}
          value={away}
          onChange={(e) => { setAway(e.target.value); setSaved(false); }}
          className="w-12 h-10 text-center text-lg font-black border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <span className="flex-1 text-left font-bold text-sm truncate">{match.awayTeam}</span>
        <Button
          size="sm"
          disabled={isPending}
          onClick={handleSave}
          className="shrink-0 text-xs"
        >
          {isPending ? "..." : saved ? "✓" : "Guardar"}
        </Button>
      </div>
    </div>
  );
}
