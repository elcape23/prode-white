"use client";

import { useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { ArrowDown01Icon } from "hugeicons-react";

export type PlayerOption = { value: string; label: string; team?: string; flag?: string };

const MAX_RESULTS = 60;

export function PlayerCombobox({
  name,
  defaultValue,
  placeholder,
  options,
  featured,
  disabled,
  onChange,
}: {
  name: string;
  defaultValue?: string;
  placeholder?: string;
  options: PlayerOption[];
  /** Lista curada que se muestra por defecto cuando el buscador esta vacio. */
  featured?: PlayerOption[];
  disabled?: boolean;
  onChange?: (value: string) => void;
}) {
  const [query, setQuery] = useState(defaultValue ?? "");
  const [open, setOpen] = useState(false);
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    // Sin busqueda: mostramos la lista destacada (si existe). Al escribir,
    // filtramos el pool completo de jugadores.
    const list = q
      ? options.filter(
          (o) =>
            o.label.toLowerCase().includes(q) ||
            (o.team?.toLowerCase().includes(q) ?? false)
        )
      : featured && featured.length > 0
        ? featured
        : options;
    return list.slice(0, MAX_RESULTS);
  }, [query, options, featured]);

  // Flag of the exactly-selected player, shown inside the input.
  const selectedFlag = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return undefined;
    return options.find((o) => o.value.toLowerCase() === q)?.flag;
  }, [query, options]);

  return (
    <div className="relative">
      {selectedFlag && (
        <span className="pointer-events-none absolute left-2 top-1/2 flex h-6 w-9 -translate-y-1/2 items-center justify-center overflow-hidden rounded-br-lg rounded-tl-lg border border-[color:var(--color-neutral-300)] bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={selectedFlag} alt="" className="h-full w-full object-cover" loading="lazy" />
        </span>
      )}
      <Input
        name={name}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onChange?.(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          blurTimer.current = setTimeout(() => setOpen(false), 120);
        }}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
        className={`h-10 rounded-md pr-9 text-sm ${selectedFlag ? "pl-12" : ""}`}
      />
      <ArrowDown01Icon
        size={20}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-fg-secondary"
      />

      {open && filtered.length > 0 && (
        <ul className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-border bg-card py-1 shadow-md">
          {filtered.map((o) => (
            <li key={o.value}>
              <button
                type="button"
                onMouseDown={(e) => {
                  // mousedown fires before input blur, so the selection sticks
                  e.preventDefault();
                  if (blurTimer.current) clearTimeout(blurTimer.current);
                  setQuery(o.value);
                  onChange?.(o.value);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-3 px-3 py-2 text-left text-[13px] hover:bg-muted"
              >
                {o.flag ? (
                  <span className="flex h-6 w-9 shrink-0 items-center justify-center overflow-hidden rounded-br-lg rounded-tl-lg border border-[color:var(--color-neutral-300)] bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={o.flag}
                      alt=""
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </span>
                ) : (
                  <span className="h-6 w-9 shrink-0 rounded-br-lg rounded-tl-lg border border-[color:var(--color-neutral-300)] bg-muted" />
                )}
                <span className="font-medium text-foreground">{o.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
