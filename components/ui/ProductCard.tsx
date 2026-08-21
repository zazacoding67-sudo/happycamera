"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/format";
import { useWishlist } from "@/lib/WishlistContext";
import { useReducedMotion } from "@/lib/motion";
import { Heart } from "lucide-react";
import type { ProductCardProps } from "@/types";

export default function ProductCard({
  id,
  slug,
  name,
  price,
  condition,
  conditionGrade,
  images,
  stockQuantity,
  categoryName,
}: ProductCardProps) {
  const imageUrl = images?.[0] || "";
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(id);
  const soldOut = stockQuantity !== undefined && stockQuantity <= 0;
  const reduced = useReducedMotion();

  // TODO: slot for star ratings — aggregate from reviews when ready

  return (
    <div
      className={cn(
        "group relative bg-white cursor-pointer transition-shadow duration-300",
        !reduced && "hover:shadow-lg hover:-translate-y-0.5"
      )}
    >
      <Link href={`/product/${slug}`} className="block">
        <div
          className={cn(
            "relative aspect-square w-full bg-[#f5f5f5] overflow-hidden p-6 flex items-center justify-center",
            soldOut && "opacity-60 grayscale"
          )}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="max-w-full max-h-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <span className="text-xs text-gray-400">No image</span>
          )}
        </div>
      </Link>

      {/* Wishlist heart — top-right over image */}
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

      {/* Condition badge — top-left over image */}
      <div className="absolute top-3 left-3 z-10">
        {soldOut ? (
          <span className="bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-[0.15em] px-2.5 py-1.5">
            SOLD OUT
          </span>
        ) : (
          <span className="bg-black/90 text-white text-[10px] font-bold uppercase tracking-[0.15em] px-2.5 py-1.5">
            {condition === "new"
              ? "BRAND NEW"
              : `PRELOVED${conditionGrade ? ` \u00B7 ${conditionGrade}` : ""}`}
          </span>
        )}
      </div>

      {/* Info block */}
      <Link href={`/product/${slug}`} className="block px-1 pt-3 pb-1">
        {categoryName && (
          <p className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">
            {categoryName}
          </p>
        )}
        <p className="text-sm font-medium text-zinc-900 line-clamp-2 md:line-clamp-1 mb-1">
          {name}
        </p>
        <p className="text-sm font-bold text-zinc-900">{formatPrice(price)}</p>
      </Link>
    </div>
  );
}
