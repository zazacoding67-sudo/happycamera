import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOrderShippedEmail } from "@/lib/email";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await request.json();
    const { status, courierName, trackingNumber, trackingEdited } = body;

    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        ...(status ? { status } : {}),
        ...(courierName !== undefined ? { courierName: courierName || null } : {}),
        ...(trackingNumber !== undefined ? { trackingNumber: trackingNumber || null } : {}),
      },
    });

    // For manual bank-transfer orders, decrement stock when transitioning INTO PAID
    // (the CHIP webhook never fires for manual orders, so this is the only decrement path).
    if (
      status === "PAID" &&
      order.status !== "PAID" &&
      order.paymentGateway === "MANUAL_BANK_TRANSFER"
    ) {
      await prisma.$transaction(async (tx) => {
        for (const item of order.items) {
          if (!item.productId) continue;
          await tx.product.updateMany({
            where: { id: item.productId, stockQuantity: { gte: item.quantity } },
            data: { stockQuantity: { decrement: item.quantity } },
          });
        }
      });
    }

    // Send email when transitioning INTO SHIPPED
    if (status === "SHIPPED" && order.status !== "SHIPPED") {
      await sendOrderShippedEmail({
        to: order.customerEmail,
        customerName: order.customerName,
        courierName: courierName || order.courierName,
        trackingNumber: trackingNumber || order.trackingNumber,
      });
    }

    // Re-fire email when tracking is edited after already shipped
    if (trackingEdited && order.status === "SHIPPED") {
      await sendOrderShippedEmail({
        to: order.customerEmail,
        customerName: order.customerName,
        courierName: courierName || order.courierName,
        trackingNumber: trackingNumber || order.trackingNumber,
        subjectOverride: "Your Order Has Shipped! (Updated Tracking)",
      });
    }

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Failed to update order:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}
