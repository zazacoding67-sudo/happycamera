"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/CartContext";

const STORAGE_KEY = "happycamera_cart";

export default function CartClearer() {
  const { clearCart } = useCart();

  useEffect(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      clearCart();
    } catch {
      // CartContext or localStorage unavailable — silent no-op
    }
  }, [clearCart]);

  return null;
}
