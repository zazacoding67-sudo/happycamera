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

    const order = await prisma.order.findUnique({ where: { id } });
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
