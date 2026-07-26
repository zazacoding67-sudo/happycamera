import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get("orderId");
  const email = searchParams.get("email");

  if (!orderId || !email) {
    return NextResponse.json(
      { error: "Order ID and email are required" },
      { status: 400 }
    );
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: {
              select: { name: true, images: true, slug: true },
            },
          },
        },
      },
    });

    if (!order || order.customerEmail.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: order.id,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      totalAmount: order.totalAmount,
      status: order.status,
      courierName: order.courierName,
      trackingNumber: order.trackingNumber,
      createdAt: order.createdAt,
      items: order.items.map((item) => ({
        name: item.product?.name ?? item.description ?? "Unknown",
        imageUrl: item.product?.images[0] ?? null,
        slug: item.product?.slug ?? null,
        quantity: item.quantity,
        price: item.price,
      })),
    });
  } catch (error) {
    console.error("Track lookup error:", error);
    return NextResponse.json(
      { error: "Failed to look up order" },
      { status: 500 }
    );
  }
}
