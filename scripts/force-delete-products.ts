import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { prisma } from "../lib/prisma";

async function main() {
  const names = [
    "Manfrotto Pro Light Multiloader",
    "Fujifilm X100VI",
    "Zeiss 35mm f/1.4",
  ];

  const products = await prisma.product.findMany({
    where: { name: { in: names } },
    select: { id: true, name: true },
  });

  if (products.length === 0) {
    console.log("No matching products found.");
    return;
  }

  const ids = products.map((p) => p.id);

  console.log("Found:", products.map((p) => p.name));

  await prisma.$transaction([
    prisma.orderItem.deleteMany({ where: { productId: { in: ids } } }),
    prisma.review.deleteMany({ where: { productId: { in: ids } } }),
    prisma.product.deleteMany({ where: { id: { in: ids } } }),
  ]);

  console.log(`Deleted ${products.length} product(s)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
