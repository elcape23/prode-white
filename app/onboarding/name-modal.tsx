"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ModalSheet } from "./modal-sheet";

export function NameModal({
  open,
  onOpenChange,
  onContinue,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContinue: (nombre: string, apellido: string) => void;
}) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !apellido.trim()) return;
    onContinue(nombre.trim(), apellido.trim());
  };

  return (
    <ModalSheet open={open} onOpenChange={onOpenChange} title="Nombre">
      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="onboarding-nombre" className="px-1 text-fg-brand">
            Nombre
          </Label>
          <Input
            id="onboarding-nombre"
            name="nombre"
            type="text"
            autoComplete="given-name"
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="h-12 rounded-2xl px-4 text-base"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="onboarding-apellido" className="px-1 text-fg-brand">
            Apellido
          </Label>
          <Input
            id="onboarding-apellido"
            name="apellido"
            type="text"
            autoComplete="family-name"
            required
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
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
