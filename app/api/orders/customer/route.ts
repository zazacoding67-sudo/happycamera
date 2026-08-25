import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
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
      orderNumber: o.orderNumber,
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
