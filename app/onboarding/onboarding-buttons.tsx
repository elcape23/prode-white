"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { loginWithEmail, registerWithEmail } from "@/actions/auth-email";
import { EmailModal } from "./email-modal";
import { NameModal } from "./name-modal";
import { PhoneModal } from "./phone-modal";
import { PasswordModal } from "./password-modal";
import { LoginModal } from "./login-modal";

type Step = "none" | "email" | "name" | "phone" | "password" | "login";
type LoadingFor = "login" | "register" | null;

export function OnboardingButtons() {
  const [step, setStep] = useState<Step>("none");
  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [phone, setPhone] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [loadingFor, setLoadingFor] = useState<LoadingFor>(null);
  const [isPending, startTransition] = useTransition();

  const handlePasswordContinue = (password: string) => {
    setStep("none");
    setAuthError(null);
    setLoadingFor("register");
    startTransition(async () => {
      const result = await registerWithEmail(email, `${nombre} ${apellido}`, phone, password);
      if (result?.error) {
        setAuthError(result.error);
        setLoadingFor(null);
      }
    });
  };

  const handleLoginContinue = (loginEmail: string, password: string, rememberMe: boolean) => {
    setStep("none");
    setAuthError(null);
    setLoadingFor("login");
    startTransition(async () => {
      const result = await loginWithEmail(loginEmail, password, rememberMe);
      if (result?.error) {
        setAuthError(result.error);
        setLoadingFor(null);
      }
    });
  };

  return (
    <>
      {isPending && loadingFor && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-[#001842]/95 backdrop-blur-sm">
          <Loader2 className="size-10 animate-spin text-white" />
          <p className="font-sans text-base font-semibold text-white">
            {loadingFor === "login" ? "Iniciando sesión..." : "Creando cuenta..."}
          </p>
        </div>
      )}

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
        Sumarme al Prode
      </Button>

      {authError && (
        <p className="text-center text-sm text-red-300">{authError}</p>
      )}

      <EmailModal
        open={step === "email"}
        onOpenChange={(open) => setStep(open ? "email" : "none")}
        onContinue={(value) => {
          setEmail(value);
          setStep("name");
        }}
      />

      <NameModal
        open={step === "name"}
        onOpenChange={(open) => setStep(open ? "name" : "none")}
        onContinue={(n, a) => {
          setNombre(n);
          setApellido(a);
          setStep("phone");
        }}
      />

      <PhoneModal
        open={step === "phone"}
        onOpenChange={(open) => setStep(open ? "phone" : "none")}
        onContinue={(p) => {
          setPhone(p);
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
    </>
  );
}
