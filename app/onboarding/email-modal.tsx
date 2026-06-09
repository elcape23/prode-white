"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ModalSheet } from "./modal-sheet";

export function EmailModal({
  open,
  onOpenChange,
  onContinue,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Avanza al siguiente paso con el email ingresado. */
  onContinue: (email: string) => void;
}) {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    onContinue(email.trim());
  };

  return (
    <ModalSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Ingresar email"
      description="Te enviaremos un email para confirmar tu cuenta"
    >
      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5">
        <div className="flex flex-col gap-1">
          <Label htmlFor="onboarding-email" className="px-1 text-fg-brand">
            Email
          </Label>
          <Input
            id="onboarding-email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="hincha@prodewhite.com"
            className="h-10 rounded-lg px-3 text-sm"
          />
        </div>

        <Button
          type="submit"
          className="h-12 w-full rounded-full text-base font-medium tracking-tight"
        >
          Continuar
        </Button>
      </form>
    </ModalSheet>
  );
}
