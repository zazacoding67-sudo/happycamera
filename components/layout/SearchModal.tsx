"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useSearch } from "@/lib/useSearch";
import { formatPrice } from "@/lib/format";
import { materialEase } from "@/lib/motion";

export default function SearchModal() {
  const { query, setQuery, results, isLoading } = useSearch();
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim().length === 0) {
      setOpen(false);
      return;
    }
    setOpen(true);
  }, [query, results]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if (results.length > 0) setOpen(true); }}
          placeholder="Search gear..."
          autoComplete="off"
          className="w-56 pl-9 pr-8 py-1.5 text-sm rounded-full border border-gray-300 focus:outline-none focus:border-black"
        />
        {isLoading && (
          <Loader2 className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 animate-spin" />
        )}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15, ease: materialEase }}
            className="absolute top-full mt-2 right-0 w-72 bg-white border border-gray-200 shadow-lg overflow-hidden"
          >
            {results.length === 0 && !isLoading ? (
              <p className="px-4 py-6 text-sm text-gray-500 text-center">
                No results found for &ldquo;{query}&rdquo;
              </p>
            ) : (
              results.map((product) => (
                <Link
                  key={product.slug}
                  href={`/product/${product.slug}`}
                  onClick={() => { setOpen(false); setQuery(""); }}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-10 h-10 object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[#1A1A1A] truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
