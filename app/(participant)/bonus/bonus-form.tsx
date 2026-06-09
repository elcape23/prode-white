"use client";

import { useActionState, useEffect, useState } from "react";
import Image from "next/image";
import { saveBonusPredictions } from "@/actions/predictions";
import { teamNameShort } from "@/lib/flags";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowDown01Icon } from "hugeicons-react";
import { PlayerCombobox, type PlayerOption } from "./player-combobox";

export type Country = { value: string; label: string; flag: string };

type BonusField = {
  key: string;
  label: string;
  placeholder: string;
  type: "country" | "player" | "youngPlayer";
};

const FIELDS: BonusField[] = [
  { key: "CHAMPION", label: "Equipo campeón", placeholder: "Seleccionar país", type: "country" },
  { key: "BEST_PLAYER", label: "Mejor jugador", placeholder: "Seleccionar jugador", type: "player" },
  { key: "TOP_SCORER", label: "Goleador", placeholder: "Seleccionar jugador", type: "player" },
  { key: "BEST_YOUNG_PLAYER", label: "Mejor jugador jóven", placeholder: "Seleccionar jugador", type: "youngPlayer" },
];

export function BonusForm({
  initial,
  countries,
  players,
  youngPlayers,
  featured,
  featuredYoung,
}: {
  initial: Record<string, string>;
  countries: Country[];
  players: PlayerOption[];
  youngPlayers: PlayerOption[];
  featured: PlayerOption[];
  featuredYoung: PlayerOption[];
}) {
  const [state, action, pending] = useActionState(saveBonusPredictions, undefined);

  useEffect(() => {
    if (state?.ok) toast.success("Pronósticos guardados correctamente.");
    if (state && !state.ok) toast.error(state.error);
  }, [state]);

  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(FIELDS.map(({ key }) => [key, initial[key] ?? ""]))
  );
  const allFilled = FIELDS.every(({ key }) => values[key].trim() !== "");
  const set = (key: string) => (v: string) => setValues((prev) => ({ ...prev, [key]: v }));

  return (
    <form action={action} className="flex flex-1 flex-col gap-6 bg-background p-5">
      {FIELDS.map(({ key, label, placeholder, type }) => {
        const playerOptions =
          type === "player" ? players : type === "youngPlayer" ? youngPlayers : [];

        return (
          <section
            key={key}
            className="rounded-2xl border border-border shadow-[0px_2px_3px_rgba(0,0,0,0.1)]"
          >
            <div className="flex items-center gap-3 bg-background p-3 rounded-t-2xl overflow-hidden">
              <Image
                src="/images/logo.svg"
                alt=""
                width={24}
                height={38}
                className="h-[37px] w-auto shrink-0"
              />
              <h2 className="flex-1 text-sm font-semibold tracking-tight text-fg-brand">{label}</h2>
            </div>
            <div className="bg-card p-3 rounded-b-2xl">
              {type === "country" ? (
                <Select name={key} value={values[key] || null} onValueChange={(v) => set(key)(v ?? "")}>
                  <SelectTrigger className="h-10! w-full rounded-md text-sm">
                    <SelectValue placeholder={placeholder}>
                      {(value: string) => {
                        const selected = countries.find((c) => c.value === value);
                        if (!selected) return placeholder;
                        return (
                          <>
                            <span className="flex h-6 w-9 shrink-0 items-center justify-center overflow-hidden rounded-br-lg rounded-tl-lg border border-[color:var(--color-neutral-300)] bg-muted">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={selected.flag}
                                alt=""
                                className="h-full w-full object-cover"
                                loading="lazy"
                              />
                            </span>
                            <span className="text-[13px] font-medium tracking-tight text-foreground">
                              {teamNameShort(selected.label)}
                            </span>
                          </>
                        );
                      }}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        <span className="flex h-6 w-9 shrink-0 items-center justify-center overflow-hidden rounded-br-lg rounded-tl-lg border border-[color:var(--color-neutral-300)] bg-muted">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={c.flag}
                            alt=""
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        </span>
                        <span className="text-[13px] font-medium tracking-tight text-foreground">
                          {teamNameShort(c.label)}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : playerOptions.length > 0 || featured.length > 0 ? (
                <PlayerCombobox
                  name={key}
                  defaultValue={initial[key] ?? ""}
                  placeholder={placeholder}
                  options={playerOptions}
                  featured={type === "youngPlayer" ? featuredYoung : featured}
                  disabled={pending}
                  onChange={set(key)}
                />
              ) : (
                // Fallback to free text until squads have been imported.
                <div className="relative">
                  <Input
                    name={key}
                    defaultValue={initial[key] ?? ""}
                    placeholder={placeholder}
                    disabled={pending}
                    onChange={(e) => set(key)(e.target.value)}
                    className="h-10 rounded-md pr-9 text-sm"
                  />
                  <ArrowDown01Icon
                    size={20}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-fg-secondary"
                  />
                </div>
              )}
            </div>
          </section>
        );
      })}

      <Button type="submit" disabled={pending || !allFilled} className="h-12 w-full rounded-full text-base font-bold">
        {pending ? "Guardando..." : "Guardar pronósticos"}
      </Button>
    </form>
  );
}
