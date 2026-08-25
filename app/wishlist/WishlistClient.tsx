"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";
import { useWishlist } from "@/lib/WishlistContext";
import ProductCard from "@/components/ui/ProductCard";
import type { ProductCardProps } from "@/types";

interface Props {
  allProducts: ProductCardProps[];
}

export default function WishlistClient({ allProducts }: Props) {
  const { items } = useWishlist();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const wishlisted = allProducts.filter((p) =>
    items.some((i) => i.productId === p.id)
  );

  if (wishlisted.length === 0) {
    return (
      <div className="text-center py-24 border border-zinc-100">
        <Heart
          size={40}
          className="mx-auto text-zinc-300 mb-4"
        />
        <p className="text-base font-medium text-zinc-900">
          Nothing saved yet
        </p>
        <p className="text-sm text-zinc-400 mt-1 max-w-xs mx-auto leading-relaxed">
          Start building your personal collection — tap the heart on anything that catches your eye.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 mt-8 bg-zinc-900 text-white text-sm font-medium px-6 py-3 rounded-none hover:opacity-90 transition-opacity"
        >
          Browse the Shop
          <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {wishlisted.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  );
}
