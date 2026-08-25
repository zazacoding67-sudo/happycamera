import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";
import { normalizeBrand } from "../lib/brand";

dotenv.config({ path: ".env.local" });

const adapter = new PrismaPg(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

async function main() {
  const apply = process.argv.includes("--apply");

  const products = await prisma.product.findMany({
    select: { id: true, name: true, brand: true, slug: true },
    orderBy: { brand: "asc" },
  });

  const groups = new Map<string, { brands: string[]; products: typeof products }>();
  for (const p of products) {
    const key = p.brand.trim().toLowerCase();
    if (!groups.has(key)) groups.set(key, { brands: [], products: [] });
    const g = groups.get(key)!;
    if (!g.brands.includes(p.brand)) g.brands.push(p.brand);
    g.products.push(p);
  }

  const canonical = new Map<string, string>();
  const affected: typeof products = [];
  for (const [key, g] of groups) {
    const canonicalBrand = normalizeBrand(g.brands[0]);
    canonical.set(key, canonicalBrand);
    for (const p of g.products) {
      if (p.brand !== canonicalBrand) affected.push(p);
    }
  }

  if (!apply) {
    console.log("=== BRAND CASE AUDIT (dry-run, no writes) ===");
    for (const [key, g] of groups) {
      const canonicalBrand = canonical.get(key)!;
      console.log(
        `\n[${key}] -> canonical "${canonicalBrand}" (raw: ${g.brands.join(", ")}) — ${g.products.length} product(s)`
      );
      for (const p of g.products) {
        const flag = p.brand !== canonicalBrand ? "  <-- CHANGES" : "";
        console.log(`   - ${p.slug}: "${p.brand}"${flag}`);
      }
    }
    console.log(
      `\n${affected.length} product(s) would be updated. Run with --apply to write changes.`
    );
    return;
  }

  for (const p of affected) {
    const target = canonical.get(p.brand.trim().toLowerCase())!;
    await prisma.product.update({ where: { id: p.id }, data: { brand: target } });
    console.log(`UPDATED ${p.slug}: "${p.brand}" -> "${target}"`);
  }
  console.log(`\nDone. ${affected.length} product(s) updated.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
