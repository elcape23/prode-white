"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateKnockoutFromApi } from "@/actions/admin/update-knockout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function UpdateKnockoutButton() {
  const router = useRouter();
  const [state, action, pending] = useActionState(updateKnockoutFromApi, undefined);

  useEffect(() => {
    if (state?.ok) {
      toast.success(
        `${state.updated} partido${state.updated !== 1 ? "s" : ""} de eliminación actualizado${state.updated !== 1 ? "s" : ""}.`
      );
      router.refresh();
    }
    if (state && !state.ok) toast.error(state.error);
  }, [state, router]);

  return (
    <form action={action}>
      <Button type="submit" variant="outline" disabled={pending} className="font-bold">
        {pending ? "Actualizando..." : "🏆 Actualizar llaves"}
      </Button>
    </form>
  );
}
