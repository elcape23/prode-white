"use client";

import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ModalSheet } from "./modal-sheet";

/**
 * Modal de inicio de sesión (Figma node 254-5544): un solo sheet con
 * Email + Contraseña y botón "Continuar".
 */
export function LoginModal({
  open,
  onOpenChange,
  onContinue,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Confirma las credenciales e inicia sesión. */
  onContinue: (email: string, password: string, rememberMe: boolean) => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    onContinue(email.trim(), password, rememberMe);
  };

  return (
    <ModalSheet open={open} onOpenChange={onOpenChange} title="Iniciar sesión">
      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
        <div className="flex flex-col gap-1">
          <Label htmlFor="login-email" className="px-1 text-fg-brand">
            Email
          </Label>
          <Input
            id="login-email"
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

        <div className="flex flex-col gap-1">
          <Label htmlFor="login-password" className="px-1 text-fg-brand">
            Contraseña
          </Label>
          <div className="relative">
            <Input
              id="login-password"
              name="password"
              type={show ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tu contraseña"
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
        </div>

        <label className="flex cursor-pointer items-center gap-2 px-1">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="size-4 accent-fg-brand"
          />
          <span className="text-sm text-fg-secondary">Recordarme</span>
        </label>

        <Button
          type="submit"
          className="mt-1 h-12 w-full rounded-full text-base font-medium tracking-tight"
        >
          Continuar
        </Button>
      </form>
    </ModalSheet>
  );
}
