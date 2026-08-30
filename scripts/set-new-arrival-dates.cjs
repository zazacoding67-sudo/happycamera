require("dotenv").config({ path: ".env.local" });
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

// Curated recent createdAt so the recency "NEW" badge shows honestly.
// Each date is "N days ago" from today, all within the 7-day window.
const now = new Date();
const DAY = 86400000;
const recency = [
  { slug: "sony-alpha-a7c-ii", daysAgo: 1 },
  { slug: "zeiss-35mm-f1-4", daysAgo: 2 },
  { slug: "canon-eos-r50", daysAgo: 3 },
  { slug: "sony-alpha-a6700", daysAgo: 4 },
  { slug: "fujifilm-x-t5", daysAgo: 5 },
  { slug: "fujifilm-x100vi", daysAgo: 6 },
];

async function main() {
  const prisma = new PrismaClient({ adapter: new PrismaPg(process.env.DATABASE_URL) });
  for (const r of recency) {
    const ts = new Date(now.getTime() - r.daysAgo * DAY);
    await prisma.product.updateMany({ where: { slug: r.slug }, data: { createdAt: ts } });
    console.log(r.slug.padEnd(30) + " -> " + ts.toISOString() + " (" + r.daysAgo + "d ago)");
  }
  await prisma.$disconnect();
}
main().catch((e) => { console.error(e); process.exit(1); });
