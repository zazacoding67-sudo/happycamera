"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/format";
import { useWishlist } from "@/lib/WishlistContext";
import { Heart } from "lucide-react";
import type { ProductCardProps } from "@/types";

export default function ProductCard({
  id,
  slug,
  name,
  brand,
  price,
  condition,
  images,
  stockQuantity,
  categorySlug,
}: ProductCardProps) {
  const imageUrl = images?.[0] || "";
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(id);
  const soldOut = stockQuantity !== undefined && stockQuantity <= 0;

  return (
    <div className="group relative bg-white cursor-pointer">
      <Link href={`/product/${slug}`} className="block">
        <div className={cn(
          "relative aspect-[4/3] w-full bg-zinc-50 overflow-hidden p-8 flex items-center justify-center",
          soldOut && "opacity-60 grayscale"
        )}>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="max-w-full max-h-full object-contain transition-transform duration-700 ease-out group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <span className="text-xs text-gray-400">No image</span>
          )}
        </div>
      </Link>
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleWishlist(id, { name, price, imageUrl });
        }}
        className="absolute top-3 right-3 p-1.5 bg-white/80 hover:bg-white rounded-full transition-colors z-10"
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart
          size={16}
          className={cn(
            "transition-colors",
            wishlisted ? "fill-red-500 stroke-red-500" : "stroke-zinc-500"
          )}
        />
      </button>
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {soldOut && (
          <span className="bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-[0.15em] px-2.5 py-1.5">
            SOLD OUT
          </span>
        )}
        <span className="bg-yellow-400 text-black text-[10px] font-bold uppercase tracking-[0.15em] px-2.5 py-1.5">
          {condition === "new" ? "NEW" : "PRELOVED"}
        </span>
      </div>
      <Link href={`/product/${slug}`} className="block">
        <p className="text-sm text-zinc-500 font-medium mt-4 mb-0.5 truncate">
          {name}
        </p>
        <p className="text-base font-bold text-zinc-900">
          {formatPrice(price)}
        </p>
      </Link>
    </div>
  );
}
