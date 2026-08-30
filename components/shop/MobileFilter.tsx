"use client";

import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import FilterSidebar from "@/components/shop/FilterSidebar";
import { materialEase } from "@/lib/motion";

interface Props {
  brands: string[];
  resultCount: number;
  hideCondition?: boolean;
  className?: string;
}

export default function MobileFilter({
  brands,
  resultCount,
  hideCondition,
  className = "",
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`${className} md:hidden inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-[#D8D8D8] bg-white text-[12px] font-medium uppercase tracking-[0.1em] text-neutral-800 hover:bg-neutral-50 transition-colors`}
        aria-label="Open filters"
      >
        <SlidersHorizontal size={15} strokeWidth={2} />
        Filters
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: materialEase }}
              className="fixed inset-0 z-50 bg-black/50 md:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-full max-w-xs bg-white shadow-2xl z-50 flex flex-col md:hidden"
            >
              <div className="flex items-center justify-between px-6 h-16 border-b border-[#E5E5E5]">
                <h2 className="text-lg font-bold tracking-tight text-[#1A1A1A]">
                  Filters
                </h2>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 text-[#666] hover:text-[#1A1A1A] transition-colors"
                  aria-label="Close filters"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-5">
                <FilterSidebar brands={brands} hideCondition={hideCondition} />
              </div>

              <div className="px-6 py-4 border-t border-[#E5E5E5]">
                <button
                  onClick={() => setOpen(false)}
                  className="w-full bg-[#1A1A1A] text-white text-sm font-medium px-4 py-3 rounded-none hover:opacity-90 transition-opacity"
                >
                  View {resultCount} result{resultCount === 1 ? "" : "s"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
