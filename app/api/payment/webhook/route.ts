import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendOrderConfirmationEmail } from "@/lib/email";

export async function POST(request: Request) {
  const rawBody = await request.text();

  const signature = request.headers.get("X-Signature");
  const contentType = request.headers.get("content-type");
  const contentEncoding = request.headers.get("content-encoding");

  if (!signature) {
    console.error("CHIP webhook: missing X-Signature header", {
      contentType,
      contentEncoding,
      headerNames: [...request.headers.keys()],
    });
    return new Response("Missing signature", { status: 401 });
  }

  const publicKeyPem = process.env.CHIP_WEBHOOK_PUBLIC_KEY;
  if (!publicKeyPem) {
    console.error("CHIP webhook: CHIP_WEBHOOK_PUBLIC_KEY not configured");
    return new Response("Server configuration error", { status: 500 });
  }

  let isValid = false;
  try {
    const verifier = crypto.createVerify("RSA-SHA256");

    verifier.update(Buffer.from(rawBody, "utf-8"));
    isValid = verifier.verify(publicKeyPem, signature, "base64");

    if (!isValid) {
      const trimmed = rawBody.trim();
      if (trimmed !== rawBody) {
        const retryVerifier = crypto.createVerify("RSA-SHA256");
        retryVerifier.update(Buffer.from(trimmed, "utf-8"));
        isValid = retryVerifier.verify(publicKeyPem, signature, "base64");
      }
    }
  } catch (verifyErr) {
    console.error("CHIP webhook: signature verification threw:", verifyErr);
    return new Response("Signature verification failed", { status: 401 });
  }

  if (!isValid) {
    console.error("CHIP webhook: invalid signature (all attempts)", {
      bodyLength: rawBody.length,
      bodyPreview: rawBody.substring(0, 80),
      contentType,
      contentEncoding,
      headerNames: [...request.headers.keys()],
    });
    return new Response("Invalid signature", { status: 401 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    console.error("CHIP webhook: invalid JSON body");
    return new Response("Invalid JSON", { status: 400 });
  }

  const eventType = payload.event_type as string | undefined;
  if (eventType !== "purchase.paid") {
    return new Response("OK", { status: 200 });
  }

  const chipPurchaseId = payload.id as string | undefined;
  if (!chipPurchaseId) {
    console.error("CHIP webhook: missing purchase id in payload");
    return new Response("Missing purchase id", { status: 400 });
  }

  const order = await prisma.order.findFirst({
    where: { paymentReference: chipPurchaseId },
    include: { items: true },
  });

  if (!order) {
    console.error(`CHIP webhook: no order found for paymentReference=${chipPurchaseId}`);
    return new Response("Order not found", { status: 404 });
  }

  if (order.status === "PAID") {
    return new Response("OK", { status: 200 });
  }

  await prisma.order.update({
    where: { id: order.id },
    data: { status: "PAID" },
  });

  for (const item of order.items) {
    if (!item.productId) continue;
    await prisma.product.update({
      where: { id: item.productId },
      data: { stockQuantity: { decrement: item.quantity } },
    });
  }

  await sendOrderConfirmationEmail({
    to: order.customerEmail,
    customerName: order.customerName,
    paymentReference: order.paymentReference || chipPurchaseId,
    totalAmount: order.totalAmount,
  });

  return new Response("OK", { status: 200 });
}
