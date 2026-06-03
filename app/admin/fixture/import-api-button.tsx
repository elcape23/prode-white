"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { importFromApi } from "@/actions/admin/import-from-api";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function ImportApiButton() {
  const router = useRouter();
  const [state, action, pending] = useActionState(importFromApi, undefined);

  useEffect(() => {
    if (state?.ok) router.refresh();
  }, [state, router]);

  return (
    <div className="space-y-2">
      <form action={action}>
        <Button type="submit" variant="outline" disabled={pending} className="font-bold">
          {pending ? "Importando..." : "🌐 Importar desde API"}
        </Button>
      </form>

      {state && !state.ok && (
        <Alert variant="destructive">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}
      {state?.ok && (
        <Alert>
          <AlertDescription className="text-green-700">
            ✅ {state.count} partidos importados desde football-data.org
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
