"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/motion";
import { Package, Truck, ShieldCheck } from "lucide-react";

interface ShopHeroProps {
  productCount: number;
}

const stats = (count: number) => [
  { icon: Package, label: `${count} Product${count === 1 ? "" : "s"}`, sub: "In Stock" },
  { icon: Truck, label: "Free Shipping", sub: "Orders Over RM500" },
  { icon: ShieldCheck, label: "6-Month", sub: "Warranty" },
];

export default function ShopHero({ productCount }: ShopHeroProps) {
  const prefersReduced = useReducedMotion();
  const items = stats(productCount);

  return (
    <div className="relative w-full bg-zinc-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-16 py-16 md:py-24">
        <motion.p
          initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.4 }}
          className="text-[11px] tracking-[0.25em] uppercase text-zinc-500 font-medium mb-4"
        >
          Browse Everything
        </motion.p>

        <motion.h1
          initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-[0.95] font-heading"
        >
          All Gear
        </motion.h1>

        <motion.p
          initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-base md:text-lg text-zinc-400 max-w-xl mt-5 leading-relaxed"
        >
          Explore our curated selection of new and pre-loved camera equipment, from classic film bodies to modern digital systems.
        </motion.p>

        <motion.div
          initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mt-10 pt-8 border-t border-zinc-800 grid grid-cols-3 gap-6 max-w-lg"
        >
          {items.map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex items-start gap-3">
              <Icon size={18} className="text-zinc-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-white leading-tight">{label}</p>
                <p className="text-[11px] text-zinc-500 mt-0.5">{sub}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
