import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createOrderWithOrderNumber } from "@/lib/orderFactory";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (typeof body !== "object" || body === null) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { items, customerName, customerEmail, customerPhone, shippingAddress } = body;

    if (!items?.length || !customerName || !customerEmail || !customerPhone || !shippingAddress) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (typeof customerEmail !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const lineItems: { productId: string; quantity: number; name: string; price: number }[] = [];

    for (const item of items) {
      if (
        !item ||
        typeof item.productId !== "string" ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1
      ) {
        return NextResponse.json({ error: "Invalid item in cart." }, { status: 400 });
      }

      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        select: { id: true, stockQuantity: true, name: true, price: true },
      });
      if (!product) {
        return NextResponse.json({ error: `Product not found.` }, { status: 400 });
      }
      if (product.stockQuantity < item.quantity) {
        return NextResponse.json({
          error: `"${product.name}" only has ${product.stockQuantity} in stock. Please reduce the quantity.`,
        }, { status: 400 });
      }

      lineItems.push({
        productId: product.id,
        quantity: item.quantity,
        name: product.name,
        price: product.price,
      });
    }

    const totalAmount = lineItems.reduce(
      (sum: number, item: { price: number; quantity: number }) =>
        sum + item.price * item.quantity,
      0
    );

    const order = await createOrderWithOrderNumber({
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      totalAmount,
      status: "PENDING",
      items: {
        create: lineItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";

    const chipBody = {
      client: {
        email: customerEmail,
        full_name: customerName,
        phone: customerPhone,
      },
      purchase: {
        currency: "MYR",
        products: lineItems.map((item) => ({
          name: item.name,
          price: Math.round(item.price * 100),
          quantity: item.quantity,
        })),
      },
      brand_id: process.env.CHIP_BRAND_ID,
      success_redirect: `${baseUrl}/shop/success?ref=${order.id}`,
      failure_redirect: `${baseUrl}/shop/failed`,
      success_callback: `${baseUrl}/api/payment/webhook`,
      reference: order.id,
    };

    let paymentReference: string | undefined;

    try {
      const chipRes = await fetch("https://gate.chip-in.asia/api/v1/purchases/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.CHIP_SECRET_KEY}`,
        },
        body: JSON.stringify(chipBody),
        signal: AbortSignal.timeout(15_000),
      });

      const raw = await chipRes.text();
      let parsed: Record<string, unknown>;
      try {
        parsed = JSON.parse(raw);
      } catch {
        console.error("CHIP non-JSON response:", raw.slice(0, 500));
        throw new Error("PROVIDER_NON_JSON");
      }

      if (!parsed.id || !parsed.checkout_url) {
        console.error("CHIP error payload:", JSON.stringify(parsed).slice(0, 1000));
        throw new Error("PROVIDER_NO_CHECKOUT_URL");
      }

      paymentReference = parsed.id as string;

      await prisma.order.update({
        where: { id: order.id },
        data: { paymentReference, paymentGateway: "CHIP" },
      });

      return NextResponse.json({ paymentUrl: parsed.checkout_url as string }, { status: 200 });
    } catch (providerErr) {
      const isProviderError =
        providerErr instanceof Error &&
        (providerErr.message === "PROVIDER_NON_JSON" ||
          providerErr.message === "PROVIDER_NO_CHECKOUT_URL" ||
          providerErr.name === "TimeoutError" ||
          providerErr.name === "AbortError" ||
          providerErr.message.includes("fetch"));

      if (isProviderError) {
        try {
          await prisma.$transaction([
            prisma.orderItem.deleteMany({ where: { orderId: order.id } }),
            prisma.order.delete({ where: { id: order.id } }),
          ]);
        } catch (cleanupErr) {
          console.error("Checkout: failed to clean up order after provider error.", {
            orderId: order.id,
            error: cleanupErr,
          });
        }
        return NextResponse.json(
          { error: "Payment provider is temporarily unavailable. Please try again shortly." },
          { status: 503 }
        );
      }
      throw providerErr;
    }
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
