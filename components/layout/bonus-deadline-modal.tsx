"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { XIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const SESSION_KEY = "bonus-deadline-modal-shown";

/**
 * Bottom-sheet que avisa que quedan las últimas horas para elegir los puntos
 * bonus. Reproduce el diseño de Figma (279:10121 — "00 / Bonus Modal"): hoja
 * blanca con esquinas superiores redondeadas, botón de cerrar, título display
 * "BONUS" y dos acciones (Cerrar / Ir a Bonus).
 *
 * Se muestra una sola vez por sesión y solo se monta cuando corresponde (la
 * decisión se toma en el server component `BonusDeadlineBanner`).
 */
export function BonusDeadlineModal() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;
    sessionStorage.setItem(SESSION_KEY, "1");
    // Diferimos un frame para que la hoja entre con la animación de slide-in
    // (y para no llamar a setState de forma síncrona dentro del efecto).
    const id = requestAnimationFrame(() => setOpen(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const handleOpenChange = (next: boolean) => {
    if (!next) setOpen(false);
  };

  const goToBonus = () => {
    setOpen(false);
    router.push("/bonus");
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop
          data-slot="dialog-overlay"
          className={cn(
            "fixed inset-0 z-50 bg-black/40 duration-200",
            "data-open:animate-in data-open:fade-in-0",
            "data-closed:animate-out data-closed:fade-out-0",
          )}
        />
        <DialogPrimitive.Popup
          data-slot="dialog-content"
          className={cn(
            "fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-[440px] outline-none",
            "flex flex-col gap-5 rounded-t-[40px] bg-card px-5 pb-10 pt-4 text-card-foreground",
            "duration-300",
            "data-open:animate-in data-open:slide-in-from-bottom data-open:fade-in-0",
            "data-closed:animate-out data-closed:slide-out-to-bottom data-closed:fade-out-0",
          )}
        >
          {/* Header: botón cerrar */}
          <div className="flex w-full items-center justify-end">
            <div className="h-5 min-w-px flex-1" aria-hidden />
            <DialogPrimitive.Close
              data-slot="dialog-close"
              render={
                <Button
                  variant="secondary"
                  size="icon"
                  className="size-8 rounded-full bg-secondary hover:bg-fill-neutral-hover"
                />
              }
            >
              <XIcon className="size-3 text-fg-brand" />
              <span className="sr-only">Cerrar</span>
            </DialogPrimitive.Close>
          </div>

          {/* Encabezados */}
          <div className="flex w-full flex-col py-3">
            <div className="flex w-full flex-col gap-2 break-words text-fg-brand">
              <DialogPrimitive.Title className="font-heading text-[32px] font-black uppercase leading-10 tracking-[-0.28px]">
                BONUS
              </DialogPrimitive.Title>
              <p className="text-base font-medium leading-5 tracking-tight">
                No te cuelgues!
              </p>
              <DialogPrimitive.Description className="text-base leading-5 tracking-tight">
                Quedan las últimas horas para elegir tus puntos bonus.
              </DialogPrimitive.Description>
              <p className="text-base leading-5 tracking-tight">
                Los pronósticos bonus se cierran cuando arranca la segunda fecha.
              </p>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex w-full items-end gap-1">
            <DialogPrimitive.Close
              render={
                <button
                  type="button"
                  className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full border-[1.5px] border-fg-brand px-4 text-base font-medium leading-5 tracking-tight text-fg-brand transition-colors hover:bg-fill-brand-subtle"
                />
              }
            >
              Cerrar
            </DialogPrimitive.Close>
            <Button
              type="button"
              onClick={goToBonus}
              className="h-12 flex-1 rounded-full text-base font-medium tracking-tight"
            >
              Ir a Bonus
            </Button>
          </div>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
