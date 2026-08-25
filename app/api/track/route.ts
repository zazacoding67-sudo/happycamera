import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderNumber = searchParams.get("orderId");
  const email = searchParams.get("email");

  if (!orderNumber || !email) {
    return NextResponse.json(
      { error: "Order number and email are required" },
      { status: 400 }
    );
  }

  const normalisedEmail = email.trim().toLowerCase();
  const normalisedOrderNumber = orderNumber.trim();

  try {
    const order = await prisma.order.findFirst({
      where: {
        orderNumber: { equals: normalisedOrderNumber, mode: "insensitive" },
      },
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

    if (!order || order.customerEmail.trim().toLowerCase() !== normalisedEmail) {
      return NextResponse.json(
        { error: "We couldn't find an order matching that number and email. Please double-check both fields and try again." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: order.id,
      orderNumber: order.orderNumber,
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
