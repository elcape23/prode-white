/**
 * Test helper: clear any match results entered during testing and reset
 * the points they generated. Safe to run before any real match has finished,
 * since every result in the DB at that point is a test.
 *
 * Pair with re-importing the fixture from the API to also restore the real
 * kickoff times (scheduledAt).
 *
 * Run:  npx tsx scripts/clear-test-results.ts
 */
import prisma from "@/lib/prisma";

async function main() {
  const finished = await prisma.match.findMany({
    where: { resultEnteredAt: { not: null } },
    select: { id: true, homeTeam: true, awayTeam: true },
  });

  if (finished.length === 0) {
    console.log("No matches with results to clear.");
    return;
  }

  const matchIds = finished.map((m) => m.id);

  const preds = await prisma.prediction.updateMany({
    where: { matchId: { in: matchIds } },
    data: { points: null },
  });

  const matches = await prisma.match.updateMany({
    where: { id: { in: matchIds } },
    data: { homeScore: null, awayScore: null, resultEnteredAt: null },
  });

  console.log(
    `Cleared ${matches.count} match result(s) and reset ${preds.count} prediction point(s):`
  );
  for (const m of finished) console.log(`  - ${m.homeTeam} vs ${m.awayTeam}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => process.exit(0));
