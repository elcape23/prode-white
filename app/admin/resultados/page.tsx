import { verifyAdmin } from "@/lib/dal";
import prisma from "@/lib/prisma";
import { ResultForm } from "./result-form";

const TOURNAMENT_ID = "default-tournament";

function formatDate(d: Date) {
  return new Date(d).toLocaleString("es-AR", {
    weekday: "short", day: "numeric", month: "short",
    hour: "2-digit", minute: "2-digit",
    timeZone: "America/Argentina/Buenos_Aires",
  });
}

export default async function ResultadosPage() {
  await verifyAdmin();

  const matches = await prisma.match.findMany({
    where: { tournamentId: TOURNAMENT_ID },
    orderBy: { scheduledAt: "desc" },
  });

  const withResult = matches.filter((m) => m.homeScore !== null);
  const pending = matches.filter((m) => m.homeScore === null && new Date(m.scheduledAt) <= new Date());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-fg-brand">Resultados</h1>
        <p className="text-sm text-muted-foreground">
          {withResult.length}/{matches.length} cargados
        </p>
      </div>

      {/* Pending results (played but no result yet) */}
      {pending.length > 0 && (
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-fg-warning mb-3">
            Por cargar ({pending.length})
          </h2>
          <div className="space-y-2">
            {pending.map((m) => (
              <ResultForm key={m.id} match={m} />
            ))}
          </div>
        </div>
      )}

      {/* Matches with results */}
      {withResult.length > 0 && (
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">
            Con resultado ({withResult.length})
          </h2>
          <div className="space-y-2">
            {withResult.map((m) => (
              <ResultForm key={m.id} match={m} />
            ))}
          </div>
        </div>
      )}

      {matches.length === 0 && (
        <p className="text-center text-muted-foreground py-12 text-sm">
          No hay partidos. Importá el fixture primero.
        </p>
      )}

      {matches.length > 0 && pending.length === 0 && (
        <div className="text-center py-6 text-sm text-muted-foreground">
          No hay partidos jugados sin resultado aún.
          <br />
          <span className="text-xs">Podés usar "🔄 Sincronizar resultados" en el Fixture para traerlos automáticamente.</span>
        </div>
      )}
    </div>
  );
}
