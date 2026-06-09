"use client";

import { useActionState } from "react";
import Image from "next/image";
import { saveBonusPredictions } from "@/actions/predictions";
import { teamNameShort } from "@/lib/flags";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowDown01Icon } from "hugeicons-react";

export type Country = { value: string; label: string; flag: string };

type BonusField = {
  key: string;
  label: string;
  placeholder: string;
  type: "country" | "text";
};

const FIELDS: BonusField[] = [
  { key: "CHAMPION", label: "Equipo campeón", placeholder: "Seleccionar país", type: "country" },
  { key: "BEST_PLAYER", label: "Mejor jugador", placeholder: "Seleccionar jugador", type: "text" },
  { key: "TOP_SCORER", label: "Goleador", placeholder: "Seleccionar jugador", type: "text" },
  { key: "BEST_YOUNG_PLAYER", label: "Mejor jugador jóven", placeholder: "Seleccionar jugador", type: "text" },
];

export function BonusForm({
  initial,
  countries,
}: {
  initial: Record<string, string>;
  countries: Country[];
}) {
  const [state, action, pending] = useActionState(saveBonusPredictions, undefined);

  return (
    <form action={action} className="flex flex-1 flex-col gap-6 bg-background p-5">
      {state?.ok && (
        <Alert>
          <AlertDescription className="font-medium text-fg-success">
            Pronósticos guardados correctamente.
          </AlertDescription>
        </Alert>
      )}
      {state && !state.ok && (
        <Alert variant="destructive">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      {FIELDS.map(({ key, label, placeholder, type }) => (
        <section
          key={key}
          className="overflow-hidden rounded-2xl border border-border shadow-[0px_2px_3px_rgba(0,0,0,0.1)]"
        >
          <div className="flex items-center gap-3 bg-background p-3">
            <Image
              src="/images/logo.svg"
              alt=""
              width={24}
              height={38}
              className="h-[37px] w-auto shrink-0"
            />
            <h2 className="flex-1 text-sm font-semibold tracking-tight text-fg-brand">{label}</h2>
          </div>
          <div className="bg-card p-3">
            {type === "country" ? (
              <Select name={key} defaultValue={initial[key] ?? null}>
                <SelectTrigger className="h-10! w-full rounded-md text-sm">
                  <SelectValue placeholder={placeholder} />
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
            ) : (
              <div className="relative">
                <Input
                  name={key}
                  defaultValue={initial[key] ?? ""}
                  placeholder={placeholder}
                  disabled={pending}
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
      ))}

      <Button type="submit" disabled={pending} className="h-12 w-full rounded-full text-base font-bold">
        {pending ? "Guardando..." : "Guardar pronósticos"}
      </Button>
    </form>
  );
}
