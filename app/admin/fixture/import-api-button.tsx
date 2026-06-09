"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { importFromApi } from "@/actions/admin/import-from-api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function ImportApiButton() {
  const router = useRouter();
  const [state, action, pending] = useActionState(importFromApi, undefined);

  useEffect(() => {
    if (state?.ok) {
      toast.success(`${state.count} partidos importados desde football-data.org`);
      router.refresh();
    }
    if (state && !state.ok) toast.error(state.error);
  }, [state, router]);

  return (
    <form action={action}>
      <Button type="submit" variant="outline" disabled={pending} className="font-bold">
        {pending ? "Importando..." : "🌐 Importar desde API"}
      </Button>
    </form>
  );
}
