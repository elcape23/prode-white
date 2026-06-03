export type MatchRow = {
  round: string;
  homeTeam: string;
  awayTeam: string;
  scheduledAt: Date;
};

export type ParseResult =
  | { ok: true; rows: MatchRow[] }
  | { ok: false; error: string };

export function parseFixtureCSV(csvText: string): ParseResult {
  const lines = csvText.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) {
    return { ok: false, error: "El archivo debe tener encabezado y al menos una fila." };
  }

  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const required = ["round", "hometeam", "awayteam", "scheduledat"];
  const missing = required.filter((r) => !headers.includes(r));
  if (missing.length > 0) {
    return { ok: false, error: `Columnas faltantes: ${missing.join(", ")}` };
  }

  const rows: MatchRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim());
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => { row[h] = values[idx] ?? ""; });

    if (!row.round || !row.hometeam || !row.awayteam || !row.scheduledat) {
      return { ok: false, error: `Fila ${i + 1}: faltan valores obligatorios.` };
    }

    const scheduledAt = new Date(row.scheduledat);
    if (isNaN(scheduledAt.getTime())) {
      return { ok: false, error: `Fila ${i + 1}: fecha inválida "${row.scheduledat}". Usá formato ISO: 2026-06-11T16:00:00-03:00` };
    }

    rows.push({
      round: row.round,
      homeTeam: row.hometeam,
      awayTeam: row.awayteam,
      scheduledAt,
    });
  }

  return { ok: true, rows };
}
