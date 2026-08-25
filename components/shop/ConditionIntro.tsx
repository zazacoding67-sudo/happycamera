"use client";

import { motion } from "framer-motion";
import { PackageCheck, Store, ShieldCheck } from "lucide-react";
import { materialEase, useReducedMotion } from "@/lib/motion";

interface Props {
  variant: "new" | "preloved";
}

const gradeColors: Record<string, string> = {
  MINT: "text-green-700 bg-green-50 border-green-200",
  EXCELLENT: "text-blue-700 bg-blue-50 border-blue-200",
  GOOD: "text-yellow-700 bg-yellow-50 border-yellow-200",
  FAIR: "text-orange-700 bg-orange-50 border-orange-200",
};

const grades = [
  { key: "MINT", label: "Mint", desc: "Like new, no signs of use" },
  { key: "EXCELLENT", label: "Excellent", desc: "Light wear, fully functional" },
  { key: "GOOD", label: "Good", desc: "Visible wear, works perfectly" },
  { key: "FAIR", label: "Fair", desc: "Heavy wear, fully operational" },
];

const fadeUpItem = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: materialEase } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

export default function ConditionIntro({ variant }: Props) {
  const prefersReduced = useReducedMotion();

  const heading = variant === "new" ? "Buy with confidence" : "Graded with care";
  const description =
    variant === "new"
      ? "Every item is factory-sealed and shipped direct from our authorised distributors."
      : "Every item inspected and graded before listing.";

  const newItems = [
    { icon: PackageCheck, title: "Sealed and unopened", desc: "Factory packaging intact — never opened or handled." },
    { icon: Store, title: "Authorized dealer", desc: "Sourced directly from official brand distributors." },
    { icon: ShieldCheck, title: "Full warranty", desc: "6-month warranty covering manufacturing defects." },
  ];

  const animProps = prefersReduced
    ? {}
    : {
        initial: "hidden" as const,
        whileInView: "visible" as const,
        viewport: { once: true, amount: 0.4 } as const,
        variants: stagger,
      };

  const childProps = prefersReduced ? {} : { variants: fadeUpItem };

  return (
    <section className="max-w-5xl mx-auto px-8 py-20 md:py-28">
      <motion.div {...animProps}>
        <motion.div {...childProps} className="mb-14">
          <h2 className="text-[28px] md:text-[36px] font-bold tracking-tight text-black">
            {heading}
          </h2>
          <p className="text-[15px] text-gray-500 mt-2 max-w-xl">{description}</p>
        </motion.div>

        {variant === "new" ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {newItems.map((item) => {
              const Icon = item.icon;
              return (
                <motion.div key={item.title} {...childProps} className="flex flex-col items-start gap-1">
                  <Icon size={24} className="text-black mb-3" strokeWidth={1.5} />
                  <h3 className="text-base font-semibold text-black">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {grades.map((g) => (
              <motion.div
                key={g.key}
                {...childProps}
                className={`flex flex-col items-start p-5 border rounded-lg ${gradeColors[g.key]}`}
              >
                <span className="text-[11px] font-bold uppercase tracking-widest">{g.label}</span>
                <p className="text-sm mt-1 opacity-80">{g.desc}</p>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
}
