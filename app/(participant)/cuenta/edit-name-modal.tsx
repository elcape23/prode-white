"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { updateParticipantName } from "@/actions/participant";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ModalSheet } from "@/app/onboarding/modal-sheet";

/**
 * Modal para editar Nombre y Apellido desde "Mi Cuenta".
 * Reutiliza el ModalSheet del onboarding para mantener el mismo
 * look & feel que los modales de inicio de sesión y registro.
 */
export function EditNameModal({
  open,
  onOpenChange,
  initialFirstName,
  initialLastName,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialFirstName: string;
  initialLastName: string;
}) {
  const router = useRouter();
  const [nombre, setNombre] = useState(initialFirstName);
  const [apellido, setApellido] = useState(initialLastName);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !apellido.trim()) {
      setError("Ingresá nombre y apellido.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await updateParticipantName(nombre.trim(), apellido.trim());
      if (result?.error) {
        setError(result.error);
        return;
      }
      onOpenChange(false);
      router.refresh();
    });
  };

  return (
    <ModalSheet open={open} onOpenChange={onOpenChange} title="Editar nombre">
      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="cuenta-nombre" className="px-1 text-fg-brand">
            Nombre
          </Label>
          <Input
            id="cuenta-nombre"
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
          <Label htmlFor="cuenta-apellido" className="px-1 text-fg-brand">
            Apellido
          </Label>
          <Input
            id="cuenta-apellido"
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
          disabled={isPending}
          className="h-12 w-full rounded-full text-base font-medium tracking-tight"
        >
          {isPending ? "Guardando..." : "Guardar"}
        </Button>
      </form>
    </ModalSheet>
  );
}
