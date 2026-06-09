"use client";

import { useState, useTransition } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { registerWithEmail } from "@/actions/auth-email";
import { EmailModal } from "./email-modal";
import { PasswordModal } from "./password-modal";

type Step = "none" | "email" | "password";

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

  return (
    <div className="flex w-full flex-col items-stretch gap-2">
      <Button
        variant="outline"
        className="h-12 w-full rounded-full border-white bg-transparent text-base font-medium tracking-tight text-white hover:bg-white/10 hover:text-white"
      >
        <Image
          src="/images/google-icon.svg"
          alt=""
          width={16}
          height={16}
          aria-hidden
        />
        Iniciar sesión con Google
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
    </div>
  );
}
