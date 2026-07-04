"use client";

import { useState } from "react";
import { ArrowDown01Icon } from "hugeicons-react";
import { MatchRow, type MatchRowProps } from "./prediction-card";

type GroupBlock = { groupLabel: string; matches: MatchRowProps[] };

export type Section =
  | { kind: "matchday"; title: string; groups: GroupBlock[] }
  | { kind: "round"; title: string; matches: MatchRowProps[] };

/** Un partido está "terminado" cuando ya tiene resultado cargado. */
const isPlayed = (m: MatchRowProps) =>
  m.resultHome !== null && m.resultAway !== null;
/** Una jornada/ronda está terminada cuando todos sus partidos lo están. */
const allPlayed = (matches: MatchRowProps[]) =>
  matches.length > 0 && matches.every(isPlayed);

/** Tarjeta-acordeón de un grupo. Abierta por defecto; toggle manual. */
function GroupCard({ title, matches }: { title: string; matches: MatchRowProps[] }) {
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
          {matches.map((m) => (
            <MatchRow key={m.matchId} {...m} />
          ))}
        </div>
      )}
    </div>
  );
}

/** Acordeón de jornada ("Partido N") que abre/cierra todos sus grupos. */
function MatchdayAccordion({ title, groups }: { title: string; groups: GroupBlock[] }) {
  // Las jornadas ya jugadas arrancan colapsadas por defecto.
  const [open, setOpen] = useState(
    !allPlayed(groups.flatMap((g) => g.matches)),
  );

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
            <GroupCard key={g.groupLabel} title={g.groupLabel} matches={g.matches} />
          ))}
        </div>
      )}
    </div>
  );
}

/** Acordeón de ronda de eliminación ("16vos", "8vos", …) con el mismo
 *  encabezado tipo píldora que las jornadas ("Partido N"). */
function RoundAccordion({ title, matches }: { title: string; matches: MatchRowProps[] }) {
  // Las rondas ya jugadas arrancan colapsadas por defecto.
  const [open, setOpen] = useState(!allPlayed(matches));

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
        <div className="w-full overflow-hidden rounded-2xl bg-card shadow-[0px_4px_12px_0px_rgba(0,0,0,0.15)]">
          <div className="flex flex-col gap-6 py-6">
            {matches.map((m) => (
              <MatchRow key={m.matchId} {...m} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/** Una fila con equipos sin definir ("Por definir") aún no es jugable. */
const isPorDefinir = (m: MatchRowProps) =>
  m.homeTeam === "Por definir" || m.awayTeam === "Por definir";
const cardHasPorDefinir = (matches: MatchRowProps[]) => matches.some(isPorDefinir);

export function PronosticosClient({ sections }: { sections: Section[] }) {
  // Oculta las tarjetas de fase de grupos cuyos partidos tengan equipos
  // "Por definir". Las rondas de eliminación (playoff) se muestran siempre,
  // aunque sus equipos todavía no estén definidos.
  const visibleSections = sections
    .map((section) => {
      if (section.kind === "round") return section;
      return {
        ...section,
        groups: section.groups.filter((g) => !cardHasPorDefinir(g.matches)),
      };
    })
    .filter((section) =>
      section.kind === "round" ? true : section.groups.length > 0,
    );

  return (
    <div className="flex w-full flex-1 flex-col items-center gap-8 p-5">
      {visibleSections.map((section) =>
        section.kind === "matchday" ? (
          <MatchdayAccordion key={section.title} title={section.title} groups={section.groups} />
        ) : (
          <RoundAccordion key={section.title} title={section.title} matches={section.matches} />
        ),
      )}
    </div>
  );
}
