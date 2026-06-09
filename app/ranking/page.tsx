import Image from "next/image";
import { getRanking } from "@/lib/ranking";

export const dynamic = "force-dynamic";

// Estilos de la medalla por posición (Figma node 252:22281 — .Ranking - Number).
// Las posiciones 1-3 usan oro/plata/bronce; el resto, contorno navy.
const MEDAL_STYLES = [
  "bg-[#f4e6ba] border-[#d4af37] text-[#b08e1f]", // 1° oro
  "bg-[#dbdbdb] border-[#8c8c8c] text-[#525252]", // 2° plata
  "bg-[#c08b57] border-[#9e6328] text-[#512e0b]", // 3° bronce
] as const;

const REGULAR_STYLE = "border-fg-brand text-fg-brand";

function RankBadge({ position }: { position: number }) {
  const style = MEDAL_STYLES[position - 1] ?? REGULAR_STYLE;
  return (
    <span
      className={`flex h-6 w-9 shrink-0 items-center justify-center overflow-hidden rounded-tl-md rounded-br-md border text-sm font-medium leading-5 tracking-[-0.14px] ${style}`}
    >
      {position}
    </span>
  );
}

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
          <div className="flex flex-col bg-card py-3">
            {ranked.map((p) => (
              <div key={p.id} className="flex items-center gap-2 px-3 py-2">
                <RankBadge position={p.position} />
                <p className="min-w-0 flex-1 truncate text-[13px] font-medium leading-4 tracking-[-0.13px] text-fg-brand">
                  {p.name}
                </p>
                <p className="shrink-0 text-[13px] leading-4 tracking-[-0.13px] text-fg-secondary">
                  {p.total} pts
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
