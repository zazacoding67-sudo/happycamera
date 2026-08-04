import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const orders = await prisma.order.findMany({
    where: { customerEmail: user.email },
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        select: {
          quantity: true,
          price: true,
          description: true,
          product: {
            select: { name: true },
          },
        },
      },
    },
  });

  return NextResponse.json({
    orders: orders.map((o) => ({
      id: o.id,
      totalAmount: o.totalAmount,
      status: o.status,
      courierName: o.courierName,
      trackingNumber: o.trackingNumber,
      createdAt: o.createdAt,
      items: o.items.map((item) => ({
        name: item.product?.name || item.description || "Item",
        quantity: item.quantity,
        price: item.price,
      })),
    })),
  });
}
