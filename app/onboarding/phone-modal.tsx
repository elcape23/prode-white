"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ModalSheet } from "./modal-sheet";

export function PhoneModal({
  open,
  onOpenChange,
  onContinue,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContinue: (phone: string) => void;
}) {
  const [phone, setPhone] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;
    onContinue(phone.trim());
  };

  return (
    <ModalSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Celular"
      description="Te enviaremos por aquí cuando tu acceso sea aprobado"
    >
      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="onboarding-phone" className="px-1 text-fg-brand">
            Número de celular
          </Label>
          <Input
            id="onboarding-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="h-12 rounded-2xl px-4 text-base"
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
