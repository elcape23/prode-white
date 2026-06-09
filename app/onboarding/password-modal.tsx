"use client";

import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ModalSheet } from "./modal-sheet";

const MIN_LENGTH = 8;

export function PasswordModal({
  open,
  onOpenChange,
  onContinue,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Confirma la contraseña creada y continúa al alta de cuenta. */
  onContinue: (password: string) => void;
}) {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const tooShort = password.length > 0 && password.length < MIN_LENGTH;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < MIN_LENGTH) return;
    onContinue(password);
  };

  return (
    <ModalSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Crear contraseña"
      description="Elegí una contraseña para proteger tu cuenta"
    >
      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5">
        <div className="flex flex-col gap-1">
          <Label htmlFor="onboarding-password" className="px-1 text-fg-brand">
            Contraseña
          </Label>
          <div className="relative">
            <Input
              id="onboarding-password"
              name="password"
              type={show ? "text" : "password"}
              autoComplete="new-password"
              required
              minLength={MIN_LENGTH}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 8 caracteres"
              aria-invalid={tooShort}
              className="h-10 rounded-lg px-3 pr-10 text-sm"
            />
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-fg-secondary transition-colors hover:text-fg-brand"
            >
              {show ? (
                <EyeOffIcon className="size-4" />
              ) : (
                <EyeIcon className="size-4" />
              )}
            </button>
          </div>
          <p
            className={cn(
              "px-1 text-xs leading-4",
              tooShort ? "text-fg-destructive" : "text-fg-secondary",
            )}
          >
            Usá al menos {MIN_LENGTH} caracteres.
          </p>
        </div>

        <Button
          type="submit"
          disabled={password.length < MIN_LENGTH}
          className="h-12 w-full rounded-full text-base font-medium tracking-tight"
        >
          Crear cuenta
        </Button>
      </form>
    </ModalSheet>
  );
}
