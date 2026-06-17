"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const SESSION_KEY = "bonus-deadline-toast-shown";

/**
 * Dispara, una vez por sesión, un toast neutro avisando que hoy es el último
 * día para elegir los puntos bonus. Se renderiza solo cuando corresponde
 * (la decisión se toma en el server component que lo monta).
 */
export function BonusDeadlineToast() {
  const router = useRouter();

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;
    sessionStorage.setItem(SESSION_KEY, "1");

    toast("Hoy es el último día para elegir tus puntos bonus", {
      description:
        "Los pronósticos bonus se cierran cuando arranca la segunda fecha.",
      duration: 8000,
      action: {
        label: "Elegir",
        onClick: () => router.push("/bonus"),
      },
    });
  }, [router]);

  return null;
}
