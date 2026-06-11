import { verifyParticipant } from "@/lib/dal";
import prisma from "@/lib/prisma";
import { getParticipantRanking } from "@/lib/ranking";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/layout/header";
import { InscriptionHome } from "./inscription-home";
import { PaymentOnboardingModal } from "./payment-onboarding-modal";
import { MatchCards, type FeaturedMatch } from "./match-cards";

export default async function DashboardPage() {
  const session = await verifyParticipant();

  // Get participant (only metadata needed; puntos y posición vienen del
  // ranking real compartido con la página de Ranking).
  const participant = await prisma.participant.findUnique({
    where: { id: session.sub },
  });

  const displayName = participant?.name ?? session.name;

  // El modal de onboarding de pago aparece automáticamente la primera vez
  // que cualquier participante entra al dashboard (todos requieren aprobación).
  const showOnboarding = !!participant && !participant.hasSeenWelcome;

  // Usuarios que todavía no están dentro del juego (sin aprobar) ven la
  // home de inscripción en vez del tablero de puntos. (Figma 252:5393)
  if (!participant || participant.status !== "APPROVED") {
    return (
      <div className="flex flex-1 flex-col bg-background">
        <Header name={displayName} />
        <InscriptionHome />
        {showOnboarding && <PaymentOnboardingModal />}
      </div>
    );
  }

  // Posición y puntos reales, calculados con el mismo ranking que la página
  // de Ranking para que el dato del card coincida exactamente.
  const { position, total } = await getParticipantRanking(session.sub);

  // Partidos "por comenzar": el saque está dentro de los próximos 30 minutos
  // o ya arrancó y sigue en juego (ventana de ~2.5 h) y todavía no se cargó el
  // resultado. Según cuántos haya, la home muestra el diseño "on-match" (uno)
  // o "on-matches" (varios). (Figma 263:11337 / 263:11868)
  // eslint-disable-next-line react-hooks/purity -- server component: hora actual de render
  const NOW = Date.now();
  const THIRTY_MIN = 30 * 60 * 1000;
  const LIVE_WINDOW = 2.5 * 60 * 60 * 1000;
  const featuredMatches: FeaturedMatch[] = await prisma.match.findMany({
    where: {
      resultEnteredAt: null,
      scheduledAt: {
        gte: new Date(NOW - LIVE_WINDOW),
        lte: new Date(NOW + THIRTY_MIN),
      },
    },
    orderBy: { scheduledAt: "asc" },
    select: {
      id: true,
      round: true,
      homeTeam: true,
      awayTeam: true,
      scheduledAt: true,
      homeScore: true,
      awayScore: true,
    },
  });

  return (
    <div className="flex flex-1 flex-col bg-background">
      <Header name={displayName} />

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

          <div className="relative flex self-stretch flex-1 flex-col items-start justify-between h-full text-white">
            <div className="flex flex-col items-start pt-2">
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

        {/* Partido(s) por comenzar — diseño Figma 263:11337 / 263:11868.
            El layout (horizontal vs. cuadrado) depende de cuántos haya. */}
        <MatchCards matches={featuredMatches} />

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
      {showOnboarding && <PaymentOnboardingModal />}
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
