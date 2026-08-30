require("dotenv").config({ path: ".env.local" });
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

// Re-baseline ALL products EXCEPT the 6 curated new arrivals to dates older than
// 7 days, so the recency "NEW" badge only ever shows on the intended new arrivals.
const NEW_ARRIVAL_SLUGS = new Set([
  "sony-alpha-a7c-ii", // 1d
  "zeiss-35mm-f1-4", // 2d
  "canon-eos-r50", // 3d
  "sony-alpha-a6700", // 4d
  "fujifilm-x-t5", // 5d
  "fujifilm-x100vi", // 6d
]);

const now = Date.now();
const DAY = 86400000;

async function main() {
  const prisma = new PrismaClient({ adapter: new PrismaPg(process.env.DATABASE_URL) });
  const all = await prisma.product.findMany({ select: { slug: true } });

  // Oldest first a few months ago, ~1 day apart, all strictly > 7 days old.
  // Newest (largest index) in this set is the least-old (but still > 7 days).
  const reDate = all
    .filter((r) => !NEW_ARRIVAL_SLUGS.has(r.slug))
    .sort((a, b) => a.slug.localeCompare(b.slug));

  let assigned = 0;
  for (let i = 0; i < reDate.length; i++) {
    const daysAgo = 45 - i; // 45..(45 - n + 1) days ago, all > 7
    const ts = new Date(now - daysAgo * DAY);
    await prisma.product.updateMany({ where: { slug: reDate[i].slug }, data: { createdAt: ts } });
    assigned++;
  }
  console.log("Re-dated non-new-arrival products:", assigned);
  await prisma.$disconnect();
}
main().catch((e) => { console.error(e); process.exit(1); });
