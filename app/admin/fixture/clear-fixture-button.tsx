"use client";

import { useTransition } from "react";
import { clearFixture } from "@/actions/admin/fixture";
import { Button } from "@/components/ui/button";

export function ClearFixtureButton() {
  const [isPending, startTransition] = useTransition();
  return (
    <Button
      variant="destructive"
      disabled={isPending}
      onClick={() => {
        if (!confirm("¿Borrar TODO el fixture? Esta acción no se puede deshacer.")) return;
        startTransition(() => clearFixture());
      }}
    >
      {isPending ? "Borrando..." : "Borrar fixture"}
    </Button>
  );
}
