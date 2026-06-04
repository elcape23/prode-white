"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { reactivateRegistration } from "@/actions/admin/registrations";
import { Button } from "@/components/ui/button";

export function ReactivateButton({ participantId }: { participantId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={isPending}
      onClick={() => {
        if (!confirm("¿Volver a pendiente esta inscripción?")) return;
        startTransition(async () => {
          await reactivateRegistration(participantId);
          router.refresh();
        });
      }}
    >
      {isPending ? "Reactivando..." : "Volver a pendiente"}
    </Button>
  );
}
