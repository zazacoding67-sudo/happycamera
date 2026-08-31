import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, CreditCard } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import OrderDetailClient from "./OrderDetailClient";

export const dynamic = "force-dynamic";

const cardBase = "bg-[var(--color-surface)] border border-[var(--color-border)] p-6";
const label = "text-[11px] font-semibold uppercase tracking-widest text-[var(--color-text-secondary)]";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: { select: { name: true } } } } },
  });

  if (!order) notFound();

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
    PAID: "bg-blue-50 text-blue-700 border-blue-200",
    PROCESSING: "bg-purple-50 text-purple-700 border-purple-200",
    SHIPPED: "bg-indigo-50 text-indigo-700 border-indigo-200",
    DELIVERED: "bg-green-50 text-green-700 border-green-200",
    CANCELLED: "bg-red-50 text-red-700 border-red-200",
  };

  const subtotal = order.items.reduce(
    (s: number, i: { price: number; quantity: number }) => s + i.price * i.quantity,
    0
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-1 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors mb-6"
        >
          <ArrowLeft size={14} />
          Back to Orders
        </Link>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
                Order {order.orderNumber ?? `#${order.id.slice(0, 8)}`}
              </h1>
              <span
                className={`text-[9px] font-semibold uppercase tracking-widest px-2 py-0.5 border ${
                  order.source === "MANUAL"
                    ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                    : "bg-gray-50 text-gray-500 border-gray-200"
                }`}
              >
                {order.source === "MANUAL" ? "Manual / external order" : "Website order"}
              </span>
            </div>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1 break-all">
              {order.orderNumber && (
                <span className="font-mono mr-3">Internal ID: {order.id}</span>
              )}
              {order.createdAt.toLocaleDateString()}
            </p>
          </div>
          <span
            className={`shrink-0 text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 border ${
              statusColors[order.status] || "bg-gray-50 text-gray-700 border-gray-200"
            }`}
          >
            {order.status}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 items-start">
          {/* Left column — Items + Status + Shipping */}
          <div className="space-y-6">
            <div className={cardBase}>
              <h3 className={label + " mb-4"}>Items</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-border)]">
                    <Th>Product</Th>
                    <Th>Qty</Th>
                    <Th className="text-right">Price</Th>
                    <Th className="text-right">Subtotal</Th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.id} className="border-b border-[var(--color-border)] last:border-b-0">
                      <td className="py-2.5 text-[var(--color-text-primary)]">
                        {item.product?.name || item.description || "Unknown"}
                      </td>
                      <td className="py-2.5 text-[var(--color-text-secondary)]">{item.quantity}</td>
                      <td className="py-2.5 text-right text-[var(--color-text-secondary)]">
                        {formatPrice(item.price)}
                      </td>
                      <td className="py-2.5 text-right font-medium text-[var(--color-text-primary)]">
                        {formatPrice(item.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} className="pt-3 text-right text-[11px] font-semibold uppercase tracking-widest text-[var(--color-text-secondary)]">
                      Total
                    </td>
                    <td className="pt-3 text-right font-bold text-[var(--color-text-primary)]">
                      {formatPrice(subtotal)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <OrderDetailClient
              orderId={order.id}
              currentStatus={order.status}
              currentCourier={order.courierName || ""}
              currentTracking={order.trackingNumber || ""}
            />
          </div>

          {/* Right column — Customer + Payment */}
          <div className="space-y-6 lg:sticky lg:top-6">
            <div className={cardBase}>
              <div className="flex items-center gap-2 mb-4">
                <User size={16} className="text-[var(--color-text-secondary)]" />
                <h3 className={label}>Customer</h3>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-[var(--color-text-primary)]">{order.customerName}</p>
                <p className="text-sm text-[var(--color-text-secondary)]">{order.customerEmail}</p>
                {order.customerPhone && (
                  <p className="text-sm text-[var(--color-text-secondary)]">{order.customerPhone}</p>
                )}
              </div>
            </div>

            <div className={cardBase}>
              <div className="flex items-center gap-2 mb-4">
                <CreditCard size={16} className="text-[var(--color-text-secondary)]" />
                <h3 className={label}>Payment</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--color-text-secondary)]">Subtotal</span>
                  <span className="text-sm text-[var(--color-text-primary)]">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border)]">
                  <span className="text-sm font-semibold text-[var(--color-text-primary)]">Total</span>
                  <span className="text-base font-bold text-[var(--color-text-primary)]">
                    {formatPrice(order.totalAmount)}
                  </span>
                </div>
                {order.paymentReference && (
                  <p className="pt-2 text-xs text-[var(--color-text-secondary)] font-mono">
                    Reference: {order.paymentReference}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Th({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <th
      className={`text-left py-2.5 text-[11px] font-semibold uppercase tracking-widest text-[var(--color-text-secondary)] ${className || ""}`}
    >
      {children}
    </th>
  );
}
