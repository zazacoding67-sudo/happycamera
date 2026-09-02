import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createOrderWithOrderNumber } from "@/lib/orderFactory";
import { sendOrderShippedEmail } from "@/lib/email";

function validate(errors: Record<string, string>, body: {
  customerName: string;
  customerEmail: string;
  itemsDescription: string;
  totalAmount: number;
  courierName: string;
  trackingNumber: string;
}) {
  if (!body.customerName?.trim()) errors.customerName = "Customer name is required.";
  if (!body.customerEmail?.trim()) errors.customerEmail = "Customer email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.customerEmail))
    errors.customerEmail = "Enter a valid email address.";
  if (!body.itemsDescription?.trim()) errors.itemsDescription = "Item(s) sold is required.";
  if (!body.totalAmount || isNaN(body.totalAmount) || body.totalAmount <= 0)
    errors.totalAmount = "Enter a valid amount greater than 0.";
  else if (body.totalAmount > 999_999)
    errors.totalAmount = "Amount seems unreasonably high (max RM 999,999).";
  if (!body.courierName?.trim()) errors.courierName = "Courier name is required.";
  if (!body.trackingNumber?.trim()) errors.trackingNumber = "Tracking number is required.";
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }
  if ((session.user as Record<string, unknown>).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { customerName, customerEmail, customerPhone, shippingAddress, itemsDescription, totalAmount, courierName, trackingNumber } = body;

    const errors: Record<string, string> = {};
    validate(errors, { customerName, customerEmail, itemsDescription, totalAmount, courierName, trackingNumber });

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ error: "Validation failed", fields: errors }, { status: 400 });
    }

    const order = await createOrderWithOrderNumber({
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim(),
      customerPhone: customerPhone || "",
      shippingAddress: shippingAddress || null,
      totalAmount,
      status: "SHIPPED",
      source: "MANUAL",
      courierName: courierName.trim(),
      trackingNumber: trackingNumber.trim(),
      items: {
        create: {
          description: itemsDescription.trim(),
          quantity: 1,
          price: totalAmount,
          productId: null,
        },
      },
    });

    await sendOrderShippedEmail({
      to: order.customerEmail,
      customerName: order.customerName,
      courierName: order.courierName,
      trackingNumber: order.trackingNumber,
    });

    return NextResponse.json(
      { id: order.id, orderNumber: order.orderNumber },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create manual order:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
