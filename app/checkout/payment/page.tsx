"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/CartContext";
import { useCheckout } from "@/lib/CheckoutContext";
import { computeDeliveryCharge, type DeliveryMethod, type DeliveryRegion } from "@/lib/delivery";
import { formatPrice } from "@/lib/format";
import StepIndicator from "@/components/checkout/StepIndicator";
import Button from "@/components/ui/Button";

export default function CheckoutPaymentPage() {
  const router = useRouter();
  const { items, hydrated: cartHydrated } = useCart();
  const { info } = useCheckout();

  const [isLoading, setIsLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const deliveryCharge = computeDeliveryCharge(info.deliveryMethod as DeliveryMethod, info.deliveryRegion as DeliveryRegion);
  const total = subtotal + deliveryCharge;

  const ready =
    items.length > 0 &&
    info.customerName.trim() &&
    info.customerEmail.trim() &&
    info.customerPhone.trim() &&
    (info.deliveryMethod === "self_collect" || info.shippingAddress.trim());

  useEffect(() => {
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        setIsLoading(false);
        setCheckoutError("");
      }
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  useEffect(() => {
    if (!cartHydrated) return;
    if (!ready) {
      router.replace(items.length === 0 ? "/checkout" : "/checkout/delivery");
    }
  }, [ready, items.length, cartHydrated, router]);

  if (!cartHydrated || !ready) {
    return null;
  }

  const handleProceed = async () => {
    setIsLoading(true);
    setCheckoutError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          customerName: info.customerName,
          customerEmail: info.customerEmail,
          customerPhone: info.customerPhone,
          shippingAddress: info.shippingAddress,
          deliveryMethod: info.deliveryMethod,
          deliveryRegion: info.deliveryRegion,
        }),
      });

      const data = await res.json();
      if (res.ok && data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        setCheckoutError(data.error || "Checkout failed. Please try again.");
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Checkout failed:", err);
      setCheckoutError("Network error. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <StepIndicator currentStep={3} />

      <h1 className="mt-10 text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
        Payment
      </h1>
      <p className="text-sm text-[var(--color-text-secondary)] mt-1 mb-8">
        Review your order, then proceed securely to payment.
      </p>

      {/* Order summary */}
      <ul className="divide-y divide-[var(--color-border)] border-t border-[var(--color-border)]">
        {items.map((item) => (
          <li key={item.productId} className="flex items-center justify-between py-4">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                {item.name}
              </p>
              <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                Qty: {item.quantity}
              </p>
            </div>
            <p className="text-sm font-semibold text-[var(--color-text-primary)] ml-4">
              {formatPrice(item.price * item.quantity)}
            </p>
          </li>
        ))}
      </ul>

      {/* Totals */}
      <div className="border-t border-[var(--color-border)] pt-4 space-y-2 mt-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-[var(--color-text-secondary)]">Subtotal</span>
          <span className="text-[var(--color-text-primary)]">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-[var(--color-text-secondary)]">
            {info.deliveryMethod === "self_collect" ? "Self Collect" : "Standard Shipping"}
          </span>
          <span className="text-[var(--color-text-primary)]">
            {deliveryCharge === 0 ? "Free" : formatPrice(deliveryCharge)}
          </span>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border)]">
          <span className="text-sm font-semibold text-[var(--color-text-primary)]">Total</span>
          <span className="text-xl font-bold text-[var(--color-text-primary)]">
            {formatPrice(total)}
          </span>
        </div>
      </div>

      {/* Contact delivery summary */}
      <div className="mt-6 border border-[var(--color-border)] p-5 space-y-1 text-sm">
        <p className="font-semibold text-[var(--color-text-primary)]">{info.customerName}</p>
        <p className="text-[var(--color-text-secondary)]">{info.customerEmail}</p>
        <p className="text-[var(--color-text-secondary)]">{info.customerPhone}</p>
        {info.deliveryMethod === "self_collect" ? (
          <p className="text-xs text-[var(--color-text-secondary)] mt-2">
            Self Collect at Store
          </p>
        ) : (
          <p className="text-xs text-[var(--color-text-secondary)] mt-2 whitespace-pre-wrap">
            {info.shippingAddress}
          </p>
        )}
      </div>

      {checkoutError && (
        <p className="text-xs text-red-500 text-center mt-4">{checkoutError}</p>
      )}

      <div className="flex items-center gap-2 pt-5 mt-4">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-[var(--color-text-secondary)] bg-gray-100 px-2 py-1">
          FPX
        </span>
        <span className="text-[10px] font-medium uppercase tracking-wide text-[var(--color-text-secondary)] bg-gray-100 px-2 py-1">
          Visa
        </span>
        <span className="text-[10px] font-medium uppercase tracking-wide text-[var(--color-text-secondary)] bg-gray-100 px-2 py-1">
          Mastercard
        </span>
        <span className="text-[10px] text-[var(--color-text-secondary)] ml-auto">
          Secure payment via CHIP
        </span>
      </div>

      <div className="flex items-center justify-between gap-3 mt-8">
        <button
          onClick={() => router.push("/checkout/delivery")}
          className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] underline underline-offset-4 transition-colors"
        >
          Back to Delivery
        </button>
        <Button
          variant="primary"
          className="px-8"
          onClick={handleProceed}
          disabled={isLoading}
          status={isLoading ? "loading" : "idle"}
        >
          Proceed to Payment
        </Button>
      </div>
    </div>
  );
}
