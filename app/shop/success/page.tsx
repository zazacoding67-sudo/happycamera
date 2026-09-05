import Link from "next/link";
import { CheckCircle2, Clock, Mail, Package, Truck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import CartClearer from "@/components/ui/CartClearer";
import StepIndicator from "@/components/checkout/StepIndicator";

interface Props {
  searchParams: Promise<{ ref?: string }>;
}

export default async function SuccessPage({ searchParams }: Props) {
  const { ref } = await searchParams;

  let order = null;
  if (ref) {
    order = await prisma.order.findUnique({
      where: { id: ref },
      include: {
        items: { include: { product: { select: { name: true } } } },
      },
    });
  }

  const isPendingBankTransfer =
    order?.paymentGateway === "MANUAL_BANK_TRANSFER" && order.status === "PENDING";

  return (
    <>
      <CartClearer />
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-16">
        <div className="max-w-lg w-full text-center">
          <StepIndicator currentStep={4} />
          {isPendingBankTransfer ? (
            <Clock
              size={48}
              className="text-amber-500 mx-auto mb-6 mt-10"
              strokeWidth={1.5}
            />
          ) : (
            <CheckCircle2
              size={48}
              className="text-emerald-600 mx-auto mb-6 mt-10"
              strokeWidth={1.5}
            />
          )}

          <h1 className="text-4xl font-bold tracking-tight text-[var(--color-text-primary)]">
            {isPendingBankTransfer ? "Order Placed — Payment Pending" : "Payment Confirmed"}
          </h1>

          {order ? (
            <>
              <p className="text-sm text-[var(--color-text-secondary)] mt-4 max-w-sm mx-auto leading-relaxed">
                {isPendingBankTransfer ? (
                  <>
                    We&rsquo;ve received your order. We&rsquo;ll verify your bank
                    transfer and confirm your payment shortly. You&rsquo;ll be
                    notified at{" "}
                    <span className="font-medium text-[var(--color-text-primary)]">
                      {order.customerEmail}
                    </span>{" "}
                    once your order is confirmed.
                  </>
                ) : (
                  <>
                    Your order has been placed successfully. A confirmation email
                    is on its way to{" "}
                    <span className="font-medium text-[var(--color-text-primary)]">
                      {order.customerEmail}
                    </span>
                    .
                  </>
                )}
              </p>

              <p className="mt-6 text-[11px] font-medium uppercase tracking-[0.1em] text-[var(--color-text-secondary)]">
                Order Number: {order.orderNumber ?? order.id.slice(0, 8).toUpperCase()}
              </p>

              <div className="mt-8 border border-[var(--color-border)] rounded-none text-left">
                <div className="divide-y divide-[var(--color-border)]">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between px-5 py-4"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                          {item.product?.name || item.description || "Item"}
                        </p>
                        <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-[var(--color-text-primary)] ml-4">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between px-5 py-4 border-t border-[var(--color-border)]">
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    Delivery
                  </p>
                  <p className="text-sm font-medium text-[var(--color-text-primary)]">
                    {order.deliveryCharge ? formatPrice(order.deliveryCharge) : "Free"}
                  </p>
                </div>
                <div className="flex items-center justify-between px-5 py-4 border-t border-[var(--color-border)] bg-gray-50">
                  <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                    Total
                  </p>
                  <p className="text-lg font-bold text-[var(--color-text-primary)]">
                    {formatPrice(order.totalAmount)}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <p className="text-sm text-[var(--color-text-secondary)] mt-4 max-w-sm mx-auto leading-relaxed">
              Thank you for your purchase. A confirmation email will be sent
              shortly with your order details.
            </p>
          )}

          <div className="mt-12 border-t border-[var(--color-border)] pt-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--color-text-secondary)] mb-5">
              What happens next
            </p>
            <div className="flex flex-col sm:flex-row gap-6 text-left">
              <div className="flex gap-3 flex-1">
                <Mail
                  size={18}
                  className="text-[var(--color-text-secondary)] shrink-0 mt-0.5"
                  strokeWidth={1.5}
                />
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  {isPendingBankTransfer
                    ? "We&rsquo;ll confirm your payment once your transfer is verified."
                    : "You&rsquo;ll receive an email confirmation shortly."}
                </p>
              </div>
              <div className="flex gap-3 flex-1">
                <Package
                  size={18}
                  className="text-[var(--color-text-secondary)] shrink-0 mt-0.5"
                  strokeWidth={1.5}
                />
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  {isPendingBankTransfer
                    ? "We&rsquo;ll prepare your order once payment is confirmed."
                    : "We&rsquo;ll prepare your order within 1&ndash;2 business days."}
                </p>
              </div>
              <div className="flex gap-3 flex-1">
                <Truck
                  size={18}
                  className="text-[var(--color-text-secondary)] shrink-0 mt-0.5"
                  strokeWidth={1.5}
                />
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  Tracking details will be sent once shipped.
                </p>
              </div>
            </div>
          </div>

          <Link
            href="/shop"
            className="mt-10 inline-flex items-center justify-center px-8 py-3.5 text-[13px] font-semibold uppercase tracking-wide bg-[#1A1A1A] text-white hover:bg-[#333] transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </>
  );
}
