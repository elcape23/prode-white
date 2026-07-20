"use client";

import { useState, useTransition } from "react";
import { ArrowDown01Icon, GlobeIcon, SquareLock02Icon } from "hugeicons-react";
import {
  getParticipantBonusPredictions,
  getParticipantPredictions,
  type BonusEntry,
  type PredictionEntry,
} from "@/actions/participants";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { flagSrc, teamNameShort } from "@/lib/flags";
import { Skeleton } from "@/components/ui/skeleton";
import type { RankedParticipant } from "@/lib/ranking";

// ─── Rank badge (mirrors server page) ────────────────────────────────────────

const MEDAL_STYLES = [
  "bg-[#f4e6ba] border-[#d4af37] text-[#b08e1f]",
  "bg-[#dbdbdb] border-[#8c8c8c] text-[#525252]",
  "bg-[#c08b57] border-[#9e6328] text-[#512e0b]",
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

// ─── Flag (mirrors prediction-card.tsx) ──────────────────────────────────────

function Flag({ team }: { team: string }) {
  const src = flagSrc(team);
  return (
    <div className="flex h-6 w-9 shrink-0 items-center justify-center overflow-hidden rounded-br-lg rounded-tl-lg border border-[color:var(--color-neutral-300)] bg-muted">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={`Bandera de ${team}`}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      ) : (
        <GlobeIcon size={12} className="text-fg-tertiary" strokeWidth={1.5} />
      )}
    </div>
  );
}

// ─── Read-only match row (mirrors MatchRow, always disabled) ─────────────────

const LOCK_MS = 30 * 60 * 1000;

function ReadonlyMatchRow({ entry }: { entry: PredictionEntry }) {
  const locked = new Date(entry.scheduledAt).getTime() - LOCK_MS - Date.now() <= 0;

  return (
    <div className={`flex w-full flex-col gap-1 px-3 ${locked ? "opacity-60" : ""}`}>
      <div className="flex items-center justify-center gap-3">
        {/* Equipo local */}
        <div className="flex min-w-0 flex-1 items-center justify-end gap-1">
          <p className="min-w-0 flex-1 truncate text-right text-[13px] font-medium tracking-tight text-foreground">
            {teamNameShort(entry.homeTeam)}
          </p>
          <Flag team={entry.homeTeam} />
        </div>

        {/* Marcador (siempre deshabilitado) */}
        <div className="flex shrink-0 items-center gap-1">
          <input
            type="number"
            readOnly
            aria-label={`Goles ${entry.homeTeam}`}
            value={entry.home ?? ""}
            className="size-10 shrink-0 rounded-lg border border-[color:var(--color-input)] bg-muted text-center text-base font-medium text-fg-disabled tabular-nums [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          <span className="text-base font-medium text-fg-secondary">-</span>
          <input
            type="number"
            readOnly
            aria-label={`Goles ${entry.awayTeam}`}
            value={entry.away ?? ""}
            className="size-10 shrink-0 rounded-lg border border-[color:var(--color-input)] bg-muted text-center text-base font-medium text-fg-disabled tabular-nums [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
        </div>

        {/* Equipo visitante */}
        <div className="flex min-w-0 flex-1 items-center gap-1">
          <Flag team={entry.awayTeam} />
          <p className="min-w-0 flex-1 truncate text-left text-[13px] font-medium tracking-tight text-foreground">
            {teamNameShort(entry.awayTeam)}
          </p>
        </div>
      </div>

      {locked && (
        <div className="flex h-3 items-center justify-center">
          <span className="flex items-center gap-1 text-[11px] text-fg-tertiary">
            <SquareLock02Icon size={12} strokeWidth={2} /> Cerrado
          </span>
        </div>
      )}
    </div>
  );
}

// ─── GroupCard (exact copy of pronosticos-client.tsx GroupCard) ───────────────

function GroupCard({ title, entries }: { title: string; entries: PredictionEntry[] }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="w-full overflow-hidden rounded-2xl bg-card shadow-[0px_4px_12px_0px_rgba(0,0,0,0.15)]">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 bg-[#F8F8F8] p-3 text-left"
      >
        <div className="flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-md">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo.svg" alt="" className="size-7 object-contain" />
        </div>
        <span className="flex-1 text-sm font-semibold tracking-tight text-foreground">
          {title}
        </span>
        <ArrowDown01Icon
          size={20}
          className={`text-fg-secondary transition-transform ${open ? "" : "-rotate-180"}`}
          strokeWidth={2}
        />
      </button>

      {open && (
        <div className="flex flex-col gap-6 py-6">
          {entries.map((entry) => (
            <ReadonlyMatchRow key={entry.matchId} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Bonus card (mirrors GroupCard, shows bonus picks) ───────────────────────

const BONUS_FIELDS: { position: string; label: string; isCountry: boolean }[] = [
  { position: "CHAMPION", label: "Equipo campeón", isCountry: true },
  { position: "BEST_PLAYER", label: "Mejor jugador", isCountry: false },
  { position: "TOP_SCORER", label: "Goleador", isCountry: false },
  { position: "BEST_YOUNG_PLAYER", label: "Mejor jugador jóven", isCountry: false },
];

function BonusCard({ bonus }: { bonus: BonusEntry[] }) {
  const [open, setOpen] = useState(true);
  const byPosition = new Map(bonus.map((b) => [b.position, b]));

  return (
    <div className="w-full overflow-hidden rounded-2xl bg-card shadow-[0px_4px_12px_0px_rgba(0,0,0,0.15)]">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 bg-[#F8F8F8] p-3 text-left"
      >
        <div className="flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-md">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo.svg" alt="" className="size-7 object-contain" />
        </div>
        <span className="flex-1 text-sm font-semibold tracking-tight text-foreground">
          Bonus
        </span>
        <ArrowDown01Icon
          size={20}
          className={`text-fg-secondary transition-transform ${open ? "" : "-rotate-180"}`}
          strokeWidth={2}
        />
      </button>

      {open && (
        <div className="flex flex-col gap-4 p-3">
          {BONUS_FIELDS.map(({ position, label, isCountry }) => {
            const entry = byPosition.get(position);
            return (
              <div key={position} className="flex items-center gap-3">
                <p className="min-w-0 flex-1 text-[13px] font-medium tracking-tight text-fg-secondary">
                  {label}
                </p>
                {entry ? (
                  <div className="flex shrink-0 items-center gap-1.5">
                    {isCountry && <Flag team={entry.teamName} />}
                    <p className="text-[13px] font-medium tracking-tight text-foreground">
                      {isCountry ? teamNameShort(entry.teamName) : entry.teamName}
                    </p>
                  </div>
                ) : (
                  <p className="shrink-0 text-[13px] tracking-tight text-fg-tertiary">
                    Sin elegir
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── MatchdayAccordion (exact copy of pronosticos-client.tsx) ─────────────────

function MatchdayAccordion({
  title,
  groups,
}: {
  title: string;
  groups: { label: string; entries: PredictionEntry[] }[];
}) {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-center gap-2.5 rounded-full bg-[color:var(--color-neutral-200)] px-5 py-2.5"
      >
        <span className="text-base font-semibold tracking-tight text-foreground">
          {title}
        </span>
        <ArrowDown01Icon
          size={20}
          className={`text-foreground transition-transform ${open ? "" : "-rotate-180"}`}
          strokeWidth={2}
        />
      </button>

      {open && (
        <div className="flex w-full flex-col gap-5">
          {groups.map((g) => (
            <GroupCard key={g.label} title={g.label} entries={g.entries} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Organise entries — mirrors pronosticos page logic ────────────────────────

const ROUND_DISPLAY: Record<string, string> = {
  LAST_32: "16vos",
  LAST_16: "8vos",
  LAST_8: "Cuartos",
  SEMI_FINALS: "Semis",
  FINAL: "Final",
};

const isGroupStage = (round: string) => /grupo/i.test(round);
const stripGroupsPrefix = (round: string) =>
  round.replace(/^\s*grupos\s*[–-]\s*/i, "").trim() || round;
const isPorDefinir = (e: PredictionEntry) =>
  e.homeTeam === "Por definir" || e.awayTeam === "Por definir";

type MatchdaySection = {
  kind: "matchday";
  title: string;
  groups: { label: string; entries: PredictionEntry[] }[];
};
type RoundSection = { kind: "round"; title: string; entries: PredictionEntry[] };

function organiseEntries(entries: PredictionEntry[]): (MatchdaySection | RoundSection)[] {
  const groupEntries = entries.filter((e) => isGroupStage(e.round));
  const koEntries = entries.filter((e) => !isGroupStage(e.round));

  const MATCHES_PER_MATCHDAY = 2;
  const byMatchday = new Map<number, Map<string, PredictionEntry[]>>();
  const seenPerGroup = new Map<string, number>();

  for (const entry of groupEntries) {
    const label = stripGroupsPrefix(entry.round);
    const pos = seenPerGroup.get(label) ?? 0;
    seenPerGroup.set(label, pos + 1);
    const md = Math.floor(pos / MATCHES_PER_MATCHDAY) + 1;
    if (!byMatchday.has(md)) byMatchday.set(md, new Map());
    const groupsOfMd = byMatchday.get(md)!;
    if (!groupsOfMd.has(label)) groupsOfMd.set(label, []);
    groupsOfMd.get(label)!.push(entry);
  }

  const matchdaySections: MatchdaySection[] = [...byMatchday.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([md, groupsOfMd]) => ({
      kind: "matchday",
      title: `Partido ${md}`,
      groups: [...groupsOfMd.entries()]
        .sort((a, b) => a[0].localeCompare(b[0], "es"))
        .map(([label, grpEntries]) => ({ label, entries: grpEntries })),
    }));

  const byKoRound = new Map<string, PredictionEntry[]>();
  for (const entry of koEntries) {
    if (!byKoRound.has(entry.round)) byKoRound.set(entry.round, []);
    byKoRound.get(entry.round)!.push(entry);
  }

  const koSections: RoundSection[] = [...byKoRound.entries()].map(
    ([round, roundEntries]) => ({
      kind: "round",
      title: ROUND_DISPLAY[round] ?? round,
      entries: roundEntries,
    }),
  );

  return [...matchdaySections, ...koSections];
}

// ─── Loading skeleton (mirrors GroupCard + ReadonlyMatchRow) ─────────────────

function MatchRowSkeleton() {
  return (
    <div className="flex w-full items-center justify-center gap-3 px-3">
      {/* Equipo local */}
      <div className="flex min-w-0 flex-1 items-center justify-end gap-1">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-6 w-9 rounded-br-lg rounded-tl-lg" />
      </div>

      {/* Marcador */}
      <div className="flex shrink-0 items-center gap-1">
        <Skeleton className="size-10 rounded-lg" />
        <span className="text-base font-medium text-fg-secondary">-</span>
        <Skeleton className="size-10 rounded-lg" />
      </div>

      {/* Equipo visitante */}
      <div className="flex min-w-0 flex-1 items-center gap-1">
        <Skeleton className="h-6 w-9 rounded-br-lg rounded-tl-lg" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  );
}

function GroupCardSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="w-full overflow-hidden rounded-2xl bg-card shadow-[0px_4px_12px_0px_rgba(0,0,0,0.15)]">
      {/* Encabezado */}
      <div className="flex w-full items-center gap-3 bg-[#F8F8F8] p-3">
        <Skeleton className="size-7 rounded-md" />
        <Skeleton className="h-4 w-24" />
      </div>

      {/* Filas */}
      <div className="flex flex-col gap-6 py-6">
        {Array.from({ length: rows }).map((_, i) => (
          <MatchRowSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

function PredictionsSkeleton() {
  return (
    <div className="flex w-full flex-col items-center gap-8 p-5">
      {/* Pill de jornada */}
      <Skeleton className="h-10 w-40 rounded-full" />
      <div className="flex w-full flex-col gap-5">
        <GroupCardSkeleton rows={2} />
        <GroupCardSkeleton rows={2} />
      </div>
    </div>
  );
}

// ─── Main client component ────────────────────────────────────────────────────

export function RankingClient({ ranked }: { ranked: RankedParticipant[] }) {
  const [open, setOpen] = useState(false);
  const [selectedName, setSelectedName] = useState("");
  const [predictions, setPredictions] = useState<PredictionEntry[]>([]);
  const [bonus, setBonus] = useState<BonusEntry[]>([]);
  const [isPending, startTransition] = useTransition();

  const handleClick = (id: string, name: string) => {
    setSelectedName(name);
    setPredictions([]);
    setBonus([]);
    setOpen(true);
    startTransition(async () => {
      const [data, bonusData] = await Promise.all([
        getParticipantPredictions(id),
        getParticipantBonusPredictions(id),
      ]);
      setPredictions(data);
      setBonus(bonusData);
    });
  };

  // Mirror the same "Por definir" filter from PronosticosClient
  const sections = organiseEntries(predictions)
    .map((section) => {
      if (section.kind === "round") return section;
      return {
        ...section,
        groups: section.groups.filter((g) => !g.entries.some(isPorDefinir)),
      };
    })
    .filter((section) =>
      section.kind === "round"
        ? !section.entries.some(isPorDefinir)
        : section.groups.length > 0,
    );

  return (
    <>
      <div className="flex flex-col bg-card py-3">
        {ranked.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => handleClick(p.id, p.name)}
            className="flex w-full items-center gap-2 px-3 py-2 text-left transition-colors hover:bg-surface-sunken active:bg-surface-sunken"
          >
            <RankBadge position={p.position} />
            <p className="min-w-0 flex-1 truncate text-[13px] font-medium leading-4 tracking-[-0.13px] text-fg-brand">
              {p.name}
            </p>
            <p className="shrink-0 text-[13px] leading-4 tracking-[-0.13px] text-fg-secondary">
              {p.total} pts
            </p>
          </button>
        ))}
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="max-h-[85svh] rounded-t-2xl p-0">
          {/* Handle bar */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="h-1.5 w-10 rounded-full bg-border" />
          </div>

          <SheetHeader className="px-5 pt-1 pb-2">
            <SheetTitle className="text-2xl font-bold tracking-tight">
              {selectedName}
            </SheetTitle>
          </SheetHeader>

          {/* Scrollable content — same layout as PronosticosClient */}
          <div className="overflow-y-auto">
            {isPending ? (
              <PredictionsSkeleton />
            ) : (
              <div className="flex w-full flex-col items-center gap-8 p-5">
                {sections.map((section) =>
                  section.kind === "matchday" ? (
                    <MatchdayAccordion
                      key={section.title}
                      title={section.title}
                      groups={section.groups}
                    />
                  ) : (
                    <div key={section.title} className="flex w-full flex-col gap-5">
                      <GroupCard title={section.title} entries={section.entries} />
                    </div>
                  ),
                )}
                {bonus.length > 0 && <BonusCard bonus={bonus} />}
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
