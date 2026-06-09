"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { importPlayersFromApi } from "@/actions/admin/import-players-from-api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function ImportPlayersButton() {
  const router = useRouter();
  const [state, action, pending] = useActionState(importPlayersFromApi, undefined);

  useEffect(() => {
    if (state?.ok) {
      toast.success(`${state.count} jugadores importados (${state.teams} plantillas) desde football-data.org`);
      router.refresh();
    }
    if (state && !state.ok) toast.error(state.error);
  }, [state, router]);

  return (
    <form action={action}>
      <Button type="submit" variant="outline" disabled={pending} className="font-bold">
        {pending ? "Importando..." : "👤 Importar jugadores"}
      </Button>
    </form>
  );
}
