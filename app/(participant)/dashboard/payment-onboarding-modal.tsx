"use client";

import { useState, useTransition } from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { ChevronLeftIcon, ChevronRightIcon, CopyIcon, XIcon } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { markWelcomeSeen } from "@/actions/welcome";
import { requestAccess } from "@/actions/access-request";

/**
 * Modal de onboarding de pago en 3 pasos que aparece automáticamente la
 * primera vez que un participante entra al dashboard (hasSeenWelcome = false).
 * Reproduce el diseño de Figma (252:7506 / 252:7805 / 252:7844): bottom-sheet
 * blanco con contador de pasos, navegación con flechas y botón primario.
 *
 * TODO: reemplazar los placeholders (alias, CBU y número de WhatsApp) por los
 * datos reales de cobro cuando estén disponibles.
 */
const ALIAS = "loaiglesias.mp";
const ACCOUNT_INFO = {
  nombre: "Loana Iglesias",
  cuit: "27-37131864-5",
  entidad: "Mercado Pago",
};
// Número de WhatsApp en formato internacional sin "+" (ej: 5491122334455).
const WHATSAPP_NUMBER = "+5493814090778";

const WHATSAPP_RECEIPT_MSG =
  "Hola, te envío el comprobante de pago de mi inscripción al Prode.";

const TOTAL_STEPS = 3;

function waLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function PaymentOnboardingModal() {
  const [open, setOpen] = useState(true);
  const [step, setStep] = useState(1);
  const [accessRequested, setAccessRequested] = useState(false);
  const [isPending, startTransition] = useTransition();

  const dismiss = () => {
    setOpen(false);
    startTransition(async () => {
      await markWelcomeSeen();
    });
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) dismiss();
  };

  const goPrev = () => setStep((s) => Math.max(1, s - 1));
  const goNext = () => setStep((s) => Math.min(TOTAL_STEPS, s + 1));

  const handlePrimary = () => {
    if (step < TOTAL_STEPS) goNext();
    else dismiss();
  };

  const copy = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`${label} copiado`);
    } catch {
      toast.error("No se pudo copiar");
    }
  };

  const openWhatsApp = (message: string) => {
    window.open(waLink(message), "_blank", "noopener,noreferrer");
  };

  const handleRequestAccess = () => {
    startTransition(async () => {
      const result = await requestAccess();
      if (result.ok) {
        setAccessRequested(true);
        toast.success("Solicitud enviada. El admin generará tu PIN en breve.");
      } else {
        toast.error(result.error ?? "No se pudo enviar la solicitud.");
      }
    });
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
          {/* Header: contador de pasos + botón cerrar */}
          <div className="flex w-full items-center justify-end">
            <div className="flex flex-1 items-center gap-1 text-fg-brand">
              <button
                type="button"
                onClick={goPrev}
                disabled={step === 1}
                aria-label="Paso anterior"
                className="flex size-5 items-center justify-center rounded-full transition-opacity disabled:opacity-30"
              >
                <ChevronLeftIcon className="size-5" />
              </button>
              <p className="text-base leading-5 tracking-tight">
                {step}/{TOTAL_STEPS}
              </p>
              <button
                type="button"
                onClick={goNext}
                disabled={step === TOTAL_STEPS}
                aria-label="Paso siguiente"
                className="flex size-5 items-center justify-center rounded-full transition-opacity disabled:opacity-30"
              >
                <ChevronRightIcon className="size-5" />
              </button>
            </div>

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

          {/* Título del paso */}
          <DialogPrimitive.Title
            data-slot="dialog-title"
            className="font-heading text-[32px] font-black uppercase leading-10 tracking-[-0.02em] text-fg-brand"
          >
            PASO {step}
          </DialogPrimitive.Title>

          {/* Contenido del paso */}
          {step === 1 && (
            <div className="flex w-full flex-col gap-4">
              <DialogPrimitive.Description className="text-base leading-5 tracking-tight text-fg-brand">
                Transferí $10.000 a este cuenta:
              </DialogPrimitive.Description>
              <CopyField label="Alias" value={ALIAS} onCopy={copy} />
              <div className="flex w-full flex-col gap-2">
                <p className="text-base leading-5 tracking-tight text-fg-brand">Info</p>
                <div className="rounded-2xl bg-secondary px-4 py-3 flex flex-col gap-1">
                  <p className="text-base leading-5 tracking-tight text-fg-brand">
                    <span className="font-medium">Nombre:</span> {ACCOUNT_INFO.nombre}
                  </p>
                  <p className="text-base leading-5 tracking-tight text-fg-brand">
                    <span className="font-medium">CUIT:</span> {ACCOUNT_INFO.cuit}
                  </p>
                  <p className="text-base leading-5 tracking-tight text-fg-brand">
                    <span className="font-medium">Entidad:</span> {ACCOUNT_INFO.entidad}
                  </p>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex w-full flex-col gap-2">
              <DialogPrimitive.Description className="text-base leading-5 tracking-tight text-fg-brand">
                Envía el comprobante de pago a este número:
              </DialogPrimitive.Description>
              <div className="flex w-full flex-col py-4 pb-10">
                <OutlineButton onClick={() => openWhatsApp(WHATSAPP_RECEIPT_MSG)}>
                  Enviar WhatsApp
                </OutlineButton>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex w-full flex-col gap-2">
              <DialogPrimitive.Description className="text-base leading-5 tracking-tight text-fg-brand">
                Después de compartir el comprobante de pago, solicitá el acceso. Te vamos a avisar cuando tu cuenta esté autorizada para que puedas comenzar a jugar.

              </DialogPrimitive.Description>
              <div className="flex w-full flex-col py-4 pb-10">
                <OutlineButton
                  onClick={handleRequestAccess}
                  disabled={isPending || accessRequested}
                >
                  {accessRequested
                    ? "Solicitud enviada"
                    : isPending
                      ? "Enviando..."
                      : "Solicitar acceso"}
                </OutlineButton>
              </div>
            </div>
          )}

          {/* Botón primario */}
          <Button
            type="button"
            onClick={handlePrimary}
            className="h-12 w-full rounded-full text-base font-medium tracking-tight"
          >
            {step < TOTAL_STEPS ? "Continuar" : "Cerrar"}
          </Button>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

function CopyField({
  label,
  value,
  onCopy,
}: {
  label: string;
  value: string;
  onCopy: (value: string, label: string) => void;
}) {
  return (
    <div className="flex w-full flex-col gap-2">
      <p className="text-base leading-5 tracking-tight text-fg-brand">{label}</p>
      <button
        type="button"
        onClick={() => onCopy(value, label)}
        className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-secondary p-5 text-left transition-colors hover:bg-fill-neutral-hover"
      >
        <span className="flex-1 text-base leading-5 tracking-tight text-fg-brand">
          {value}
        </span>
        <CopyIcon className="size-5 shrink-0 text-fg-brand" />
      </button>
    </div>
  );
}

function OutlineButton({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex h-12 w-full items-center justify-center gap-2 rounded-full border-[1.5px] border-fg-brand px-4 text-base font-medium leading-5 tracking-tight text-fg-brand transition-colors hover:bg-fill-brand-subtle disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  );
}
