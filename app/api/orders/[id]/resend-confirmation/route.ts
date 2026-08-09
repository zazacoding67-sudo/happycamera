import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendOrderConfirmationEmail } from "@/lib/email";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }
  if ((session.user as Record<string, unknown>).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;

  try {
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    await sendOrderConfirmationEmail({
      to: order.customerEmail,
      customerName: order.customerName,
      orderNumber: order.orderNumber || "",
      totalAmount: order.totalAmount,
    });

    return NextResponse.json({ ok: true, orderNumber: order.orderNumber });
  } catch (error) {
    console.error("Failed to resend confirmation email:", error);
    return NextResponse.json({ error: "Failed to resend confirmation email" }, { status: 500 });
  }
}
