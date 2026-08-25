"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, Loader2, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useSearch } from "@/lib/useSearch";
import { formatPrice } from "@/lib/format";
import { materialEase } from "@/lib/motion";

export default function SearchModal() {
  const { query, setQuery, results, isLoading } = useSearch();
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
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

  useEffect(() => {
    if (mobileOpen) {
      requestAnimationFrame(() => mobileInputRef.current?.focus());
    }
  }, [mobileOpen]);

  function closeMobile() {
    setMobileOpen(false);
    setQuery("");
    setOpen(false);
  }

  return (
    <>
      {/* Mobile: search icon button */}
      <button
        className="md:hidden p-2 text-black"
        onClick={() => setMobileOpen(true)}
        aria-label="Search"
      >
        <Search size={22} />
      </button>

      {/* Mobile: full-screen search overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] bg-white md:hidden flex flex-col">
          <div className="flex items-center gap-3 px-4 h-14 border-b border-gray-200">
            <button
              onClick={closeMobile}
              className="p-1 text-black shrink-0"
              aria-label="Close search"
            >
              <X size={22} />
            </button>
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                ref={mobileInputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search gear..."
                autoComplete="off"
                className="w-full pl-9 pr-4 py-2 text-sm rounded-full border border-gray-300 focus:outline-none focus:border-black"
              />
              {isLoading && (
                <Loader2 className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 animate-spin" />
              )}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {query.trim().length > 0 && (
              <>
                {results.length === 0 && !isLoading ? (
                  <p className="px-4 py-6 text-sm text-gray-500 text-center">
                    No results found for &ldquo;{query}&rdquo;
                  </p>
                ) : (
                  results.map((product) => (
                    <Link
                      key={product.slug}
                      href={`/product/${product.slug}`}
                      onClick={closeMobile}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100"
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
              </>
            )}
          </div>
        </div>
      )}

      {/* Desktop: inline search input */}
      <div ref={containerRef} className="relative hidden md:block">
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
    </>
  );
}
