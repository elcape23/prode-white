"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  FootballIcon,
  FootballPitchIcon,
  Home01Icon,
  RankingIcon,
} from "hugeicons-react";
import { cn } from "@/lib/utils";

// Navbar inferior — full width con borde superior (Figma node 166:18200).
const items = [
  { href: "/dashboard", icon: Home01Icon, label: "Home" },
  { href: "/pronosticos", icon: FootballPitchIcon, label: "Pronósticos" },
  { href: "/bonus", icon: FootballIcon, label: "Bonus" },
  { href: "/ranking", icon: RankingIcon, label: "Ranking" },
];

export function BottomNav() {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    lastY.current = 0;
    setHidden(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > lastY.current && y > 60);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={cn("fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-2 transition-transform duration-300", hidden && "translate-y-full")}>
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
