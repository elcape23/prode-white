import Image from "next/image";

/**
 * Home para usuarios que todavía no están dentro del juego (status ≠ APPROVED).
 * Diseño: Figma node 252:5393 — "01 / Onboarding".
 * Tarjeta de Inscripción + CTAs "Enviar Comprobante" / "Solicitar acceso".
 */
export function InscriptionHome({ amount = "$10.000" }: { amount?: string }) {
  return (
    <main className="flex flex-1 flex-col justify-end gap-6 bg-background p-5">
      {/* Tarjeta de inscripción */}
      <div className="relative flex aspect-[353/200] items-end gap-2 overflow-hidden rounded-md p-4 drop-shadow-[0px_2px_3px_rgba(0,0,0,0.1)]">
        {/* Fondo con patrón (rosa/durazno) */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 size-[400px] -translate-x-1/2 -translate-y-1/2">
          <div className="absolute inset-0 bg-[#f23c77]" />
          <div className="absolute inset-x-0 bottom-1/2 top-0 rounded-bl-[10000px] bg-[#fb97a3]" />
          <div className="absolute inset-x-0 bottom-0 top-1/2 rounded-tl-[10000px] bg-[#f7ab9d]" />
        </div>

        {/* Texto */}
        <div className="relative flex h-full flex-1 flex-col items-start justify-between text-white">
          <p className="px-0.5 font-heading text-sm leading-5 tracking-tight">
            Inscripción
          </p>
          <p className="font-heading text-[28px] leading-9 tracking-tight">
            {amount}
          </p>
        </div>

        {/* Logo Mundial */}
        <div className="relative flex h-[50px] w-8 shrink-0 items-center justify-center">
          <Image
            src="/images/wc-logo-white.svg"
            alt="World Cup 2026"
            width={32}
            height={50}
            className="h-full w-auto object-contain"
          />
        </div>
      </div>

      {/* CTAs */}
      <div className="flex w-full flex-col items-start justify-end gap-2">
        <button
          type="button"
          className="flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-full border-[1.5px] border-fg-brand px-4 text-base font-medium leading-5 tracking-tight text-fg-brand transition-colors hover:bg-fill-brand-subtle"
        >
          Enviar Comprobante
        </button>
        <button
          type="button"
          className="flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-fill-brand px-4 text-base font-medium leading-5 tracking-tight text-fg-on-brand transition-colors hover:bg-fill-brand-hover"
        >
          Solicitar acceso
        </button>
      </div>
    </main>
  );
}
