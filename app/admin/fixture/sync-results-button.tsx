"use client";

import { useActionState, useEffect } from "react";
import { syncResultsFromApi } from "@/actions/admin/sync-results";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function SyncResultsButton() {
  const [state, action, pending] = useActionState(syncResultsFromApi, undefined);

  useEffect(() => {
    if (state?.ok) {
      const msg = state.updated === 0
        ? "Todo al día, sin cambios nuevos."
        : `${state.updated} partido${state.updated !== 1 ? "s" : ""} actualizado${state.updated !== 1 ? "s" : ""} con resultados y puntos recalculados.`;
      toast.success(msg);
    }
    if (state && !state.ok) toast.error(state.error);
  }, [state]);

  return (
    <form action={action}>
      <Button type="submit" variant="outline" disabled={pending} className="font-bold">
        {pending ? "Sincronizando..." : "🔄 Sincronizar resultados"}
      </Button>
    </form>
  );
}
