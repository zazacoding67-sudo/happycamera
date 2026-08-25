"use client";

import { useState } from "react";
import { X, Trash2, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/CartContext";
import { formatPrice } from "@/lib/format";
import Button from "@/components/ui/Button";
import { materialEase } from "@/lib/motion";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeFromCart } = useCart();
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = async () => {
    if (!customerName || !customerEmail || !customerPhone) return;

    setIsLoading(true);
    setCheckoutError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          customerName,
          customerEmail,
          customerPhone,
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
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: materialEase }}
            className="fixed inset-0 z-50 bg-black/50"
            onClick={closeCart}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[var(--color-surface)] shadow-2xl z-50 md:flex md:flex-col md:overflow-hidden overflow-y-auto"
          >
            <div className="flex items-center justify-between px-6 h-16 border-b border-[var(--color-border)]">
              <h2 className="text-lg font-bold tracking-tight text-[var(--color-text-primary)]">
                Your Cart
              </h2>
              <button
                onClick={closeCart}
                className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                aria-label="Close cart"
              >
                <X size={20} />
              </button>
            </div>

            <div className="px-6 py-4 md:flex-1 md:overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center mt-20 text-center">
                  <ShoppingBag
                    size={40}
                    className="text-[var(--color-text-secondary)] mb-4"
                  />
                  <p className="text-sm font-medium text-[var(--color-text-primary)]">
                    Your cart is empty
                  </p>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                    Looks like you haven&rsquo;t added anything yet.
                  </p>
                  <button
                    onClick={closeCart}
                    className="mt-6 text-sm font-medium text-[var(--color-text-primary)] underline underline-offset-4 hover:no-underline transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <ul className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {items.map((item) => (
                      <motion.li
                        key={item.productId}
                        layout
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 40, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.2, ease: materialEase }}
                        className="flex items-center gap-4 py-3 border-b border-[var(--color-border)] last:border-0 overflow-hidden"
                      >
                        <div className="w-16 h-16 bg-gray-100 shrink-0 overflow-hidden">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                            {item.name}
                          </p>
                          <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                            {formatPrice(item.price)} × {item.quantity}
                          </p>
                          <p className="text-sm font-semibold text-[var(--color-text-primary)] mt-0.5">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="p-1.5 text-[var(--color-text-secondary)] hover:text-red-500 transition-colors shrink-0"
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-[var(--color-border)] flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                  className="w-full border border-[var(--color-border)] px-3 py-2 text-sm outline-none focus:border-[var(--color-text-primary)] transition-colors"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  required
                  className="w-full border border-[var(--color-border)] px-3 py-2 text-sm outline-none focus:border-[var(--color-text-primary)] transition-colors"
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  required
                  className="w-full border border-[var(--color-border)] px-3 py-2 text-sm outline-none focus:border-[var(--color-text-primary)] transition-colors"
                />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-medium text-[var(--color-text-primary)]">
                    Subtotal
                  </span>
                  <span className="text-lg font-bold text-[var(--color-text-primary)]">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <div className="flex items-center gap-2 pt-1">
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
                {checkoutError && (
                  <p className="text-xs text-red-500 text-center">{checkoutError}</p>
                )}
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={handleCheckout}
                  disabled={isLoading || !customerName || !customerEmail || !customerPhone}
                  status={isLoading ? "loading" : "idle"}
                >
                  Checkout
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
