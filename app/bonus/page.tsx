"use client";

import { useActionState, useState } from "react";
import { saveBonusPredictions } from "@/actions/predictions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

// This page is protected by proxy.ts (requires participant session)
// We use a client component with useActionState for the form
export default function BonusPage() {
  return <BonusForm />;
}

function BonusForm() {
  const [state, action, pending] = useActionState(saveBonusPredictions, undefined);

  const fields: { key: string; label: string; points: string }[] = [
    { key: "CHAMPION",    label: "Campeón",         points: "+15 pts" },
    { key: "FINALIST_1",  label: "Finalista 1",     points: "+10 pts" },
    { key: "FINALIST_2",  label: "Finalista 2",     points: "+10 pts" },
    { key: "SEMI_1",      label: "Semifinalista 1", points: "+5 pts" },
    { key: "SEMI_2",      label: "Semifinalista 2", points: "+5 pts" },
    { key: "SEMI_3",      label: "Semifinalista 3", points: "+5 pts" },
    { key: "SEMI_4",      label: "Semifinalista 4", points: "+5 pts" },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-navy)] flex flex-col">
      <header className="px-4 py-3 text-white">
        <p className="text-xs text-white/60">Pronósticos Bonus</p>
        <p className="font-bold">Antes del primer partido</p>
      </header>

      <main className="flex-1 bg-gray-50 rounded-t-3xl p-4 mt-2">
        <div className="space-y-4">
          <div className="bg-[var(--color-navy)] text-white rounded-xl p-4 text-sm">
            <p className="font-bold mb-1">¿Cómo funcionan?</p>
            <p className="text-white/70 text-xs">
              Elegí el campeón, finalistas y semifinalistas. Se cierran cuando empiece el primer partido.
              No importa el orden — si acertás el equipo en cualquier posición, sumás los puntos.
            </p>
          </div>

          {state?.ok && (
            <Alert>
              <AlertDescription className="text-green-700 font-medium">
                ✅ Pronósticos guardados correctamente.
              </AlertDescription>
            </Alert>
          )}
          {state && !state.ok && (
            <Alert variant="destructive">
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}

          <form action={action} className="space-y-3">
            {fields.map(({ key, label, points }) => (
              <div key={key} className="bg-white border rounded-xl px-4 py-3">
                <div className="flex items-center justify-between mb-1.5">
                  <Label htmlFor={key} className="font-bold text-sm">{label}</Label>
                  <span className="text-xs font-bold text-[var(--color-gold)] bg-[var(--color-navy)] px-2 py-0.5 rounded-full">
                    {points}
                  </span>
                </div>
                <Input
                  id={key}
                  name={key}
                  placeholder="Nombre del equipo"
                  className="text-sm"
                  disabled={pending}
                />
              </div>
            ))}

            <Button
              type="submit"
              disabled={pending}
              className="w-full h-12 font-bold text-base"
            >
              {pending ? "Guardando..." : "Guardar pronósticos bonus"}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
