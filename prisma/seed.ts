import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString =
  process.env.DIRECT_DATABASE_URL ?? process.env.DATABASE_URL ?? "";
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Sponsor codes
  const sponsorCodes = [
    { code: "GBC35OFF", sponsorName: "GBC – Gran Bazar Chino" },
    { code: "NADAL35OFF", sponsorName: "Nadal & Asociados" },
    { code: "FULLSPORT35OFF", sponsorName: "Full Sport" },
    { code: "PASSO35OFF", sponsorName: "The Passo" },
    { code: "CUPULA35OFF", sponsorName: "La Cúpula Coworking" },
    { code: "DELVALLE35OFF", sponsorName: "Del Valle Repuestos" },
    { code: "CADINC35OFF", sponsorName: "CADINC" },
  ];

  for (const sc of sponsorCodes) {
    await prisma.sponsorCode.upsert({
      where: { code: sc.code },
      update: {},
      create: { ...sc, maxUses: 10 },
    });
  }

  // Default tournament
  await prisma.tournament.upsert({
    where: { id: "default-tournament" },
    update: {},
    create: {
      id: "default-tournament",
      name: "Mundial 2026",
    },
  });

  console.log("Seed completed: 7 sponsor codes + 1 tournament created.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
