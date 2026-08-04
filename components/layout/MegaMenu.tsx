"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { MegaMenuItem } from "@/lib/navigation";

interface MegaMenuProps {
  menu: MegaMenuItem;
}

const materialEase = [0.4, 0, 0.2, 1] as const;

type HoverTarget =
  | { kind: "sub"; index: number }
  | { kind: "shopAll" };

export default function MegaMenu({ menu }: MegaMenuProps) {
  const [hoverTarget, setHoverTarget] = useState<HoverTarget>({
    kind: "sub",
    index: 0,
  });

  const active =
    hoverTarget.kind === "shopAll"
      ? menu.shopAll
      : menu.subcategories[hoverTarget.index] ?? menu.subcategories[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.15, ease: materialEase }}
      className="absolute left-0 top-full w-full z-50"
    >
      <div className="bg-[#111] rounded-none shadow-xl border-t border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex gap-12">
          <div className="w-3/5 flex flex-col gap-1">
            {menu.subcategories.map((sub, i) => (
              <Link
                key={sub.name}
                href={sub.path}
                onMouseEnter={() => setHoverTarget({ kind: "sub", index: i })}
                className="text-[15px] text-white hover:text-yellow-400 transition-colors duration-200 py-1.5 w-fit"
              >
                {sub.name}
              </Link>
            ))}
            <div className="mt-3 pt-3 border-t border-zinc-700">
              <Link
                href={menu.shopAll.path}
                onMouseEnter={() => setHoverTarget({ kind: "shopAll" })}
                className="flex items-center gap-1.5 text-[15px] font-bold text-white hover:text-yellow-400 transition-colors duration-200 py-1.5 w-fit"
              >
                {menu.shopAll.title}
                <ArrowRight size={14} className="mt-0.5" />
              </Link>
            </div>
          </div>
          <div className="w-2/5">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.title}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: materialEase }}
              >
                <Link href={active.path} className="block group">
                  <div className="relative overflow-hidden h-52">
                    <Image
                      src={active.image}
                      alt={active.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 300px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      quality={75}
                    />
                    <div className="absolute inset-0 bg-black/20 z-10" />
                    <div className="absolute bottom-4 left-4">
                      <p className="text-white text-[20px] font-bold tracking-tight">
                        {active.title}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
