"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteMatch } from "@/actions/admin/fixture";
import { Button } from "@/components/ui/button";

export function DeleteMatchButton({ matchId }: { matchId: string }) {
  const [isPending, startTransition] = useTransition();
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      disabled={isPending}
      className="text-muted-foreground hover:text-destructive shrink-0"
      onClick={() => {
        if (!confirm("¿Eliminar este partido?")) return;
        startTransition(() => deleteMatch(matchId));
      }}
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  );
}
