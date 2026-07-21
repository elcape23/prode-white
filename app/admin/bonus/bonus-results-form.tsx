"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { setBonusResults } from "@/actions/admin/bonus";

type Initial = {
  champion: string;
  bestPlayer: string;
  topScorer: string;
  bestYoungPlayer: string;
};

export function BonusResultsForm({
  initial,
  countries,
  players,
  youngPlayers,
}: {
  initial: Initial;
  countries: string[];
  players: string[];
  youngPlayers: string[];
}) {
  const [state, action, pending] = useActionState(setBonusResults, undefined);

  useEffect(() => {
    if (state?.ok) {
      toast.success(`Resultados guardados · ${state.updated} pronósticos recalculados.`);
    }
    if (state && !state.ok) toast.error(state.error);
  }, [state]);

  const fields = [
    {
      name: "champion",
      label: "Equipo campeón",
      points: 15,
      value: initial.champion,
      list: "admin-bonus-countries",
      placeholder: "Seleccionar país",
    },
    {
      name: "bestPlayer",
      label: "Mejor jugador",
      points: 10,
      value: initial.bestPlayer,
      list: "admin-bonus-players",
      placeholder: "Seleccionar jugador",
    },
    {
      name: "topScorer",
      label: "Goleador",
      points: 10,
      value: initial.topScorer,
      list: "admin-bonus-players",
      placeholder: "Seleccionar jugador",
    },
    {
      name: "bestYoungPlayer",
      label: "Mejor jugador jóven",
      points: 5,
      value: initial.bestYoungPlayer,
      list: "admin-bonus-young-players",
      placeholder: "Seleccionar jugador",
    },
  ];

  return (
    <form action={action} className="space-y-4">
      <datalist id="admin-bonus-countries">
        {countries.map((c) => (
          <option key={c} value={c} />
        ))}
      </datalist>
      <datalist id="admin-bonus-players">
        {players.map((p) => (
          <option key={p} value={p} />
        ))}
      </datalist>
      <datalist id="admin-bonus-young-players">
        {youngPlayers.map((p) => (
          <option key={p} value={p} />
        ))}
      </datalist>

      <div className="grid gap-3 sm:grid-cols-2">
        {fields.map((f) => (
          <div key={f.name} className="bg-card border rounded-xl px-4 py-3">
            <label
              htmlFor={f.name}
              className="flex items-center justify-between text-sm font-bold mb-2"
            >
              {f.label}
              <span className="text-xs font-medium text-muted-foreground">
                {f.points} pts
              </span>
            </label>
            <input
              id={f.name}
              name={f.name}
              list={f.list}
              defaultValue={f.value}
              placeholder={f.placeholder}
              autoComplete="off"
              className="w-full h-10 px-3 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Guardando..." : "Guardar y recalcular"}
        </Button>
        <span className="text-xs text-muted-foreground">
          Dejá una categoría vacía para marcarla como pendiente.
        </span>
      </div>
    </form>
  );
}
