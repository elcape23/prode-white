"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { importPlayersFromApi } from "@/actions/admin/import-players-from-api";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function ImportPlayersButton() {
  const router = useRouter();
  const [state, action, pending] = useActionState(importPlayersFromApi, undefined);

  useEffect(() => {
    if (state?.ok) router.refresh();
  }, [state, router]);

  return (
    <div className="space-y-2">
      <form action={action}>
        <Button type="submit" variant="outline" disabled={pending} className="font-bold">
          {pending ? "Importando..." : "👤 Importar jugadores"}
        </Button>
      </form>

      {state && !state.ok && (
        <Alert variant="destructive">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}
      {state?.ok && (
        <Alert>
          <AlertDescription className="text-fg-success">
            ✅ {state.count} jugadores importados ({state.teams} plantillas) desde football-data.org
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
