"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { loginWithEmail, registerWithEmail } from "@/actions/auth-email";
import { EmailModal } from "./email-modal";
import { PasswordModal } from "./password-modal";
import { LoginModal } from "./login-modal";

type Step = "none" | "email" | "password" | "login";

export function OnboardingButtons() {
  const [step, setStep] = useState<Step>("none");
  const [email, setEmail] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handlePasswordContinue = (password: string) => {
    setStep("none");
    setAuthError(null);
    startTransition(async () => {
      const result = await registerWithEmail(email, password);
      if (result?.error) {
        setAuthError(result.error);
      }
    });
  };

  const handleLoginContinue = (loginEmail: string, password: string) => {
    setStep("none");
    setAuthError(null);
    startTransition(async () => {
      const result = await loginWithEmail(loginEmail, password);
      if (result?.error) {
        setAuthError(result.error);
      }
    });
  };

  return (
    <div className="flex w-full flex-col items-stretch gap-2">
      <Button
        variant="outline"
        className="h-12 w-full rounded-full border-white bg-transparent text-base font-medium tracking-tight text-white hover:bg-white/10 hover:text-white"
        onClick={() => setStep("login")}
        disabled={isPending}
      >
        Iniciar sesión
      </Button>

      <Button
        className="h-12 w-full rounded-full bg-white text-base font-medium tracking-tight text-[#001842] hover:bg-white/90"
        onClick={() => setStep("email")}
        disabled={isPending}
      >
        {isPending ? "Creando cuenta..." : "Sumarme al Prode"}
      </Button>

      {authError && (
        <p className="text-center text-sm text-red-300">{authError}</p>
      )}

      <EmailModal
        open={step === "email"}
        onOpenChange={(open) => setStep(open ? "email" : "none")}
        onContinue={(value) => {
          setEmail(value);
          setStep("password");
        }}
      />

      <PasswordModal
        open={step === "password"}
        onOpenChange={(open) => setStep(open ? "password" : "none")}
        onContinue={handlePasswordContinue}
      />

      <LoginModal
        open={step === "login"}
        onOpenChange={(open) => setStep(open ? "login" : "none")}
        onContinue={handleLoginContinue}
      />
    </div>
  );
}
