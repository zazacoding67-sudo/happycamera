"use client";

import { useCart } from "@/lib/CartContext";
import { formatPrice } from "@/lib/format";
import type { ProductCardProps } from "@/types";

interface StickyAddToCartProps {
  product: ProductCardProps;
}

export default function StickyAddToCart({ product }: StickyAddToCartProps) {
  const { addToCart, openCart } = useCart();

  const handleClick = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.images?.[0] || "",
      quantity: 1,
    });
    openCart();
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--color-border)] bg-white/95 backdrop-blur-sm md:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-[var(--color-text-primary)]">
            {formatPrice(product.price)}
          </p>
        </div>
        <button
          onClick={handleClick}
          className="bg-[var(--color-accent)] text-white text-sm font-medium px-6 py-2.5 tracking-wide hover:opacity-90 transition-opacity"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
