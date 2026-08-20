"use client";

import { motion } from "framer-motion";

interface ConditionFilterBarProps {
  condition: "new" | "preloved";
  onChange: (value: "new" | "preloved") => void;
}

const options = [
  { value: "new" as const, label: "BRAND NEW" },
  { value: "preloved" as const, label: "PRELOVED" },
];

export default function ConditionFilterBar({
  condition,
  onChange,
}: ConditionFilterBarProps) {
  return (
    <section className="py-10 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <p className="text-[11px] tracking-[0.1em] uppercase text-zinc-500 mb-5">
          Shop by condition
        </p>
        <div className="inline-flex border border-zinc-900 rounded-none">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className={`relative px-8 py-3 text-[13px] font-medium tracking-wider uppercase transition-colors duration-200 ${
                condition === opt.value
                  ? ""
                  : "hover:bg-yellow-50"
              }`}
            >
              {condition === opt.value && (
                <motion.div
                  layoutId="conditionPill"
                  className="absolute inset-0 bg-yellow-400"
                  transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                />
              )}
              <span
                className={`relative z-10 ${
                  condition === opt.value ? "text-black" : "text-zinc-900"
                }`}
              >
                {opt.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
