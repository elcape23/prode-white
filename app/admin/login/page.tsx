"use client";

import { useActionState } from "react";
import { loginAdmin } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AdminLoginPage() {
  const [state, action, pending] = useActionState(loginAdmin, undefined);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="bg-card rounded-2xl shadow-xl p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-fill-brand mx-auto flex items-center justify-center mb-3">
            <span className="text-white font-black text-xl">W</span>
          </div>
          <h1 className="text-xl font-black text-fg-brand">Admin</h1>
          <p className="text-sm text-muted-foreground">Prode White</p>
        </div>

        <form action={action} className="flex flex-col gap-4">
          {state?.error && (
            <Alert variant="destructive">
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="admin@prodewhite.com"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
            />
          </div>

          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              name="rememberMe"
              value="true"
              className="size-4 accent-fg-brand"
            />
            <span className="text-sm text-muted-foreground">Recordarme</span>
          </label>

          <Button type="submit" disabled={pending} className="w-full h-11 font-bold mt-2">
            {pending ? "Ingresando..." : "Ingresar"}
          </Button>
        </form>
      </div>
    </div>
  );
}
