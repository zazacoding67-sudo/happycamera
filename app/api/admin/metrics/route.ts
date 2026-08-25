import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAdminMetrics } from "@/lib/adminMetrics";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as Record<string, unknown>).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const metrics = await getAdminMetrics();
  const response = NextResponse.json(metrics);
  response.headers.set("Cache-Control", "no-store");
  return response;
}
