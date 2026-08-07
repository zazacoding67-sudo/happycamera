import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";
import { generateOrderNumber } from "../lib/orderNumber";

dotenv.config({ path: ".env.local" });

const adapter = new PrismaPg(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

async function main() {
  const apply = process.argv.includes("--apply");

  const orders = await prisma.order.findMany({
    where: { orderNumber: null },
    select: { id: true, customerName: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  if (orders.length === 0) {
    console.log("No orders missing an order number.");
    return;
  }

  console.log(
    `${orders.length} order(s) missing an order number. ${apply ? "APPLYING." : "DRY RUN (no changes) — pass --apply to write."}`
  );

  const used = new Set<string>();
  for (const o of orders) {
    let candidate = generateOrderNumber();
    while (used.has(candidate)) candidate = generateOrderNumber();
    used.add(candidate);
    console.log(
      `${o.createdAt.toISOString()}  ${o.id}  ${o.customerName}  ->  ${candidate}`
    );
    if (apply) {
      await prisma.order.update({
        where: { id: o.id },
        data: { orderNumber: candidate },
      });
    }
  }

  if (apply) {
    const remaining = await prisma.order.count({ where: { orderNumber: null } });
    console.log(`Done. Orders still missing an order number: ${remaining}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
