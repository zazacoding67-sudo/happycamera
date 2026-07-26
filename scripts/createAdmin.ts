import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const adapter = new PrismaPg(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashedPassword = await bcrypt.hash('wilson123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@happycamera.com' },
    update: {},
    create: {
      name: 'Wilson',
      email: 'admin@happycamera.com',
      password: hashedPassword,
      role: 'admin',
    },
  });

  console.log('✅ Admin user created: admin@happycamera.com / wilson123');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
