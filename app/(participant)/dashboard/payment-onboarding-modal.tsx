"use client";

import { useState, useTransition } from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { XIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { markWelcomeSeen } from "@/actions/welcome";

const TOTAL_STEPS = 4;

export function PaymentOnboardingModal() {
  const [open, setOpen] = useState(true);
  const [step, setStep] = useState(1);
  const [isPending, startTransition] = useTransition();

  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [celular, setCelular] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const dismiss = () => {
    setOpen(false);
    startTransition(async () => {
      await markWelcomeSeen();
    });
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) dismiss();
  };

  const handlePrimary = () => {
    if (step < TOTAL_STEPS) setStep((s) => s + 1);
    else dismiss();
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
            "flex flex-col rounded-t-[40px] bg-white px-6 pb-8 pt-5 text-card-foreground",
            "duration-300",
            "data-open:animate-in data-open:slide-in-from-bottom data-open:fade-in-0",
            "data-closed:animate-out data-closed:slide-out-to-bottom data-closed:fade-out-0",
          )}
        >
          {/* Botón cerrar */}
          <div className="flex w-full justify-end mb-4">
            <DialogPrimitive.Close
              data-slot="dialog-close"
              render={
                <button
                  type="button"
                  className="flex size-8 items-center justify-center rounded-full bg-secondary hover:bg-fill-neutral-hover transition-colors"
                  aria-label="Cerrar"
                />
              }
            >
              <XIcon className="size-4 text-fg-brand" />
            </DialogPrimitive.Close>
          </div>

          {/* Título */}
          <DialogPrimitive.Title
            data-slot="dialog-title"
            className="font-heading text-[32px] font-black uppercase leading-none tracking-[-0.02em] text-fg-brand mb-3"
          >
            {step === 1 && "EMAIL"}
            {step === 2 && "NOMBRE"}
            {step === 3 && "CELULAR"}
            {step === 4 && "CONTRASEÑA"}
          </DialogPrimitive.Title>

          {/* Contenido del paso */}
          <div className="flex w-full flex-col gap-4 mb-6">
            {step === 1 && (
              <>
                <DialogPrimitive.Description className="text-base leading-5 tracking-tight text-fg-brand">
                  Te enviaremos un email para confirmar tu cuenta
                </DialogPrimitive.Description>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="email" className="text-sm text-fg-brand">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="hincha@prodewhite.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 rounded-2xl border border-input px-4 text-base"
                  />
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="nombre" className="text-sm text-fg-brand">Nombre</Label>
                  <Input
                    id="nombre"
                    type="text"
                    placeholder="hincha@prodewhite.com"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="h-12 rounded-2xl border border-input px-4 text-base"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="apellido" className="text-sm text-fg-brand">Apellido</Label>
                  <Input
                    id="apellido"
                    type="text"
                    placeholder="hincha@prodewhite.com"
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                    className="h-12 rounded-2xl border border-input px-4 text-base"
                  />
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <DialogPrimitive.Description className="text-base leading-5 tracking-tight text-fg-brand">
                  Te enviaremos por aquí cuando tu acceso sea aprobado
                </DialogPrimitive.Description>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="celular" className="text-sm text-fg-brand">Número de celular</Label>
                  <Input
                    id="celular"
                    type="tel"
                    placeholder="hincha@prodewhite.com"
                    value={celular}
                    onChange={(e) => setCelular(e.target.value)}
                    className="h-12 rounded-2xl border border-input px-4 text-base"
                  />
                </div>
              </>
            )}

            {step === 4 && (
              <>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="password" className="text-sm text-fg-brand">Contaseña</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="hincha@prodewhite.com"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 rounded-2xl border border-input px-4 text-base"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="repeatPassword" className="text-sm text-fg-brand">Repetir Contraseña</Label>
                  <Input
                    id="repeatPassword"
                    type="password"
                    placeholder="hincha@prodewhite.com"
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                    className="h-12 rounded-2xl border border-input px-4 text-base"
                  />
                </div>
              </>
            )}
          </div>

          {/* Botón primario */}
          <Button
            type="button"
            onClick={handlePrimary}
            disabled={isPending}
            className="h-12 w-full rounded-full text-base font-medium tracking-tight"
          >
            Continuar
          </Button>

          {/* Indicador inferior */}
          <div className="flex justify-center mt-5">
            <div className="h-1 w-32 rounded-full bg-fg-brand/20" />
          </div>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
