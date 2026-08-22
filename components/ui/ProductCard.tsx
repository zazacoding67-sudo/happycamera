"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/format";
import { useWishlist } from "@/lib/WishlistContext";
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
  originalPrice,
  condition,
  conditionGrade,
  images,
  stockQuantity,
  brand,
  averageRating,
}: ProductCardProps) {
  const imageUrl = images?.[0] || "";
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(id);
  const soldOut = stockQuantity !== undefined && stockQuantity <= 0;
  const isOnSale = originalPrice != null && originalPrice > price;

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
    <div className="flex flex-col group">
      {/* Image box */}
      <div className={cn("relative aspect-square w-full bg-white border border-gray-200 overflow-hidden p-2 flex items-center justify-center", soldOut && "opacity-60 grayscale")}>
        <Link href={`/product/${slug}`} className="block w-full h-full">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="max-w-full max-h-full object-contain transition-transform duration-300 ease-out group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <span className="text-xs text-gray-400">No image</span>
          )}
        </Link>

        {/* Badge */}
        <div className={cn("absolute top-3 left-3 z-10", badgeBg, "text-white text-[10px] font-bold px-2.5 py-1 rounded-[2px] uppercase")}>
          {badgeLabel}
        </div>

        {/* Wishlist heart */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(id, { name, price, imageUrl });
          }}
          className="absolute top-3 right-3 p-1.5 bg-white/80 hover:bg-white rounded-none shadow-sm transition-colors z-10"
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            size={16}
            className={cn(
              "transition-colors",
              wishlisted ? "fill-red-500 stroke-red-500" : "stroke-gray-400"
            )}
          />
        </button>
      </div>

      {/* Info — no border, no background */}
      <Link href={`/product/${slug}`} className="block mt-2.5">
        <p className="text-[13px] font-medium text-gray-400 uppercase tracking-[0.1em] leading-none mb-2">
          {brand}
        </p>
        <p className="text-[18px] font-semibold text-neutral-800 truncate leading-[1.3] mb-2 transition-colors duration-200 group-hover:text-black">
          {name}
        </p>

        {averageRating !== null && averageRating !== undefined && (
          <div className="mb-1.5">
            <StarRating rating={averageRating} />
          </div>
        )}

        <div className="flex items-baseline gap-2">
          <span
            className={cn(
              "text-[21px] font-bold leading-none font-heading",
              isOnSale ? "text-red-600" : "text-[#B8860B]"
            )}
          >
            {formatPrice(price)}
          </span>
          {isOnSale && (
            <span className="text-[14px] font-medium text-gray-400 line-through">
              {formatPrice(originalPrice!)}
            </span>
          )}
        </div>
      </Link>
    </div>
  );
}
