"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { verifyAdmin } from "@/lib/dal";
import { parseFixtureCSV } from "@/lib/csv-parser";

const TOURNAMENT_ID = "default-tournament";

export type FixtureImportResult =
  | { ok: true; count: number }
  | { ok: false; error: string }
  | undefined;

export async function importFixtureCSV(
  _prev: FixtureImportResult,
  formData: FormData
): Promise<FixtureImportResult> {
  await verifyAdmin();

  const file = formData.get("csv") as File | null;
  if (!file) return { ok: false, error: "No se recibió ningún archivo." };

  const text = await file.text();
  const parsed = parseFixtureCSV(text);
  if (!parsed.ok) return { ok: false, error: parsed.error };

  // Insert all matches; skip duplicates (same tournament + teams + scheduledAt)
  let count = 0;
  for (const row of parsed.rows) {
    await prisma.match.create({
      data: {
        tournamentId: TOURNAMENT_ID,
        round: row.round,
        homeTeam: row.homeTeam,
        awayTeam: row.awayTeam,
        scheduledAt: row.scheduledAt,
      },
    });
    count++;
  }

  // Update tournament firstMatchAt to earliest match
  const earliest = await prisma.match.findFirst({
    where: { tournamentId: TOURNAMENT_ID },
    orderBy: { scheduledAt: "asc" },
    select: { scheduledAt: true },
  });
  if (earliest) {
    await prisma.tournament.update({
      where: { id: TOURNAMENT_ID },
      data: { firstMatchAt: earliest.scheduledAt },
    });
  }

  revalidatePath("/admin/fixture");
  revalidatePath("/fixture");
  return { ok: true, count };
}

export async function deleteMatch(matchId: string): Promise<void> {
  await verifyAdmin();
  await prisma.match.delete({ where: { id: matchId } });
  revalidatePath("/admin/fixture");
  revalidatePath("/fixture");
}

export async function clearFixture(): Promise<void> {
  await verifyAdmin();
  await prisma.match.deleteMany({ where: { tournamentId: TOURNAMENT_ID } });
  await prisma.tournament.update({
    where: { id: TOURNAMENT_ID },
    data: { firstMatchAt: null },
  });
  revalidatePath("/admin/fixture");
  revalidatePath("/fixture");
}
