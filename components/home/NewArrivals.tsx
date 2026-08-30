"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";
import { useReducedMotion, materialEase } from "@/lib/motion";
import type { NewArrival } from "@/lib/newArrivals";

const CARD_W = 300;
const GAP = 20;
const CARD_TOTAL = CARD_W + GAP;

const staggerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: materialEase },
  },
};

export default function NewArrivals({ products }: { products: NewArrival[] }) {
  const reduced = useReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setIsAtStart(el.scrollLeft <= 0);
    setIsAtEnd(el.scrollLeft >= maxScroll - 1);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollState, { passive: true });
    updateScrollState();
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({
      left: direction === "left" ? -CARD_TOTAL : CARD_TOTAL,
      behavior: "smooth",
    });
  };

  if (products.length === 0) return null;

  return (
    <section className="w-full bg-white">
      <div className="max-w-[1728px] mx-auto px-4 sm:px-6 md:px-16 py-16 md:py-32">
        <motion.div
          variants={reduced ? undefined : staggerVariants}
          initial={reduced ? false : "hidden"}
          whileInView={reduced ? undefined : "visible"}
          viewport={{ once: true, amount: 0.05 }}
        >
          <motion.div
            variants={reduced ? undefined : cardVariants}
            className="mb-8 md:mb-14"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="w-8 h-[3px] bg-yellow-400" />
              <span className="text-xs font-semibold tracking-[0.2em] text-neutral-500 uppercase">
                Just Landed
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-light tracking-tight text-neutral-900 font-heading">
              New Arrivals
            </h2>
          </motion.div>

          <div className="relative group/na">
          <button
            type="button"
            onClick={() => scroll("left")}
            disabled={isAtStart}
            aria-label="Scroll left"
            className={`hidden md:flex absolute top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full border border-neutral-200 bg-white text-neutral-800 items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-all duration-200 hover:bg-black hover:border-black hover:text-white hover:scale-105 left-[-56px] ${
              isAtStart
                ? "opacity-40 pointer-events-none"
                : "opacity-60 group-hover/na:opacity-100"
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-[20px] overflow-x-auto scroll-smooth pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {products.map((product) => (
              <motion.div
                key={product.id}
                variants={reduced ? undefined : cardVariants}
                className="flex-shrink-0 w-[calc(50%-10px)] min-w-[240px] sm:w-[300px]"
              >
                <ProductCard
                  id={product.id}
                  slug={product.slug}
                  name={product.name}
                  price={product.price}
                  originalPrice={product.originalPrice}
                  images={product.images}
                  condition={product.condition as "new" | "preloved"}
                  conditionGrade={product.conditionGrade}
                  brand={product.brand}
                  stockQuantity={product.stockQuantity}
                  categorySlug={product.category.slug}
                  categoryName={product.category.name}
                  averageRating={product.averageRating}
                  reviews={product.reviews}
                  createdAt={product.createdAt}
                />
              </motion.div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => scroll("right")}
            disabled={isAtEnd}
            aria-label="Scroll right"
            className={`hidden md:flex absolute top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full border border-neutral-200 bg-white text-neutral-800 items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-all duration-200 hover:bg-black hover:border-black hover:text-white hover:scale-105 right-[-56px] ${
              isAtEnd
                ? "opacity-40 pointer-events-none"
                : "opacity-60 group-hover/na:opacity-100"
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        </motion.div>
      </div>
    </section>
  );
}
