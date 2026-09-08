import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";
import { isValidSubcategory } from "../lib/categories";

dotenv.config({ path: ".env.local" });

// Prefer the direct (session-mode) connection for a long-running admin script.
// The pooled URL (port 6543, pgBouncer transaction mode) is fine for the app but
// the CLI/migration-engine style workloads need the direct 5432 session connection.
const DB_URL = process.env.DIRECT_URL ?? process.env.DATABASE_URL!;
const MASKED = DB_URL.replace(/:\/\/[^@]+@/, "://***:***@");
console.log(`Connecting via: ${MASKED}`);

const adapter = new PrismaPg(DB_URL);
const prisma = new PrismaClient({ adapter });

// Exact DB product names -> canonical category + subcategory (approved table)
const TARGET: Record<string, { category: string; subcategory: string }> = {
  "Canon EOS R50":                             { category: "Cameras",     subcategory: "Mirrorless" },
  "Fujifilm X-T5":                             { category: "Cameras",     subcategory: "Mirrorless" },
  "Sony Alpha A6700":                          { category: "Cameras",     subcategory: "Mirrorless" },
  "Fujifilm X100VI":                           { category: "Cameras",     subcategory: "Compact" },
  "Panasonic FZ100 Compact":                   { category: "Cameras",     subcategory: "Compact" },
  "Leica M6 TTL":                              { category: "Cameras",     subcategory: "Compact" },
  "Hasselblad 500 C/M":                        { category: "Cameras",     subcategory: "Medium Format" },
  "F-Stop Tilopa 50L":                         { category: "Accessories", subcategory: "Bags" },
  "Lowepro ProTactic 450 AW":                  { category: "Accessories", subcategory: "Bags" },
  "Manfrotto Manhattan Mover 50":              { category: "Accessories", subcategory: "Bags" },
  "Shimoda Explore V2 35L":                    { category: "Accessories", subcategory: "Bags" },
  "Digi Cabi DHC-N150":                        { category: "Accessories", subcategory: "Dry Box" },
  "HINISO Electronic Dry Cabinet 30L":         { category: "Accessories", subcategory: "Dry Box" },
  "HINISO Electronic Dry Cabinet 60L":         { category: "Accessories", subcategory: "Dry Box" },
  "Forspark Dry Box 67L":                      { category: "Accessories", subcategory: "Dry Box" },
  "Red Buffalo RBC-60PRO 50L Dry Cabinet Box": { category: "Accessories", subcategory: "Dry Box" },
  "Peli 1510 Case":                            { category: "Accessories", subcategory: "Others" },
};

const ORPHAN_SLUGS = ["digital-bodies", "mirrorless", "dslr", "dry-box", "bag", "camera"];

async function main() {
  const apply = process.argv.includes("--apply");

  // 1) Taxonomy sanity — every target must exist in lib/categories.ts
  for (const [name, t] of Object.entries(TARGET)) {
    if (!isValidSubcategory(t.category, t.subcategory)) {
      console.error(`INVALID TAXONOMY for "${name}": ${t.category}/${t.subcategory}`);
      process.exit(1);
    }
  }

  // 2) Resolve canonical category IDs by slug
  const categories = await prisma.category.findMany();
  const idBySlug = new Map(categories.map((c) => [c.slug, c.id]));
  const canonical = new Map<string, string>();
  for (const name of ["Cameras", "Lenses", "Accessories"]) {
    const slug = name.toLowerCase().replace(/ /g, "-");
    const id = idBySlug.get(slug);
    if (!id) { console.error(`MISSING canonical category: "${name}" (${slug})`); process.exit(1); }
    canonical.set(name, id);
  }

  // 3) Fetch all products with current category for before/after reporting
  const products = await prisma.product.findMany({
    select: { id: true, name: true, categoryId: true, subcategory: true, category: { select: { name: true, slug: true } } },
  });

  // 4) Re-point + set subcategories
  console.log(`\n${apply ? "APPLYING" : "DRY RUN (no writes) — pass --apply to commit."}\n`);
  const moved: { name: string; from: string; to: string }[] = [];
  const missing: string[] = [];
  for (const [name, t] of Object.entries(TARGET)) {
    const product = products.find((p) => p.name === name);
    if (!product) { missing.push(name); continue; }
    const from = `${product.category?.name ?? "(null)"}/${product.subcategory ?? "(none)"}`;
    const to = `${t.category}/${t.subcategory}`;
    moved.push({ name, from, to });
    if (apply) {
      await prisma.product.update({
        where: { id: product.id },
        data: { categoryId: canonical.get(t.category)!, subcategory: t.subcategory },
      });
    }
  }
  for (const m of moved) console.log(`${m.name}: ${m.from}  ->  ${m.to}`);
  if (missing.length) console.log(`\nUNMATCHED (${missing.length}): ${missing.join(", ")}`);
  if (missing.length && apply) {
    console.error("FATAL: unmatched names — aborting before category deletion.");
    process.exit(1);
  }

  // 5) Safety: verify no product still references an orphan category after re-pointing
  const orphansInUse = products.filter((p) => ORPHAN_SLUGS.includes(p.category?.slug ?? ""));
  if (orphansInUse.some((p) => !Object.keys(TARGET).includes(p.name))) {
    const list = orphansInUse.filter((p) => !Object.keys(TARGET).includes(p.name)).map((p) => p.name);
    console.error(`FATAL: products still reference orphan categories: ${list.join(", ")}`);
    process.exit(1);
  }

  // 6) Delete orphan categories (empty only)
  const orphans = await prisma.category.findMany({
    where: { slug: { in: ORPHAN_SLUGS } },
    include: { _count: { select: { products: true } } },
  });
  for (const cat of orphans) {
    if (apply) {
      if (cat._count.products > 0) {
        console.log(`KEEP "${cat.name}" (${cat.slug}) — still has ${cat._count.products} product(s)`);
        continue;
      }
      await prisma.category.delete({ where: { id: cat.id } });
      console.log(`DELETED orphan category "${cat.name}" (${cat.slug})`);
    } else {
      const action = cat._count.products > 0 ? "KEEP (has products)" : "WOULD DELETE";
      console.log(`${action} "${cat.name}" (${cat.slug}) — ${cat._count.products} product(s)`);
    }
  }

  // 7) Final distribution of the remaining categories
  const after = await prisma.category.findMany({ include: { _count: { select: { products: true } } } });
  console.log("\nFinal category/product distribution:");
  for (const c of after.sort((a, b) => a.name.localeCompare(b.name))) {
    console.log(`  ${c.name} (${c.slug}): ${c._count.products} products`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());