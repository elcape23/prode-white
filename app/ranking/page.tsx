import Image from "next/image";
import { getRanking } from "@/lib/ranking";
import { RankingClient } from "./ranking-client";

export const dynamic = "force-dynamic";

export default async function RankingPage() {
  const ranked = await getRanking();

  return (
    <div className="w-full">
      {/* Tarjeta de ranking — Figma node 252:22438 */}
      <div className="overflow-hidden rounded-[16px] border border-border bg-card drop-shadow-[0px_4px_6px_rgba(0,0,0,0.15)]">
        {/* Encabezado del grupo */}
        <div className="flex items-center gap-3 bg-surface-sunken p-3">
          <span className="flex h-[37px] w-6 shrink-0 items-center justify-center">
            <Image
              src="/images/Trophy.png"
              alt=""
              width={24}
              height={37}
              className="h-full w-auto object-contain"
            />
          </span>
          <p className="flex-1 text-sm font-semibold leading-5 tracking-[-0.14px] text-fg-brand">
            Ranking
          </p>
        </div>

        {/* Filas */}
        {ranked.length === 0 ? (
          <p className="bg-card px-3 py-8 text-center text-[13px] text-fg-secondary">
            Todavía no hay participantes aprobados.
          </p>
        ) : (
          <RankingClient ranked={ranked} />
        )}
      </div>
    </div>
  );
}
