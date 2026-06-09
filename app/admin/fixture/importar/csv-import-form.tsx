"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { importFixtureCSV } from "@/actions/admin/fixture";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { parseFixtureCSV } from "@/lib/csv-parser";

type PreviewRow = { round: string; homeTeam: string; awayTeam: string; scheduledAt: string };

export function CsvImportForm() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<PreviewRow[] | null>(null);
  const [parseError, setParseError] = useState("");
  const [state, action, pending] = useActionState(importFixtureCSV, undefined);

  useEffect(() => {
    if (state?.ok) {
      toast.success(`${state.count} partido${state.count !== 1 ? "s" : ""} importado${state.count !== 1 ? "s" : ""}`);
      router.push("/admin/fixture");
    }
    if (state && !state.ok) toast.error(state.error);
  }, [state, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setParseError("");
    setPreview(null);
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const result = parseFixtureCSV(text);
      if (!result.ok) {
        setParseError(result.error);
        return;
      }
      setPreview(
        result.rows.map((r) => ({
          round: r.round,
          homeTeam: r.homeTeam,
          awayTeam: r.awayTeam,
          scheduledAt: new Date(r.scheduledAt).toLocaleString("es-AR", {
            timeZone: "America/Argentina/Buenos_Aires",
            dateStyle: "short",
            timeStyle: "short",
          }),
        }))
      );
    };
    reader.readAsText(file);
  };

  return (
    <form action={action} className="space-y-4">
      {/* Drop zone */}
      <label className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/30 rounded-xl p-8 cursor-pointer hover:border-primary/50 transition-colors">
        <span className="text-3xl mb-2">📄</span>
        <span className="font-medium text-sm">Seleccioná un archivo CSV</span>
        <span className="text-xs text-muted-foreground mt-1">o arrastralo acá</span>
        <input
          ref={fileRef}
          name="csv"
          type="file"
          accept=".csv,text/csv"
          className="sr-only"
          onChange={handleFileChange}
        />
      </label>

      {parseError && (
        <Alert variant="destructive">
          <AlertDescription>{parseError}</AlertDescription>
        </Alert>
      )}

      {state && !state.ok && (
        <Alert variant="destructive">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      {/* Preview */}
      {preview && preview.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">
            Vista previa — {preview.length} partido{preview.length !== 1 ? "s" : ""}
          </p>
          <div className="border rounded-xl overflow-hidden">
            <div className="overflow-x-auto max-h-64">
              <table className="text-xs w-full">
                <thead className="bg-muted sticky top-0">
                  <tr>
                    {["Ronda", "Local", "Visitante", "Fecha"].map((h) => (
                      <th key={h} className="px-3 py-2 text-left font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.map((r, i) => (
                    <tr key={i} className="border-t">
                      <td className="px-3 py-2">{r.round}</td>
                      <td className="px-3 py-2 font-medium">{r.homeTeam}</td>
                      <td className="px-3 py-2 font-medium">{r.awayTeam}</td>
                      <td className="px-3 py-2 text-muted-foreground">{r.scheduledAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <Button
            type="submit"
            disabled={pending || !!parseError}
            className="w-full font-bold h-11"
          >
            {pending ? "Importando..." : `Confirmar importación (${preview.length} partidos)`}
          </Button>
        </div>
      )}
    </form>
  );
}
