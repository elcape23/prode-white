"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { submitRegistration } from "@/actions/registration";
import { GENERAL_PRICE, SPONSOR_PRICE } from "@/lib/sponsor-codes";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

type CodeStatus =
  | { state: "idle" }
  | { state: "loading" }
  | { state: "valid"; sponsorName: string; spotsLeft: number }
  | { state: "invalid"; reason: string };

export default function RegisterPage() {
  const [formState, action, pending] = useActionState(submitRegistration, undefined);
  const err = formState && "error" in formState ? formState : null;
  const [codeStatus, setCodeStatus] = useState<CodeStatus>({ state: "idle" });
  const [price, setPrice] = useState(GENERAL_PRICE);

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value.trim().toUpperCase();
    if (!code) {
      setCodeStatus({ state: "idle" });
      setPrice(GENERAL_PRICE);
      return;
    }

    setCodeStatus({ state: "loading" });

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/sponsor-code?code=${encodeURIComponent(code)}`);
        const data = await res.json();
        if (data.valid) {
          setCodeStatus({
            state: "valid",
            sponsorName: data.sponsorName,
            spotsLeft: data.spotsLeft,
          });
          setPrice(SPONSOR_PRICE);
        } else {
          setCodeStatus({ state: "invalid", reason: data.reason ?? "Código inválido o sin cupo." });
          setPrice(GENERAL_PRICE);
        }
      } catch {
        setCodeStatus({ state: "idle" });
      }
    }, 500);

    return () => clearTimeout(timer);
  };

  // Reset on mount
  useEffect(() => {
    setCodeStatus({ state: "idle" });
    setPrice(GENERAL_PRICE);
  }, []);

  if (formState && "success" in formState) {
    return (
      <div className="flex flex-col items-center gap-6 py-8 text-center">
        <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
          <span className="text-3xl">✅</span>
        </div>
        <div>
          <h2 className="text-xl font-bold text-fg-brand">¡Solicitud enviada!</h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Tu inscripción está <strong>pendiente de aprobación</strong>. Una vez que
            confirmemos tu pago te enviamos el PIN de acceso por WhatsApp.
          </p>
        </div>
        <Link href="/" className={cn(buttonVariants({ variant: "outline" }), "w-full flex items-center justify-center")}>
          Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 py-4">
      <div className="text-center">
        <h1 className="text-2xl font-black text-fg-brand uppercase">
          Sumarme al Prode
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Completá el formulario y enviá tu comprobante de pago
        </p>
      </div>

      {/* Price display */}
      <div className="bg-surface-raised border rounded-xl p-4 text-center">
        <p className="text-xs uppercase tracking-widest text-fg-tertiary">Valor de inscripción</p>
        <p className="text-3xl font-black mt-1 text-fg-default">
          ${price.toLocaleString("es-AR")}
        </p>
        {price === SPONSOR_PRICE && (
          <Badge className="mt-1 bg-accent text-accent-foreground text-xs font-bold">
            35% OFF — Código sponsor aplicado
          </Badge>
        )}
      </div>

      <form action={action} className="flex flex-col gap-4">
        {err?.error && (
          <Alert variant="destructive">
            <AlertDescription>{err.error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="name">Nombre y apellido *</Label>
          <Input id="name" name="name" placeholder="Juan García" required />
          {err?.field === "name" && (
            <p className="text-xs text-destructive">{err.error}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phone">Teléfono / WhatsApp *</Label>
          <Input id="phone" name="phone" type="tel" placeholder="11 1234 5678" required />
          {err?.field === "phone" && (
            <p className="text-xs text-destructive">{err.error}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="sponsorCode">
            Código sponsor{" "}
            <span className="text-muted-foreground font-normal">(opcional)</span>
          </Label>
          <Input
            id="sponsorCode"
            name="sponsorCode"
            placeholder="Ej: GBC35OFF"
            className="uppercase"
            onChange={handleCodeChange}
          />
          {codeStatus.state === "loading" && (
            <p className="text-xs text-muted-foreground">Verificando código...</p>
          )}
          {codeStatus.state === "valid" && (
            <p className="text-xs text-fg-success">
              ✓ {codeStatus.sponsorName} — {codeStatus.spotsLeft} cupos disponibles
            </p>
          )}
          {codeStatus.state === "invalid" && (
            <p className="text-xs text-destructive">{codeStatus.reason}</p>
          )}
          {err?.field === "sponsorCode" && (
            <p className="text-xs text-destructive">{err.error}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="paymentReference">Referencia de pago *</Label>
          <Input
            id="paymentReference"
            name="paymentReference"
            placeholder="Nombre del titular o nro. de comprobante"
            required
          />
          <p className="text-xs text-muted-foreground">
            Alias: <strong>A DEFINIR</strong> · CBU: <strong>A DEFINIR</strong>
          </p>
          {err?.field === "paymentReference" && (
            <p className="text-xs text-destructive">{err.error}</p>
          )}
        </div>

        <div className="border rounded-xl p-4 text-sm space-y-2 bg-muted/40">
          <p className="font-medium">¿Cómo pagar?</p>
          <p className="text-muted-foreground text-xs">
            1. Transferí ${price.toLocaleString("es-AR")} al alias / CBU indicado arriba.<br />
            2. Enviá el comprobante por WhatsApp al{" "}
            <strong>A DEFINIR</strong>.<br />
            3. Una vez confirmado el pago te enviamos tu PIN de acceso.
          </p>
        </div>

        <Button
          type="submit"
          disabled={pending}
          className="w-full h-12 font-bold text-base"
        >
          {pending ? "Enviando..." : "Solicitar acceso"}
        </Button>
      </form>
    </div>
  );
}
