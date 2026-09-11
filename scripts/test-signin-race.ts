import { readFileSync } from "fs";
import path from "path";
import { createRequire } from "module";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load env from .env.local BEFORE any lib imports
const envContent = readFileSync(path.join(__dirname, "..", ".env.local"), "utf-8");
for (const line of envContent.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eq = trimmed.indexOf("=");
  if (eq < 0) continue;
  const key = trimmed.slice(0, eq).trim();
  let val = trimmed.slice(eq + 1).trim();
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'")))
    val = val.slice(1, -1);
  if (!(key in process.env)) process.env[key] = val;
}

// Import via CJS require so tsx's esbuild interop resolves next-auth's
// `exports.default` CJS providers the same way Next's webpack does.
const req = createRequire(import.meta.url);
const { prisma } = req("../lib/prisma") as any;
const { authOptions } = req("../lib/auth") as any;

const signIn = authOptions.callbacks.signIn!;
const ts = Date.now();

function makeInput(email: string) {
  return {
    user: {
      id: `google-sub-${ts}`,
      name: "Test Google User",
      email,
      image: "https://example.com/avatar.png",
    },
    account: { provider: "google", providerAccountId: `google-sub-${ts}` } as any,
    profile: {} as any,
  };
}

const testEmail = `race-test-${ts}@example.com`;
const ciEmail = `CiTest-${ts}@Example.COM`;
const ciLower = ciEmail.toLowerCase();
const CONCURRENCY = Number(process.env.CONCURRENCY ?? 2);

async function countByEmail(email: string) {
  return prisma.user.count({
    where: { email: { equals: email, mode: "insensitive" } },
  });
}

const startTotal = await prisma.user.count();

try {
  console.log("Test 1 — concurrent first-time sign-in (x" + CONCURRENCY + "), email:", testEmail);
  const results = await Promise.all(
    Array.from({ length: CONCURRENCY }, () => signIn(makeInput(testEmail) as any))
  );
  console.log("  callback results:", results);
  for (let i = 0; i < results.length; i++) {
    if (results[i] !== true) throw new Error(`Callback ${i} returned ${results[i]}`);
  }

  const raceCount = await countByEmail(testEmail);
  console.log("  rows after race:", raceCount, "(expected 1)");
  if (raceCount !== 1) throw new Error(`Expected 1 row, got ${raceCount}`);

  const raceUser = await prisma.user.findFirst({
    where: { email: { equals: testEmail, mode: "insensitive" } },
  });
  console.log("  user id:", raceUser.id, "provider:", raceUser.provider, "role:", raceUser.role);
  if (raceUser.provider !== "google" || raceUser.role !== "customer")
    throw new Error(`Unexpected row ${JSON.stringify(raceUser)}`);

  console.log("\nTest 2 — case-insensitive linking, seed email:", ciEmail);
  await prisma.user.create({
    data: { email: ciEmail, name: "CITest", provider: "credentials", role: "customer" },
  });

  const res3 = await signIn(makeInput(ciLower) as any);
  console.log("  callback result:", res3);
  if (res3 !== true) throw new Error(`CI callback returned ${res3}`);

  const ciCount = await countByEmail(ciEmail);
  console.log("  rows:", ciCount, "(expected 1)");
  if (ciCount !== 1) throw new Error(`Expected 1 CI row, got ${ciCount}`);

  const ciUser = await prisma.user.findFirst({
    where: { email: { equals: ciEmail, mode: "insensitive" } },
  });
  console.log("  provider:", ciUser.provider, "(expected google), name:", ciUser.name, "(should be CITest)");
  if (ciUser.provider !== "google") throw new Error(`Expected provider google, got ${ciUser.provider}`);
  if (ciUser.name !== "CITest") throw new Error(`Name was overwritten to ${ciUser.name}`);

  console.log("\nAll tests passed.\n");
} finally {
  await prisma.user.deleteMany({
    where: {
      OR: [testEmail, ciEmail].map((email) => ({
        email: { equals: email, mode: "insensitive" },
      })),
    },
  });
  const remaining = (await countByEmail(testEmail)) + (await countByEmail(ciEmail));
  console.log("Cleanup — remaining:", remaining, "(expected 0)");
  if (remaining !== 0) throw new Error(`Cleanup failed: ${remaining} rows remain`);
  const endTotal = await prisma.user.count();
  console.log("Users total:", startTotal, "->", endTotal, "(must be unchanged)");
  if (endTotal !== startTotal) throw new Error(`User count drifted ${startTotal} -> ${endTotal}`);
  await prisma.$disconnect();
}