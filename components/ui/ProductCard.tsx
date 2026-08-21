"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/format";
import { useWishlist } from "@/lib/WishlistContext";
import { useReducedMotion } from "@/lib/motion";
import { Heart } from "lucide-react";
import type { ProductCardProps } from "@/types";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={cn("w-3.5 h-3.5", i <= Math.round(rating) ? "text-yellow-400" : "text-gray-300")}
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function ProductCard({
  id,
  slug,
  name,
  price,
  condition,
  conditionGrade,
  images,
  stockQuantity,
  brand,
  averageRating,
  isOnSale,
  compareAtPrice,
}: ProductCardProps) {
  const imageUrl = images?.[0] || "";
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(id);
  const soldOut = stockQuantity !== undefined && stockQuantity <= 0;

  const badgeLabel = isOnSale
    ? "ON SALE"
    : soldOut
      ? "SOLD OUT"
      : condition === "new"
        ? "BRAND NEW"
        : `PRELOVED${conditionGrade ? ` \u00B7 ${conditionGrade}` : ""}`;

  const badgeBg = isOnSale
    ? "bg-red-600"
    : soldOut
      ? "bg-zinc-900"
      : condition === "new"
        ? "bg-black"
        : "bg-zinc-700";

  return (
    <div className="group relative bg-white rounded-xl border border-gray-100 p-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col">
      <Link href={`/product/${slug}`} className="block">
        {/* Image */}
        <div className={cn("relative aspect-square w-full bg-gray-50 overflow-hidden rounded-lg flex items-center justify-center", soldOut && "opacity-60 grayscale")}>
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

      {/* Wishlist heart */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleWishlist(id, { name, price, imageUrl });
        }}
        className="absolute top-6 right-6 p-1.5 bg-white/80 hover:bg-white rounded-full shadow-sm transition-colors z-10"
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart
          size={14}
          className={cn(
            "transition-colors",
            wishlisted ? "fill-red-500 stroke-red-500" : "stroke-gray-400"
          )}
        />
      </button>

      {/* Badge */}
      <div className={cn("absolute top-6 left-6 z-10", badgeBg, "text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase")}>
        {badgeLabel}
      </div>

      {/* Info */}
      <Link href={`/product/${slug}`} className="block mt-3 flex-1">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">
          {brand}
        </p>
        <p className="text-base font-bold text-gray-900 truncate mb-1.5">
          {name}
        </p>

        {/* Stars */}
        {averageRating !== null && averageRating !== undefined && (
          <div className="mb-2">
            <StarRating rating={averageRating} />
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2">
          {compareAtPrice != null && compareAtPrice > price && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(compareAtPrice)}
            </span>
          )}
          <span
            className={cn(
              "text-xl font-extrabold",
              compareAtPrice != null && compareAtPrice > price
                ? "text-red-600"
                : "text-gray-900"
            )}
          >
            {formatPrice(price)}
          </span>
        </div>
      </Link>
    </div>
  );
}
