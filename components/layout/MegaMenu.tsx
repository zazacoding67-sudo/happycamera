"use client";

import Link from "next/link";
import { ArrowRight, ImageOff } from "lucide-react";
import { motion } from "framer-motion";
import type { MegaMenuItem } from "@/lib/navigation";

interface MegaMenuProps {
  menu: MegaMenuItem;
}

const materialEase = [0.4, 0, 0.2, 1] as const;

export default function MegaMenu({ menu }: MegaMenuProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.15, ease: materialEase }}
      className="absolute left-0 top-full w-full z-50"
      data-mega-menu="true"
    >
      <div className="bg-[#111] rounded-none shadow-xl border-t border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center justify-between mb-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-zinc-500">
              {menu.name}
            </p>
            <Link
              href={menu.shopAll.path}
              className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-[0.15em] text-white hover:text-yellow-400 transition-colors duration-200"
            >
              {menu.shopAll.title}
              <ArrowRight size={14} />
            </Link>
          </div>
          <div className="flex flex-wrap gap-5">
            {menu.subcategories.map((sub) => (
              <Link
                key={sub.name}
                href={sub.path}
                className="group w-36"
              >
                <div className="relative aspect-square w-full bg-zinc-900 overflow-hidden flex items-center justify-center">
                  {sub.image ? (
                    <img
                      src={sub.image}
                      alt={sub.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <ImageOff className="w-8 h-8 text-zinc-600" />
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                </div>
                <p className="mt-3 text-[13px] font-medium text-white group-hover:text-yellow-400 transition-colors duration-200">
                  {sub.name}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
