import { verifyAdmin } from "@/lib/dal";
import { CsvImportForm } from "./csv-import-form";

export default async function ImportFixturePage() {
  await verifyAdmin();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-fg-brand">Importar Fixture</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Subí un archivo CSV con los partidos del torneo.
        </p>
      </div>

      {/* Format spec */}
      <div className="border rounded-xl p-4 bg-muted/40 space-y-3">
        <p className="text-sm font-semibold">Formato requerido del CSV</p>
        <p className="text-xs text-muted-foreground">
          El archivo debe tener estas columnas (en cualquier orden):
        </p>
        <div className="overflow-x-auto">
          <table className="text-xs w-full border-collapse">
            <thead>
              <tr className="bg-muted">
                {["round", "homeTeam", "awayTeam", "scheduledAt"].map((h) => (
                  <th key={h} className="border px-2 py-1 text-left font-mono">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-2 py-1 font-mono">Grupos</td>
                <td className="border px-2 py-1 font-mono">Argentina</td>
                <td className="border px-2 py-1 font-mono">Chile</td>
                <td className="border px-2 py-1 font-mono">2026-06-11T16:00:00-03:00</td>
              </tr>
              <tr>
                <td className="border px-2 py-1 font-mono">Cuartos</td>
                <td className="border px-2 py-1 font-mono">Ganador A</td>
                <td className="border px-2 py-1 font-mono">Ganador B</td>
                <td className="border px-2 py-1 font-mono">2026-07-05T16:00:00-03:00</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground">
          La fecha debe estar en formato ISO 8601 con zona horaria Argentina{" "}
          <span className="font-mono">-03:00</span>.
        </p>
      </div>

      <CsvImportForm />
    </div>
  );
}
