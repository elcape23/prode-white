"use client";

import { useEffect } from "react";

export default function ParticipantError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <p className="text-lg font-semibold text-foreground">
        Algo salió mal
      </p>
      <p className="text-sm text-muted-foreground">
        Hubo un error al cargar esta página. Podés intentar de nuevo.
      </p>
      {error.digest && (
        <p className="font-mono text-xs text-muted-foreground/60">
          {error.digest}
        </p>
      )}
      <button
        type="button"
        onClick={reset}
        className="rounded-md bg-fg-brand px-4 py-2 text-sm font-medium text-fg-on-brand"
      >
        Reintentar
      </button>
    </div>
  );
}
