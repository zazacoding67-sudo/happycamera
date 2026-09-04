"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/CartContext";
import { formatPrice } from "@/lib/format";
import StepIndicator from "@/components/checkout/StepIndicator";
import Button from "@/components/ui/Button";

export default function CheckoutBasketPage() {
  const router = useRouter();
  const { items, updateQuantity, removeFromCart } = useCart();

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <StepIndicator currentStep={1} />
        <div className="text-center mt-16">
          <p className="text-lg font-semibold text-[var(--color-text-primary)]">
            Your cart is empty
          </p>
          <p className="text-sm text-[var(--color-text-secondary)] mt-2">
            Add a few items before checking out.
          </p>
          <Button
            variant="primary"
            className="mt-8"
            onClick={() => router.push("/shop")}
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <StepIndicator currentStep={1} />

      <h1 className="mt-10 text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
        Basket
      </h1>
      <p className="text-sm text-[var(--color-text-secondary)] mt-1">
        Review the items in your cart before proceeding.
      </p>

      <ul className="mt-8 divide-y divide-[var(--color-border)] border-t border-[var(--color-border)]">
        {items.map((item) => (
          <li key={item.productId} className="flex items-center gap-4 py-5">
            <div className="w-20 h-20 bg-gray-100 shrink-0 overflow-hidden">
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
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center border border-[var(--color-border)] shrink-0">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="h-8 w-8 flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                    aria-label={`Decrease quantity of ${item.name}`}
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-[13px] font-medium tabular-nums text-[var(--color-text-primary)]">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    disabled={
                      item.stockQuantity !== undefined &&
                      item.quantity >= item.stockQuantity
                    }
                    className="h-8 w-8 flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] disabled:text-[var(--color-text-secondary)]/40 disabled:cursor-not-allowed transition-colors"
                    aria-label={`Increase quantity of ${item.name}`}
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-[var(--color-text-secondary)]">
                  {formatPrice(item.price)}
                </span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                {formatPrice(item.price * item.quantity)}
              </p>
              <button
                onClick={() => removeFromCart(item.productId)}
                className="mt-1 text-xs text-[var(--color-text-secondary)] hover:text-red-500 underline underline-offset-2 transition-colors"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center justify-between border-t border-[var(--color-border)] pt-6">
        <span className="text-sm font-medium text-[var(--color-text-primary)]">
          Subtotal
        </span>
        <span className="text-xl font-bold text-[var(--color-text-primary)]">
          {formatPrice(subtotal)}
        </span>
      </div>

      <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 mt-8">
        <Link
          href="/shop"
          className="text-sm font-medium text-center sm:text-left text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] underline underline-offset-4 transition-colors"
        >
          Continue Shopping
        </Link>
        <Button
          variant="primary"
          className="px-8 w-full sm:w-auto"
          onClick={() => router.push("/checkout/delivery")}
        >
          Continue to Delivery
        </Button>
      </div>
    </div>
  );
}
