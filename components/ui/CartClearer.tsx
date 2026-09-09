"use client";

import { useEffect } from "react";
import { useCart, CART_STORAGE_KEY } from "@/lib/CartContext";

export default function CartClearer() {
  const { clearCart } = useCart();

  useEffect(() => {
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
      clearCart();
    } catch {
      // CartContext or localStorage unavailable — silent no-op
    }
  }, [clearCart]);

  return null;
}
