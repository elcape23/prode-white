"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { rejectRegistration } from "@/actions/admin/registrations";
import { Button } from "@/components/ui/button";

export function RejectButton({ participantId }: { participantId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="destructive"
      size="sm"
      className="flex-1"
      disabled={isPending}
      onClick={() => {
        if (!confirm("¿Rechazar esta inscripción?")) return;
        startTransition(async () => {
          await rejectRegistration(participantId);
          router.refresh();
        });
      }}
    >
      {isPending ? "Rechazando..." : "Rechazar"}
    </Button>
  );
}
