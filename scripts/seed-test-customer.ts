import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";

const EMAIL = "e2e-customer@happycamera.com";

const upsert = async (withPassword: boolean) => {
  const password = withPassword ? await bcrypt.hash("customer123", 10) : null;
  await prisma.user.upsert({
    where: { email: EMAIL },
    update: { password, role: "customer", provider: "credentials" },
    create: {
      email: EMAIL,
      name: "E2E Customer",
      password,
      role: "customer",
      provider: "credentials",
    },
  });
  console.log(`upserted ${EMAIL} withPassword=${withPassword}`);
};

const remove = async () => {
  await prisma.user.deleteMany({ where: { email: EMAIL } });
  console.log(`removed ${EMAIL}`);
};

const arg = process.argv[2];
if (arg === "--create") await upsert(true);
else if (arg === "--remove") await remove();
else console.log("usage: tsx scripts/seed-test-customer.ts --create|--remove");

await prisma.$disconnect();
