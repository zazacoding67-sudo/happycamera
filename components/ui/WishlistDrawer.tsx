"use client";

import Link from "next/link";
import { X, Trash2, Heart, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useWishlist } from "@/lib/WishlistContext";
import { formatPrice } from "@/lib/format";
import { materialEase } from "@/lib/motion";

const PREVIEW_COUNT = 4;

export default function WishlistDrawer() {
  const { items, isOpen, closeWishlist, toggleWishlist } = useWishlist();

  const previewItems = items.slice(0, PREVIEW_COUNT);
  const remaining = items.length - PREVIEW_COUNT;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: materialEase }}
            className="fixed inset-0 z-50 bg-black/50"
            onClick={closeWishlist}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            <div className="flex items-center justify-between px-6 h-16 border-b border-[#E5E5E5]">
              <h2 className="text-lg font-bold tracking-tight text-[#1A1A1A]">
                Saved
              </h2>
              <button
                onClick={closeWishlist}
                className="p-2 text-[#666] hover:text-[#1A1A1A] transition-colors"
                aria-label="Close wishlist"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center mt-20 text-center">
                  <Heart
                    size={40}
                    className="text-[#666] mb-4"
                  />
                  <p className="text-sm font-medium text-[#1A1A1A]">
                    Your wishlist is empty
                  </p>
                  <p className="text-xs text-[#666] mt-1">
                    Save items you love to find them later.
                  </p>
                  <Link
                    href="/shop"
                    onClick={closeWishlist}
                    className="mt-6 text-sm font-medium text-[#1A1A1A] underline underline-offset-4 hover:no-underline transition-colors"
                  >
                    Continue Shopping
                  </Link>
                </div>
              ) : (
                <>
                  <ul className="space-y-3">
                    <AnimatePresence mode="popLayout">
                      {previewItems.map((item) => (
                        <motion.li
                          key={item.productId}
                          layout
                          initial={{ opacity: 0, x: 40 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 40, height: 0, marginBottom: 0 }}
                          transition={{ duration: 0.2, ease: materialEase }}
                          className="flex items-center gap-3 py-3 border-b border-[#E5E5E5] last:border-0 overflow-hidden"
                        >
                          <Link
                            href={`/product/${item.productId}`}
                            onClick={closeWishlist}
                            className="w-14 h-14 bg-gray-100 shrink-0 overflow-hidden block"
                          >
                            {item.imageUrl ? (
                              <img
                                src={item.imageUrl}
                                alt={item.name ?? "Product"}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[#999] text-xs">
                                No img
                              </div>
                            )}
                          </Link>
                          <div className="flex-1 min-w-0">
                            <Link
                              href={`/product/${item.productId}`}
                              onClick={closeWishlist}
                            >
                              <p className="text-sm font-medium text-[#1A1A1A] truncate hover:underline">
                                {item.name ?? "Product"}
                              </p>
                            </Link>
                            <p className="text-xs text-[#666] mt-0.5">
                              {item.price ? formatPrice(item.price) : ""}
                            </p>
                          </div>
                          <button
                            onClick={() => toggleWishlist(item.productId)}
                            className="p-1.5 text-[#666] hover:text-red-500 transition-colors shrink-0"
                            aria-label={`Remove ${item.name ?? "item"} from wishlist`}
                          >
                            <Trash2 size={14} />
                          </button>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>

                  {items.length > PREVIEW_COUNT && (
                    <p className="text-xs text-[#666] mt-3 text-center">
                      +{remaining} more saved item{remaining > 1 ? "s" : ""}
                    </p>
                  )}

                  <div className="mt-6">
                    <Link
                      href="/wishlist"
                      onClick={closeWishlist}
                      className="flex items-center justify-center gap-2 w-full bg-[#1A1A1A] text-white text-sm font-medium px-4 py-3 rounded-none hover:opacity-90 transition-opacity"
                    >
                      View All Saved ({items.length})
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
