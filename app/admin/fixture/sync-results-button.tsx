"use client";

import { useActionState } from "react";
import { syncResultsFromApi } from "@/actions/admin/sync-results";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function SyncResultsButton() {
  const [state, action, pending] = useActionState(syncResultsFromApi, undefined);

  return (
    <div className="space-y-2">
      <form action={action}>
        <Button type="submit" variant="outline" disabled={pending} className="font-bold">
          {pending ? "Sincronizando..." : "🔄 Sincronizar resultados"}
        </Button>
      </form>

      {state?.ok && (
        <Alert>
          <AlertDescription className="text-fg-success">
            {state.updated === 0
              ? "✅ Todo al día, sin cambios nuevos."
              : `✅ ${state.updated} partido${state.updated !== 1 ? "s" : ""} actualizado${state.updated !== 1 ? "s" : ""} con resultados y puntos recalculados.`}
          </AlertDescription>
        </Alert>
      )}
      {state && !state.ok && (
        <Alert variant="destructive">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
