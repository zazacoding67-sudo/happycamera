import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export async function GET() {
  const session = await getServerSession();

  if (process.env.NODE_ENV === "production") {
    if (!session || (session.user as Record<string, unknown>)?.role !== "admin") {
      return NextResponse.json({ status: "ok" });
    }
  }

  const { prisma } = await import("@/lib/prisma");

  try {
    const allProductIds = (
      await prisma.product.findMany({ select: { id: true } })
    ).map((p) => p.id);

    const orphanReviews = await prisma.review.findMany({
      where: { productId: { notIn: allProductIds } },
    });

    const orphanOrderItems = await prisma.orderItem.findMany({
      where: { productId: { notIn: allProductIds } },
    });

    return NextResponse.json({
      healthy: allProductIds.length > 0,
      totalProducts: allProductIds.length,
      orphanedReviews: orphanReviews.length,
      orphanedOrderItems: orphanOrderItems.length,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE() {
  const session = await getServerSession();

  if (process.env.NODE_ENV === "production") {
    if (!session || (session.user as Record<string, unknown>)?.role !== "admin") {
      return NextResponse.json({ status: "ok" });
    }
  }

  const { prisma } = await import("@/lib/prisma");

  try {
    const allProductIds = (
      await prisma.product.findMany({ select: { id: true } })
    ).map((p) => p.id);

    const result = await prisma.$transaction([
      prisma.review.deleteMany({ where: { productId: { notIn: allProductIds } } }),
      prisma.orderItem.deleteMany({ where: { productId: { notIn: allProductIds } } }),
    ]);

    return NextResponse.json({
      message: "Orphans cleaned",
      deletedReviews: result[0].count,
      deletedOrderItems: result[1].count,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
