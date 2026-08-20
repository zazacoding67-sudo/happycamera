"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { ShieldCheck, Truck, Undo2 } from "lucide-react";

const signals = [
  {
    icon: ShieldCheck,
    title: "Certified Pre-Owned",
    description: "Every preloved item is inspected, graded, and backed by our warranty.",
  },
  {
    icon: Truck,
    title: "Express Shipping",
    description: "Same-day dispatch on orders placed before 2PM. Tracked nationwide.",
  },
  {
    icon: Undo2,
    title: "14-Day Returns",
    description: "Not the right fit? Return it within 14 days — no questions asked.",
  },
];

const stagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const cardReveal: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export default function TrustSignals() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px", amount: 0.1 });

  return (
    <section ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-32">
      <div className="text-center mb-6 md:mb-12">
        <span className="text-[13px] tracking-[0.3em] uppercase text-yellow-500 font-medium">
          Why Shop With Us
        </span>
        <div className="w-8 h-0.5 bg-yellow-400 mx-auto mt-3" />
      </div>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12"
        variants={stagger}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        {signals.map((item) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              variants={cardReveal}
              className="text-center md:text-left"
            >
              <Icon size={24} className="text-yellow-500 mb-4 mx-auto md:mx-0" />
              <h3 className="text-[16px] font-semibold text-zinc-900 uppercase tracking-[0.1em] mb-2">
                {item.title}
              </h3>
              <p className="text-[16px] text-zinc-500 leading-relaxed max-w-xs mx-auto md:mx-0">
                {item.description}
              </p>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
