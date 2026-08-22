"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";
import { staggerContainer, fadeUp } from "@/lib/motion";
import type { ProductCardProps } from "@/types";

interface Props {
  products: ProductCardProps[];
}

export default function FeaturedProducts({ products }: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px", amount: 0.1 });

  return (
    <section ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-text-primary)] font-heading">
          Featured Products
        </h2>
        <Link
          href="/shop"
          className="hidden sm:flex items-center gap-1 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
        >
          Shop All <ArrowRight size={16} />
        </Link>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {products.map((product) => (
          <motion.div key={product.id} variants={fadeUp}>
            <ProductCard {...product} />
          </motion.div>
        ))}
      </motion.div>

      <div className="flex gap-6 overflow-x-auto pb-4 -mx-4 px-4 sm:hidden snap-x snap-mandatory scrollbar-hide">
        {products.map((product) => (
          <div key={product.id} className="min-w-[220px] snap-start">
            <ProductCard {...product} />
          </div>
        ))}
      </div>

      <Link
        href="/shop"
        className="mt-6 flex sm:hidden items-center gap-1 text-sm font-medium text-[var(--color-text-secondary)]"
      >
        View All <ArrowRight size={16} />
      </Link>
    </section>
  );
}
