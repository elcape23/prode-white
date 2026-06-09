"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function OnboardingButtons() {
  const router = useRouter();

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
        onClick={() => router.push("/register")}
      >
        Sumarme al Prode
      </Button>
    </div>
  );
}
