"use client";

import { useState, useCallback } from "react";
import { useCart } from "@/lib/CartContext";
import { formatPrice } from "@/lib/format";
import Button from "@/components/ui/Button";
import type { ProductCardProps } from "@/types";

interface AddToCartButtonProps {
  product: ProductCardProps;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addToCart, openCart } = useCart();
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleClick = useCallback(() => {
    setStatus("loading");

    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.images?.[0] || "",
      quantity: 1,
      stockQuantity: product.stockQuantity,
    });

    setTimeout(() => {
      setStatus("success");
      openCart();
      setTimeout(() => setStatus("idle"), 1200);
    }, 400);
  }, [product, addToCart, openCart]);

  return (
    <Button variant="primary" className="w-full" onClick={handleClick} status={status}>
      {status === "loading" ? "Adding..." : status === "success" ? "Added!" : `Add to Cart — ${formatPrice(product.price)}`}
    </Button>
  );
}
