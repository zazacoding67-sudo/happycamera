"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/CartContext";
import { useCheckout } from "@/lib/CheckoutContext";
import { standardTransition, useReducedMotion } from "@/lib/motion";
import {
  DELIVERY_CHARGES,
  STORE_ADDRESS,
  STORE_PHONE,
  STORE_HOURS,
  type DeliveryMethod,
  type DeliveryRegion,
} from "@/lib/delivery";
import { formatPrice } from "@/lib/format";
import StepIndicator from "@/components/checkout/StepIndicator";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const inputBase =
  "w-full border border-[var(--color-border)] px-3 py-2.5 text-sm outline-none focus:border-[var(--color-text-primary)] transition-colors bg-[var(--color-surface)] rounded-none";
const labelBase =
  "block text-[11px] font-semibold uppercase tracking-widest text-[var(--color-text-secondary)] mb-1.5";

export default function CheckoutDeliveryPage() {
  const router = useRouter();
  const { items, hydrated: cartHydrated } = useCart();
  const { info, setInfo } = useCheckout();
  const reduced = useReducedMotion();

  const [errors, setErrors] = useState<Record<string, string>>({});

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  useEffect(() => {
    if (!cartHydrated) return;
    if (items.length === 0) {
      router.replace("/checkout");
    }
  }, [items.length, cartHydrated, router]);

  if (!cartHydrated || items.length === 0) {
    return null;
  }

  const setMethod = (method: DeliveryMethod) => {
    setInfo({ deliveryMethod: method });
  };

  const setRegion = (region: DeliveryRegion) => {
    setInfo({ deliveryRegion: region });
  };

  const handleContinue = () => {
    const next: Record<string, string> = {};

    if (!info.customerName.trim()) next.customerName = "Please enter your full name.";
    if (!info.customerEmail.trim()) {
      next.customerEmail = "Please enter your email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(info.customerEmail)) {
      next.customerEmail = "Please enter a valid email address.";
    }
    if (!info.customerPhone.trim()) next.customerPhone = "Please enter your phone number.";
    if (info.deliveryMethod === "standard" && !info.shippingAddress.trim()) {
      next.shippingAddress = "Please enter a shipping address.";
    }

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    router.push("/checkout/payment");
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <StepIndicator currentStep={2} />

      <h1 className="mt-10 text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
        Delivery
      </h1>
      <p className="text-sm text-[var(--color-text-secondary)] mt-1 mb-8">
        Enter your contact details and choose how you&rsquo;d like to receive your order.
      </p>

      <div className="space-y-8">
        {/* Contact */}
        <section>
          <h2 className={labelBase + " !text-[var(--color-text-primary)] !text-sm !font-bold !uppercase !tracking-tight mb-4"}>
            Contact Details
          </h2>
          <div className="space-y-4">
            <div>
              <label className={labelBase} htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                placeholder="Your full name"
                value={info.customerName}
                onChange={(e) => setInfo({ customerName: e.target.value })}
                className={inputBase}
              />
              {errors.customerName && (
                <p className="text-xs text-red-500 mt-1.5">{errors.customerName}</p>
              )}
            </div>
            <div>
              <label className={labelBase} htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={info.customerEmail}
                onChange={(e) => setInfo({ customerEmail: e.target.value })}
                className={inputBase}
              />
              {errors.customerEmail && (
                <p className="text-xs text-red-500 mt-1.5">{errors.customerEmail}</p>
              )}
            </div>
            <div>
              <label className={labelBase} htmlFor="phone">Phone</label>
              <input
                id="phone"
                type="tel"
                placeholder="012-345 6789"
                value={info.customerPhone}
                onChange={(e) => setInfo({ customerPhone: e.target.value })}
                className={inputBase}
              />
              {errors.customerPhone && (
                <p className="text-xs text-red-500 mt-1.5">{errors.customerPhone}</p>
              )}
            </div>
          </div>
        </section>

        {/* Delivery method */}
        <section>
          <h2 className={labelBase + " !text-[var(--color-text-primary)] !text-sm !font-bold !uppercase !tracking-tight mb-4"}>
            Delivery Method
          </h2>

          <div className="space-y-3">
            {/* Standard shipping */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => setMethod("standard")}
              onKeyDown={(e) => {
                if (e.target !== e.currentTarget) return;
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setMethod("standard");
                }
              }}
              className={cn(
                "w-full text-left cursor-pointer border p-4 rounded-none transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-text-primary)]",
                info.deliveryMethod === "standard"
                  ? "border-[var(--color-text-primary)] bg-[var(--color-surface)]"
                  : "border-[var(--color-border)] hover:border-[var(--color-text-primary)]"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                  Standard Shipping
                </span>
                <span className="text-sm font-medium text-[var(--color-text-primary)]">
                  from {formatPrice(Math.min(...Object.values(DELIVERY_CHARGES)))}
                </span>
              </div>
              <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                Estimated delivery to your address nationwide.
              </p>

              {info.deliveryMethod === "standard" && (
                <div className="mt-4 space-y-4">
                  <div>
                    <label className={labelBase}>Region</label>
                    <div className="flex border border-[var(--color-border)]">
                      <button
                        type="button"
                        onClick={() => setRegion("west_malaysia")}
                        className={cn(
                          "relative flex-1 py-2.5 text-[13px] font-medium transition-colors",
                          info.deliveryRegion === "west_malaysia"
                            ? "text-white"
                            : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                        )}
                      >
                        {info.deliveryRegion === "west_malaysia" &&
                          (reduced ? (
                            <div className="absolute inset-0 bg-[var(--color-text-primary)]" />
                          ) : (
                            <motion.div
                              layoutId="regionPill"
                              className="absolute inset-0 bg-[var(--color-text-primary)]"
                              transition={standardTransition}
                            />
                          ))}
                        <div className="relative z-10">
                          <span className="block sm:inline">West Malaysia</span>{" "}
                          <span className="block sm:inline text-[11px] sm:text-[13px] opacity-75 mt-0.5 sm:mt-0 sm:ml-1">
                            ({formatPrice(DELIVERY_CHARGES.west_malaysia)})
                          </span>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setRegion("sabah_sarawak")}
                        className={cn(
                          "relative flex-1 py-2.5 text-[13px] font-medium transition-colors",
                          info.deliveryRegion === "sabah_sarawak"
                            ? "text-white"
                            : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                        )}
                      >
                        {info.deliveryRegion === "sabah_sarawak" &&
                          (reduced ? (
                            <div className="absolute inset-0 bg-[var(--color-text-primary)]" />
                          ) : (
                            <motion.div
                              layoutId="regionPill"
                              className="absolute inset-0 bg-[var(--color-text-primary)]"
                              transition={standardTransition}
                            />
                          ))}
                        <div className="relative z-10">
                          <span className="block sm:inline">Sabah &amp; Sarawak</span>{" "}
                          <span className="block sm:inline text-[11px] sm:text-[13px] opacity-75 mt-0.5 sm:mt-0 sm:ml-1">
                            ({formatPrice(DELIVERY_CHARGES.sabah_sarawak)})
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className={labelBase} htmlFor="address">Shipping Address</label>
                    <textarea
                      id="address"
                      rows={3}
                      placeholder="Full shipping address"
                      value={info.shippingAddress}
                      onChange={(e) => setInfo({ shippingAddress: e.target.value })}
                      className={inputBase + " resize-none"}
                    />
                    {errors.shippingAddress && (
                      <p className="text-xs text-red-500 mt-1.5">{errors.shippingAddress}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Self collect */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => setMethod("self_collect")}
              onKeyDown={(e) => {
                if (e.target !== e.currentTarget) return;
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setMethod("self_collect");
                }
              }}
              className={cn(
                "w-full text-left cursor-pointer border p-4 rounded-none transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-text-primary)]",
                info.deliveryMethod === "self_collect"
                  ? "border-[var(--color-text-primary)] bg-[var(--color-surface)]"
                  : "border-[var(--color-border)] hover:border-[var(--color-text-primary)]"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                  Self Collect at Store
                </span>
                <span className="text-sm font-medium text-[var(--color-text-primary)]">
                  Free
                </span>
              </div>
              <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                Pick up your order at our Kuala Lumpur store.
              </p>

              {info.deliveryMethod === "self_collect" && (
                <div className="mt-4 space-y-1 border-t border-[var(--color-border)] pt-4 text-xs text-[var(--color-text-secondary)]">
                  <p>{STORE_ADDRESS}</p>
                  <p>Phone: {STORE_PHONE}</p>
                  <p>{STORE_HOURS}</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Summary footer */}
        <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-6">
          <span className="text-sm font-medium text-[var(--color-text-primary)]">
            Subtotal
          </span>
          <span className="text-lg font-bold text-[var(--color-text-primary)]">
            {formatPrice(subtotal)}
          </span>
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
          <button
            onClick={() => router.push("/checkout")}
            className="text-sm font-medium text-center sm:text-left text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] underline underline-offset-4 transition-colors"
          >
            Back to Basket
          </button>
          <Button variant="primary" className="px-8 w-full sm:w-auto" onClick={handleContinue}>
            Continue to Payment
          </Button>
        </div>
      </div>
    </div>
  );
}
