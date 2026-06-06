import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ScaledFrame } from "./scaled-frame";

export const metadata: Metadata = {
  title: "Sumate al Prode — Las White F.C.",
  description: "Prode oficial de Las White F.C. $500.000 en premios.",
};

type Prize = {
  place: string;
  amount: string;
  pattern: string;
  className: string;
  z: string;
};

const PRIZES: Prize[] = [
  {
    place: "1er Puesto",
    amount: "$350.000",
    pattern: "/images/pattern-blue.png",
    className: "rotate-[10deg] top-0",
    z: "z-30",
  },
  {
    place: "2do Puesto",
    amount: "$100.000",
    pattern: "/images/pattern-green.png",
    className: "top-[68px]",
    z: "z-20",
  },
  {
    place: "3er Puesto",
    amount: "$50.000",
    pattern: "/images/pattern-red.png",
    className: "-rotate-[10deg] top-[136px]",
    z: "z-10",
  },
];

function PrizeCard({ prize }: { prize: Prize }) {
  return (
    <div
      className={`absolute left-1/2 -translate-x-1/2 ${prize.className} ${prize.z}
        flex h-[120px] w-[200px] flex-col justify-end gap-1 overflow-hidden rounded-xl p-3
        drop-shadow-[0px_4px_2px_rgba(0,0,0,0.25)]`}
    >
      <Image
        src={prize.pattern}
        alt=""
        fill
        aria-hidden
        sizes="200px"
        className="-z-10 object-cover"
      />
      <p className="font-heading text-xs font-normal leading-3 tracking-tight text-white/95">
        {prize.place}
      </p>
      <p className="font-display text-sm font-black leading-[14px] tracking-tight text-white/95">
        {prize.amount}
      </p>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <div className="relative flex h-dvh w-full items-center justify-center overflow-hidden">
      {/* Background full-bleed (el overlay ya viene incluido en la imagen) */}
      <Image
        src="/images/onboarding-background.png"
        alt=""
        fill
        priority
        aria-hidden
        sizes="100vw"
        className="object-cover"
      />

      {/* Lienzo 393×852 escalado para entrar en cualquier viewport */}
      <ScaledFrame>
        <div className="relative h-[852px] w-full">
          {/* Container (layout exacto de Figma: pt-80 / pb-24 / px-20, gaps 40) */}
          <div className="flex h-full w-full flex-col items-center justify-between px-5 pb-6 pt-20">
            {/* Top: escudo + headline de premios */}
            <div className="flex w-full flex-col items-center gap-10">
              <Image
                src="/images/escudo-white.png"
                alt="Escudo Las White F.C."
                width={101}
                height={100}
                priority
                className="h-[100px] w-[101px] object-contain"
              />
              <div className="flex w-full flex-col items-center text-center text-white">
                <p className="font-heading text-[80px] font-black leading-[72px]">
                  $500.000
                </p>
                <p className="font-heading text-[60px] font-bold leading-[52px]">
                  EN PREMIOS
                </p>
              </div>
            </div>

            {/* Bottom: CTAs + caption */}
            <div className="flex w-full flex-col items-center gap-10">
              <div className="flex w-full flex-col items-stretch gap-2">
                <button
                  type="button"
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-white p-3 text-base font-medium tracking-tight text-white transition-colors hover:bg-white/10"
                >
                  <Image
                    src="/images/google-icon.svg"
                    alt=""
                    width={16}
                    height={16}
                    aria-hidden
                  />
                  Iniciar sesión con Google
                </button>
                <Link
                  href="/register"
                  className="flex h-12 w-full items-center justify-center rounded-full bg-white p-3 text-base font-medium tracking-tight text-[#001842] transition-colors hover:bg-white/90"
                >
                  Sumarme al Prode
                </Link>
              </div>
              <p className="w-full text-center text-[13px] leading-[18px] text-white/60">
                Prode oficial de Las White F.C.
              </p>
            </div>
          </div>

          {/* Cards de podio en abanico (posición absoluta sobre el lienzo).
              La card azul (z-30) queda al frente, tapando la parte inferior
              de "EN PREMIOS", tal como en Figma. */}
          <div className="absolute left-1/2 top-[340px] h-[256px] w-[240px] -translate-x-1/2">
            {PRIZES.map((prize) => (
              <PrizeCard key={prize.place} prize={prize} />
            ))}
          </div>
        </div>
      </ScaledFrame>
    </div>
  );
}
