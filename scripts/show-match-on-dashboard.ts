/**
 * Test helper: set the next upcoming match's kickoff to ~now so it appears
 * on the participant dashboard under "Partido por comenzar".
 *
 * The dashboard only shows matches where resultEnteredAt is null AND
 * scheduledAt is within [now - 2.5h, now + 30min]. This puts a match
 * 10 minutes in the future, squarely inside that window.
 *
 * Run:  npx tsx scripts/show-match-on-dashboard.ts
 */
import prisma from "@/lib/prisma";

async function main() {
  const now = new Date();

  const next = await prisma.match.findFirst({
    where: { resultEnteredAt: null },
    orderBy: { scheduledAt: "asc" },
  });

  if (!next) {
    console.log("No match without a result found.");
    return;
  }

  const inTenMinutes = new Date(now.getTime() + 10 * 60 * 1000);
  await prisma.match.update({
    where: { id: next.id },
    data: { scheduledAt: inTenMinutes },
  });

  console.log(
    `Match moved into the dashboard window:\n` +
      `  ${next.homeTeam} vs ${next.awayTeam} (${next.round})\n` +
      `  scheduledAt -> ${inTenMinutes.toISOString()}\n` +
      `Refresh the dashboard and it will appear as "Partido por comenzar".`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => process.exit(0));
