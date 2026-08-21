"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import ProductCard from "@/components/ui/ProductCard";
import GridSidebar from "@/components/home/GridSidebar";
import { useReducedMotion } from "@/lib/motion";
import type { HomepageProduct } from "@/lib/homepageProducts";

type Tab = "all" | "new" | "preloved";

const tabs: { value: Tab; label: string }[] = [
  { value: "all", label: "All" },
  { value: "new", label: "Brand New" },
  { value: "preloved", label: "Preloved" },
];

export default function HomepageProductGrid({
  products,
}: {
  products: HomepageProduct[];
}) {
  const [active, setActive] = useState<Tab>("all");
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const reduced = useReducedMotion();

  const categories = [
    ...new Set(products.map((p) => p.category.name)),
  ].sort();

  const filtered = products.filter((p) => {
    const condMatch = active === "all" || p.condition === active;
    const catMatch =
      selectedCats.length === 0 || selectedCats.includes(p.category.name);
    return condMatch && catMatch;
  });

  return (
    <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-14 md:py-24">
      <div className="text-center mb-8 md:mb-12">
        <span className="text-[11px] tracking-[0.3em] uppercase text-yellow-500 font-medium">
          Shop by condition
        </span>
        <h2 className="text-2xl md:text-3xl font-light tracking-tight text-zinc-900 mt-3">
          Browse Our Collection
        </h2>
      </div>

      <div className="flex items-center justify-center gap-2 mb-8 md:mb-12">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActive(tab.value)}
            className={
              "px-5 py-2 text-[13px] font-medium tracking-wider uppercase transition-colors duration-200 border " +
              (active === tab.value
                ? "bg-zinc-900 text-white border-zinc-900"
                : "bg-white text-zinc-600 border-zinc-300 hover:border-zinc-500")
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex gap-8 mt-4 md:mt-0">
        <GridSidebar
          categories={categories}
          selected={selectedCats}
          onChange={setSelectedCats}
          className="hidden md:block w-[220px] shrink-0"
        />
        <div className="flex-1 min-w-0">
          {filtered.length === 0 ? (
            <p className="text-center text-[13px] text-zinc-500 py-16">
              No products match these filters.
            </p>
          ) : (
            <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-4 lg:gap-x-6 gap-y-10">
              <AnimatePresence mode="popLayout">
                {filtered.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={reduced ? false : { opacity: 0, y: 12 }}
                    animate={reduced ? {} : { opacity: 1, y: 0 }}
                    exit={reduced ? {} : { opacity: 0, y: -12 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ProductCard
                      id={product.id}
                      slug={product.slug}
                      name={product.name}
                      price={product.price}
                      images={product.images}
                      condition={product.condition as "new" | "preloved"}
                      conditionGrade={product.conditionGrade}
                      brand={product.brand}
                      stockQuantity={product.stockQuantity}
                      categorySlug={product.category.slug}
                      categoryName={product.category.name}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      <div className="mt-8 md:mt-12 text-center">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-zinc-500 hover:text-yellow-500 transition-colors"
        >
          View All
          <span className="text-sm">&#8594;</span>
        </Link>
      </div>
    </section>
  );
}
