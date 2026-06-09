"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FootballIcon,
  FootballPitchIcon,
  Home01Icon,
  RankingIcon,
  UserIcon,
} from "hugeicons-react";
import { cn } from "@/lib/utils";

// Navbar inferior — full width con borde superior (Figma node 166:18200).
const items = [
  { href: "/bonus", icon: FootballIcon, label: "Bonus" },
  { href: "/pronosticos", icon: FootballPitchIcon, label: "Pronósticos" },
  { href: "/dashboard", icon: Home01Icon, label: "Home" },
  { href: "/ranking", icon: RankingIcon, label: "Ranking" },
  { href: "/cuenta", icon: UserIcon, label: "Cuenta" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card px-5 pb-5 pt-2">
      <div className="mx-auto flex max-w-lg items-center justify-between">
        {items.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex size-15 flex-col items-center justify-center gap-2 text-center text-[13px] leading-4 tracking-[-0.13px] transition-colors",
                active
                  ? "font-medium text-fg-brand"
                  : "font-normal text-fg-secondary hover:text-fg-default",
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
