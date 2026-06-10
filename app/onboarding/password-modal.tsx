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
  const [repeat, setRepeat] = useState("");
  const [show, setShow] = useState(false);
  const [showRepeat, setShowRepeat] = useState(false);
  const tooShort = password.length > 0 && password.length < MIN_LENGTH;
  const mismatch = repeat.length > 0 && password !== repeat;
  const valid = password.length >= MIN_LENGTH && password === repeat;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    onContinue(password);
  };

  return (
    <ModalSheet open={open} onOpenChange={onOpenChange} title="Contraseña">
      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
        <div className="flex flex-col gap-1.5">
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
              placeholder=""
              aria-invalid={tooShort}
              className="h-12 rounded-2xl px-4 pr-11 text-base"
            />
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-fg-secondary transition-colors hover:text-fg-brand"
            >
              {show ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
            </button>
          </div>
          {tooShort && (
            <p className="px-1 text-xs leading-4 text-fg-destructive">
              Usá al menos {MIN_LENGTH} caracteres.
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="onboarding-repeat" className="px-1 text-fg-brand">
            Repetir Contraseña
          </Label>
          <div className="relative">
            <Input
              id="onboarding-repeat"
              name="repeatPassword"
              type={showRepeat ? "text" : "password"}
              autoComplete="new-password"
              required
              value={repeat}
              onChange={(e) => setRepeat(e.target.value)}
              placeholder=""
              aria-invalid={mismatch}
              className={cn("h-12 rounded-2xl px-4 pr-11 text-base", mismatch && "border-destructive")}
            />
            <button
              type="button"
              onClick={() => setShowRepeat((v) => !v)}
              aria-label={showRepeat ? "Ocultar contraseña" : "Mostrar contraseña"}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-fg-secondary transition-colors hover:text-fg-brand"
            >
              {showRepeat ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
            </button>
          </div>
          {mismatch && (
            <p className="px-1 text-xs leading-4 text-fg-destructive">
              Las contraseñas no coinciden.
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={!valid}
          className="h-12 w-full rounded-full text-base font-medium tracking-tight"
        >
          Continuar
        </Button>
      </form>
    </ModalSheet>
  );
}
