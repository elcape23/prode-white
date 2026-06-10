/**
 * Test helper: backdate the next upcoming match so it shows up in
 * /admin/resultados under "Por cargar", letting you enter a result
 * manually and exercise the scoring + ranking flow without the API.
 *
 * Run:  npx tsx scripts/backdate-next-match.ts
 */
import prisma from "@/lib/prisma";

async function main() {
  const now = new Date();

  const next = await prisma.match.findFirst({
    where: { scheduledAt: { gt: now }, homeScore: null },
    orderBy: { scheduledAt: "asc" },
  });

  if (!next) {
    console.log("No upcoming match without a result found.");
    return;
  }

  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  await prisma.match.update({
    where: { id: next.id },
    data: { scheduledAt: oneHourAgo },
  });

  console.log(
    `Backdated: ${next.homeTeam} vs ${next.awayTeam} (${next.round})\n` +
      `  scheduledAt -> ${oneHourAgo.toISOString()}\n` +
      `Now open /admin/resultados and it will appear under "Por cargar".`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => process.exit(0));
