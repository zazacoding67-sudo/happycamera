import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";
import { isValidSubcategory } from "../lib/categories";

dotenv.config({ path: ".env.local" });

const adapter = new PrismaPg(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

const TARGET: Record<string, { category: string; subcategory: string }> = {
  "Nikon D610": { category: "Cameras", subcategory: "DSLR" },
  "Sony A6400": { category: "Cameras", subcategory: "Mirrorless" },
  "Sony ZV-E10 II": { category: "Cameras", subcategory: "Mirrorless" },
  "Sony Cyber-shot RX100 VII": { category: "Cameras", subcategory: "Compact" },
  "Sony FE 100mm f/2.8 Macro GM Lens": { category: "Lenses", subcategory: "Prime" },
  "Zeiss 35mm f/1.4": { category: "Lenses", subcategory: "Prime" },
  "Godox AD100Pro II Pocket Flash": { category: "Accessories", subcategory: "Flashes" },
  "Red Buffalo RBC-60PRO 50L Dry Cabinet Box": { category: "Accessories", subcategory: "Others" },
  "F-Stop Tilopa 50L": { category: "Accessories", subcategory: "Bags" },
  "PGYTECH OneGo Drawstring Bag": { category: "Accessories", subcategory: "Bags" },
};

const RETIRED_CATEGORY_SLUGS = ["digital-bodies", "mirrorless", "dslr", "dry-box", "bag", "camera"];

async function main() {
  const apply = process.argv.includes("--apply");

  for (const [name, target] of Object.entries(TARGET)) {
    if (!isValidSubcategory(target.category, target.subcategory)) {
      console.error(`INVALID TAXONOMY for "${name}": ${target.category}/${target.subcategory}`);
      process.exit(1);
    }
  }

  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      category: { select: { name: true, slug: true } },
      subcategory: true,
    },
  });

  const categories = await prisma.category.findMany();

  const ensureCategory = async (name: string, slug: string) => {
    const existing = categories.find((c) => c.slug === slug);
    if (existing) return existing;
    console.log(`${apply ? "CREATE" : "WOULD CREATE"} category "${name}" (${slug})`);
    if (apply) {
      const created = await prisma.category.create({ data: { name, slug } });
      categories.push(created);
      return created;
    }
    return null;
  };

  const wanted = ["Cameras", "Lenses", "Accessories"].map((name) => ({
    name,
    slug: name.toLowerCase().replace(/ /g, "-"),
  }));

  const createdIds: Record<string, string | null> = {};
  for (const { name, slug } of wanted) {
    const cat = await ensureCategory(name, slug);
    if (cat) createdIds[name] = cat.id;
  }

  console.log(`\n${apply ? "APPLYING" : "DRY RUN (no changes) — pass --apply to write."}\n`);

  const matched: string[] = [];
  for (const [name, target] of Object.entries(TARGET)) {
    const product = products.find((p) => p.name === name);
    if (!product) {
      console.log(`SKIP (no exact name match): "${name}"`);
      continue;
    }
    matched.push(name);
    const current = `${product.category?.name ?? "(none)"} / ${product.subcategory ?? "(none)"}`;
    const next = `${target.category} / ${target.subcategory}`;
    console.log(`${product.name}: ${current}  ->  ${next}`);
    if (apply) {
      await prisma.product.update({
        where: { id: product.id },
        data: {
          categoryId: createdIds[target.category]!,
          subcategory: target.subcategory,
        },
      });
    }
  }

  const missing = Object.keys(TARGET).filter((n) => !matched.includes(n));
  if (missing.length > 0) {
    console.log(`\nUNMATCHED (${missing.length}): ${missing.join(", ")}`);
  }

  if (apply) {
    const retired = await prisma.category.findMany({
      where: { slug: { in: RETIRED_CATEGORY_SLUGS } },
      include: { _count: { select: { products: true } } },
    });
    for (const cat of retired) {
      if (cat._count.products > 0) {
        console.log(`KEEP category "${cat.name}" (${cat.slug}) — still has ${cat._count.products} product(s)`);
        continue;
      }
      await prisma.category.delete({ where: { id: cat.id } });
      console.log(`DELETED retired category "${cat.name}" (${cat.slug})`);
    }
  } else {
    console.log("\nRetired categories (dry run): would delete any empty retired slug");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
