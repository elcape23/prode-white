"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginParticipant } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function LoginPage() {
  const [state, action, pending] = useActionState(loginParticipant, undefined);

  return (
    <div className="flex flex-col gap-6 py-4">
      <div className="text-center">
        <h1 className="text-2xl font-black text-[var(--color-navy)] uppercase">
          Ingresar
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Ingresá con tu teléfono y el PIN que te enviamos al ser aprobado
        </p>
      </div>

      <form action={action} className="flex flex-col gap-4">
        {state?.error && (
          <Alert variant="destructive">
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="phone">Teléfono / WhatsApp</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="11 1234 5678"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="pin">PIN</Label>
          <Input
            id="pin"
            name="pin"
            type="password"
            placeholder="Tu PIN de acceso"
            required
          />
        </div>

        <Button type="submit" disabled={pending} className="w-full h-11 font-bold">
          {pending ? "Ingresando..." : "Ingresar"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        ¿Aún no te anotaste?{" "}
        <Link href="/register" className="text-[var(--color-navy)] font-medium underline">
          Registrate acá
        </Link>
      </p>
    </div>
  );
}
