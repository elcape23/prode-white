"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home01Icon, FootballPitchIcon, RankingIcon, UserIcon } from "hugeicons-react";
import { cn } from "@/lib/utils";

// Variante "pill" flotante de la navbar (basada en Figma node 9:30581).
// La variante anterior sigue disponible en ./bottom-nav.tsx
const items = [
  { href: "/dashboard", icon: Home01Icon, label: "Home" },
  { href: "/pronosticos", icon: FootballPitchIcon, label: "Pronósticos" },
  { href: "/ranking", icon: RankingIcon, label: "Ranking" },
  { href: "/cuenta", icon: UserIcon, label: "Cuenta" },
];

export function BottomNavPill() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center px-5 pt-2 pb-5">
      <div className="flex items-center rounded-full border border-border/60 bg-surface-raised/70 px-3 py-1 shadow-lg backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-surface-raised/60">
        {items.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex h-20 w-20 flex-col items-center justify-center gap-2 overflow-hidden text-[13px] leading-4 tracking-[-0.13px] text-center transition-colors",
                active
                  ? "text-fg-default font-medium"
                  : "text-fg-tertiary font-normal hover:text-fg-secondary",
              )}
            >
              <span className="flex size-7 items-center justify-center p-0.5">
                <Icon size={24} strokeWidth={active ? 2 : 1.5} />
              </span>
              <span className="whitespace-nowrap">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
