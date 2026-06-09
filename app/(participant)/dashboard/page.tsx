import { verifyParticipant } from "@/lib/dal";
import prisma from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { ChampionIcon } from "hugeicons-react";
import { Header } from "@/components/layout/header";

export default async function DashboardPage() {
  const session = await verifyParticipant();

  // Get participant with points
  const participant = await prisma.participant.findUnique({
    where: { id: session.sub },
    include: {
      predictions: {
        select: { points: true },
        where: { points: { not: null } },
      },
      bonusPredictions: {
        select: { points: true },
        where: { points: { not: null } },
      },
    },
  });

  const matchPoints =
    participant?.predictions.reduce((s, p) => s + (p.points ?? 0), 0) ?? 0;
  const bonusPoints =
    participant?.bonusPredictions.reduce((s, p) => s + (p.points ?? 0), 0) ?? 0;
  const total = matchPoints + bonusPoints;

  // Get ranking position
  const allApproved = await prisma.participant.findMany({
    where: { status: "APPROVED" },
    include: {
      predictions: { select: { points: true } },
      bonusPredictions: { select: { points: true } },
    },
  });

  const ranked = allApproved
    .map((p) => ({
      id: p.id,
      total:
        p.predictions.reduce((s, pr) => s + (pr.points ?? 0), 0) +
        p.bonusPredictions.reduce((s, bp) => s + (bp.points ?? 0), 0),
    }))
    .sort((a, b) => b.total - a.total);

  const position = ranked.findIndex((p) => p.id === session.sub) + 1;

  // Prediction completion
  const totalMatches = await prisma.match.count({
    where: { tournamentId: "default-tournament" },
  });
  const myPredictions = await prisma.prediction.count({
    where: { participantId: session.sub },
  });

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header filled={myPredictions} total={totalMatches} />

      <main className="grid flex-1 grid-cols-2 content-start gap-2 bg-background p-5">
        {/* Hero — posición y puntos */}
        <Link
          href="/ranking"
          className="relative col-span-2 flex aspect-[353/170.5] items-end justify-between gap-2 overflow-hidden rounded-md p-4 drop-shadow-[0px_2px_3px_rgba(0,0,0,0.1)]"
        >
          {/* Fondo con patrón */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 size-[400px] -translate-x-1/2 -translate-y-1/2">
            <div className="absolute inset-0 bg-[#218af3]" />
            <div className="absolute inset-x-0 bottom-1/2 top-0 rounded-bl-[10000px] bg-[#82b2fd]" />
            <div className="absolute inset-x-0 bottom-0 top-1/2 rounded-tl-[10000px] bg-[#2f71a5]" />
          </div>

          <div className="relative flex h-full flex-1 flex-col items-start justify-between text-white">
            <div className="flex flex-col items-start">
              <p className="font-display text-[60px] font-black leading-[52px] tracking-tight">
                {position > 0 ? position : "—"}
              </p>
              <p className="px-0.5 font-heading text-[13px] leading-4 tracking-tight">
                Posición
              </p>
            </div>
            <p className="flex items-baseline gap-1 font-heading text-[28px] font-medium leading-9">
              <span>{total}</span>
              <span>pts</span>
            </p>
          </div>

          <div className="relative flex h-[50px] w-8 shrink-0 items-center justify-center">
            <Image
              src="/images/wc-logo-white.svg"
              alt="World Cup 2026"
              width={32}
              height={50}
              className="h-full w-auto object-contain"
            />
          </div>
        </Link>

        {/* Pronósticos */}
        <Tile
          href="/pronosticos"
          icon={
            <Image
              src="/images/ball.png"
              alt=""
              width={40}
              height={40}
              className="size-10 object-contain"
            />
          }
          title="Pronósticos"
        />

        {/* Bonus */}
        <Tile
          href="/bonus"
          icon={
            <Image
              src="/images/kit.png"
              alt=""
              width={40}
              height={40}
              className="size-10 object-contain"
            />
          }
          title="Bonus"
        />

        {/* Ranking — ancho completo */}
        <Tile
          href="/ranking"
          icon={
            <Image
              src="/images/Trophy.png"
              alt=""
              width={40}
              height={40}
              className="size-10 object-contain"
            />
          }
          title="Ranking"
          wide
        />
      </main>
    </div>
  );
}

type TileProps = {
  href: string;
  icon: React.ReactNode;
  title: string;
  wide?: boolean;
};

function Tile({ href, icon, title, wide }: TileProps) {
  return (
    <Link
      href={href}
      className={`relative flex flex-col items-start justify-end gap-2 overflow-hidden rounded-md border border-border bg-card p-4 shadow-[0px_2px_6px_0px_rgba(0,0,0,0.1)] ${
        wide ? "col-span-2 h-[165px]" : "aspect-square"
      }`}
    >
      {/* Fondo con patrón sutil */}
      <div className="pointer-events-none absolute inset-0 -scale-x-100 opacity-10">
        <div className="absolute inset-0 bg-[#b5cadf]" />
        <div className="absolute inset-x-0 bottom-1/2 top-0 rounded-br-[10000px] bg-[#d7e6ff]" />
        <div className="absolute inset-x-0 bottom-0 top-1/2 rounded-tr-[10000px] bg-[#899cab]" />
      </div>

      <span className="relative flex size-10 items-center justify-center">
        {icon}
      </span>
      <p className="relative text-base font-medium leading-5 tracking-tight text-fg-brand">
        {title}
      </p>
    </Link>
  );
}
