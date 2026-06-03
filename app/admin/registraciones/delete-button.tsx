"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteParticipant } from "@/actions/admin/registrations";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export function DeleteButton({ participantId, participantName }: { participantId: string; participantName: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="destructive"
      size="sm"
      disabled={isPending}
      onClick={() => {
        if (!confirm(`¿Eliminar a ${participantName}? Esta acción no se puede deshacer.`)) return;
        startTransition(async () => {
          await deleteParticipant(participantId);
          router.refresh();
        });
      }}
    >
      <Trash2 className="w-3.5 h-3.5" />
      {isPending ? "Eliminando..." : "Eliminar"}
    </Button>
  );
}
