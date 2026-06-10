"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { XIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/**
 * Bottom-sheet base compartida por los modales del onboarding
 * (email, contraseña, etc.). Mantiene el look exacto del diseño de Figma:
 * card blanca anclada abajo, esquinas superiores 40px, botón cerrar circular.
 */
export function ModalSheet({
  open,
  onOpenChange,
  title,
  description,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
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

          <div className="flex flex-col gap-2">
            <DialogPrimitive.Title
              data-slot="dialog-title"
              className="font-heading text-[32px] font-black uppercase leading-10 tracking-[-0.02em] text-fg-brand"
            >
              {title}
            </DialogPrimitive.Title>
            {description ? (
              <DialogPrimitive.Description
                data-slot="dialog-description"
                className="text-base leading-5 tracking-tight text-fg-default"
              >
                {description}
              </DialogPrimitive.Description>
            ) : null}
          </div>

          {children}

          <div className="flex justify-center pt-1">
            <div className="h-1 w-32 rounded-full bg-fg-brand/20" />
          </div>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
