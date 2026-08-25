"use client";

import Link from "next/link";
import { formatPrice } from "@/lib/format";

interface CarouselProduct {
  id: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  condition: string;
  images: string[];
  category: { slug: string; name: string } | null;
}

interface Props {
  products: CarouselProduct[];
}

const typeLabelMap: Record<string, string> = {
  "digital-bodies": "DIGITAL BODIES",
  "mirrorless": "MIRRORLESS",
  "camera": "CAMERA",
  "lenses": "LENS",
  "bag": "BAG",
  "dry-box": "DRY BOX",
  "accessories": "ACCESSORY",
};

export default function ProductHoverCarousel({ products }: Props) {
  return (
    <div className="w-full mb-20">
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center w-full">
          <p className="text-[10px] tracking-[0.25em] uppercase text-[#999] mb-3">No results</p>
          <p className="text-[15px] font-medium text-[#1A1A1A] mb-1">
            No products to show.
          </p>
          <p className="text-[12px] text-[#999]">Check back soon for new arrivals.</p>
        </div>
      ) : (
        <div className="overflow-hidden px-8 md:px-12">
          <div className="flex flex-row w-max gap-6" style={{ animation: `marquee ${products.length * 10}s linear infinite` }}>
            {[...products, ...products].map((product, index) => {
              const imageUrl = product.images?.[0] || "";
              const hoverImage = product.images?.[1] || null;
              const typeLabel = product.category?.slug
                ? typeLabelMap[product.category.slug]
                : null;

              return (
                <Link
                  key={`${product.id}-${index}`}
                  href={`/product/${product.slug}`}
                  className="group relative flex-shrink-0 w-[90vw] md:w-[600px]"
                >
                  <div className="relative aspect-[4/3] w-full bg-white rounded-2xl border border-gray-200 overflow-hidden flex items-center justify-center">
                    {imageUrl ? (
                      <>
                        <img
                          src={imageUrl}
                          alt={product.name}
                          className="absolute inset-0 w-full h-full object-contain p-8 transition-opacity duration-500"
                          loading="lazy"
                        />
                        {hoverImage && (
                          <img
                            src={hoverImage}
                            alt={`${product.name} alternate view`}
                            className="absolute inset-0 w-full h-full object-contain p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                            loading="lazy"
                          />
                        )}
                      </>
                    ) : (
                      <span className="text-xs text-gray-400">No image</span>
                    )}

                    <div className="absolute top-3 left-3 flex flex-row gap-2 z-10">
                      <span className="bg-white border border-gray-300 text-gray-700 text-[10px] font-medium uppercase tracking-widest px-3 py-1.5 rounded-full">
                        {product.condition === "new" ? "NEW" : "PRELOVED"}
                      </span>
                      {typeLabel && (
                        <span className="bg-white border border-gray-300 text-gray-700 text-[10px] font-medium uppercase tracking-widest px-3 py-1.5 rounded-full">
                          {typeLabel}
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-white/95 via-white/80 to-transparent pt-12 pb-5 px-5 transition-all duration-300 ease-out opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0">
                      <p className="text-[13px] text-gray-500 font-medium truncate">
                        {product.name}
                      </p>
                      <p className="text-base font-semibold text-black">
                        {formatPrice(product.price)}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
