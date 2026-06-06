"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home01Icon, FootballPitchIcon, ChampionIcon, RankingIcon } from "hugeicons-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", icon: Home01Icon, label: "Inicio" },
  { href: "/pronosticos", icon: FootballPitchIcon, label: "Pronósticos" },
  { href: "/bonus", icon: ChampionIcon, label: "Bonus" },
  { href: "/ranking", icon: RankingIcon, label: "Ranking" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface-raised border-t border-border z-50">
      <div className="max-w-lg mx-auto flex">
        {items.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex-1 flex flex-col items-center gap-0.5 py-2.5 w-[80px] h-[80px] text-xs  transition-colors",
                active ? "text-fg-brand font-medium" : "text-fg-tertiary hover:text-fg-secondary",
              )}
            >
              <Icon
                size={20}
                className="w-6 h-6"
                strokeWidth={active ? 2 : 1.5}
              />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
