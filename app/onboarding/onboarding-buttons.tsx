"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { EmailModal } from "./email-modal";
import { PasswordModal } from "./password-modal";

type Step = "none" | "email" | "password";

export function OnboardingButtons() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("none");
  const [email, setEmail] = useState("");

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
      >
        Sumarme al Prode
      </Button>

      {/* Paso 1: email */}
      <EmailModal
        open={step === "email"}
        onOpenChange={(open) => setStep(open ? "email" : "none")}
        onContinue={(value) => {
          setEmail(value);
          setStep("password");
        }}
      />

      {/* Paso 2: contraseña */}
      <PasswordModal
        open={step === "password"}
        onOpenChange={(open) => setStep(open ? "password" : "none")}
        onContinue={() => {
          setStep("none");
          router.push(`/register?email=${encodeURIComponent(email)}`);
        }}
      />
    </div>
  );
}
