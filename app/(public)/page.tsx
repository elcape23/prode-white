import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center gap-8 py-8 text-center">
      {/* Shield / logo */}
      <div className="w-24 h-24 rounded-full bg-fill-brand flex items-center justify-center shadow-lg">
        <span className="text-white text-4xl font-black">W</span>
      </div>

      <div>
        <h1 className="text-3xl font-black tracking-tight text-fg-brand uppercase">
          Prode White
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Prode oficial de Las White F.C.
        </p>
      </div>

      {/* Prize pool */}
      <div className="w-full bg-surface-raised border rounded-xl p-5">
        <p className="text-xs uppercase tracking-widest text-fg-tertiary mb-1">Premio total</p>
        <p className="text-4xl font-black text-fg-accent">$480.000</p>
        <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
          <div>
            <p className="font-bold text-fg-default text-lg">$350k</p>
            <p className="text-fg-tertiary">1° puesto</p>
          </div>
          <div>
            <p className="font-bold text-fg-default text-lg">$100k</p>
            <p className="text-fg-tertiary">2° puesto</p>
          </div>
          <div>
            <p className="font-bold text-fg-default text-lg">$30k</p>
            <p className="text-fg-tertiary">3° puesto</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="w-full flex flex-col gap-3">
        <Link
          href="/register"
          className={cn(buttonVariants({ size: "lg" }), "w-full text-base font-bold h-12 flex items-center justify-center")}
        >
          Sumarme al Prode
        </Link>
        <div className="grid grid-cols-2 gap-2">
          <Link
            href="/ranking"
            className={cn(buttonVariants({ variant: "outline" }), "border-primary text-primary flex items-center justify-center")}
          >
            Ranking
          </Link>
          <Link
            href="/login"
            className={cn(buttonVariants({ variant: "outline" }), "border-primary text-primary flex items-center justify-center")}
          >
            Ya me anoté
          </Link>
        </div>
      </div>

      {/* Pricing info */}
      <div className="w-full border rounded-xl p-4 text-sm text-left space-y-2">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Valor general</span>
          <span className="font-bold">$8.000</span>
        </div>
        <div className="flex justify-between text-destructive">
          <span>Con código sponsor</span>
          <span className="font-bold">$5.200 (35% OFF)</span>
        </div>
        <p className="text-xs text-muted-foreground pt-1">
          10 cupos disponibles por sponsor
        </p>
      </div>
    </div>
  );
}
