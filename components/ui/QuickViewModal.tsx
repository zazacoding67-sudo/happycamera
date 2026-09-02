"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { X, Star, Heart, ShoppingCart, Minus, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/CartContext";
import { useWishlist } from "@/lib/WishlistContext";
import { formatPrice } from "@/lib/format";
import type { ProductCardProps } from "@/types";

function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function CarousellIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  );
}

function FacebookIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function WhatsAppIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function GmailIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 010 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
    </svg>
  );
}

interface Props {
  product: ProductCardProps;
  onClose: () => void;
}

export default function QuickViewModal({ product, onClose }: Props) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, openCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [cartStatus, setCartStatus] = useState<"idle" | "loading" | "success">("idle");
  const modalRef = useRef<HTMLDivElement>(null);

  const validImages = product.images.filter((img) => img.startsWith("https://"));

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") {
        setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : validImages.length - 1));
      }
      if (e.key === "ArrowRight") {
        setActiveImageIndex((prev) => (prev < validImages.length - 1 ? prev + 1 : 0));
      }
    },
    [onClose, validImages.length]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  useEffect(() => {
    modalRef.current?.focus();
  }, []);

  const averageRating =
    product.reviews && product.reviews.length > 0
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
      : 0;

  const stockQuantity = product.stockQuantity ?? 0;
  const inStock = stockQuantity > 0;
  const imageUrl = product.images?.[0] || "";

  const handleAddToCart = () => {
    if (!inStock) return;
    setCartStatus("loading");
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl,
      quantity,
      stockQuantity: product.stockQuantity,
    });
    setTimeout(() => {
      setCartStatus("success");
      openCart();
      setTimeout(() => setCartStatus("idle"), 1200);
    }, 400);
  };

  const handleWishlistClick = () => {
    toggleWishlist(product.id, { name: product.name, price: product.price, imageUrl });
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />

        <motion.div
          ref={modalRef}
          className="relative bg-white w-full max-w-5xl max-h-[85vh] overflow-y-auto z-10 flex flex-col md:flex-row md:min-h-[650px] md:max-h-[88vh]"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          tabIndex={-1}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close quick view"
          >
            <X size={20} />
          </button>

          {/* Image Gallery */}
          <div className="w-full md:w-1/2 px-4 pt-2 pb-1 md:p-9 flex flex-col h-full">
            <div className="relative mx-auto max-w-[320px] max-h-[300px] flex items-center justify-center overflow-hidden bg-gray-100 md:max-w-none md:max-h-none md:aspect-square md:overflow-hidden">
              {validImages.length > 0 ? (
                <>
                  <img
                    src={validImages[activeImageIndex]}
                    alt={product.name}
                    className="max-w-full max-h-full w-auto h-auto object-contain md:w-full md:h-full"
                  />
                  {validImages.length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : validImages.length - 1));
                        }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-1 bg-white/80 hover:bg-white rounded-full shadow-sm transition-colors"
                        aria-label="Previous image"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveImageIndex((prev) => (prev < validImages.length - 1 ? prev + 1 : 0));
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-white/80 hover:bg-white rounded-full shadow-sm transition-colors"
                        aria-label="Next image"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
                      </button>
                    </>
                  )}
                </>
              ) : (
                <span className="text-xs text-gray-400 uppercase tracking-widest">No image</span>
              )}
            </div>
            {validImages.length > 1 && (
              <div className="flex gap-2 mt-1.5 md:mt-3 overflow-x-auto pb-1">
                {validImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageIndex(i)}
                    className={`w-[60px] h-[60px] shrink-0 overflow-hidden transition-all duration-200 ${
                      i === activeImageIndex
                        ? "border-2 border-black"
                        : "border border-gray-200 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${i + 1}`}
                      width={60}
                      height={60}
                      sizes="60px"
                      quality={80}
                      className="w-full h-full object-cover object-center"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="w-full md:w-1/2 px-4 pt-1 pb-4 md:p-9 md:pl-12 flex flex-col justify-center border-t md:border-t-0 md:border-l border-gray-100 overflow-y-auto shrink-0">
            {/* Brand */}
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400">
              {product.brand}
            </p>

            {/* Title */}
            <h2 className="text-[15px] md:text-[17px] font-semibold text-black mt-1.5 md:mt-3">
              {product.name}
            </h2>

            {/* Star Rating + Review Count */}
            <div className="flex items-center gap-1.5 mt-2 md:mt-3">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={14}
                  className="w-3.5 h-3.5 md:w-auto md:h-auto"
                  fill={s <= Math.round(averageRating) ? "#1A1A1A" : "none"}
                  stroke={s <= Math.round(averageRating) ? "#1A1A1A" : "#ccc"}
                />
              ))}
              <span className="text-[10px] md:text-xs text-gray-500">
                ({product.reviews?.length || 0} {product.reviews?.length === 1 ? "review" : "reviews"})
              </span>
            </div>

            {/* Price */}
            <div className="mt-2.5 md:mt-5">
              <span className="text-[15px] md:text-[16px] font-bold text-black">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs md:text-sm text-gray-400 line-through ml-2">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Condition */}
            <div className="mt-2.5 md:mt-4">
              <span className="text-xs font-medium uppercase tracking-widest text-gray-500">
                {product.condition === "new" ? "Brand New" : "Preloved"}
              </span>
            </div>

            {/* Stock Status */}
            <div className="mt-2.5 md:mt-4">
              {!inStock && (
                <span className="text-xs font-semibold uppercase tracking-widest text-red-500">
                  Out of Stock
                </span>
              )}
              {inStock && stockQuantity <= 3 && (
                <span className="text-xs font-semibold uppercase tracking-widest text-red-500">
                  Low Stock — Only {stockQuantity} left
                </span>
              )}
              {inStock && stockQuantity > 3 && (
                <span className="text-xs font-semibold uppercase tracking-widest text-green-600">
                  In Stock
                </span>
              )}
            </div>

            {/* Quantity + Add to Cart */}
            {inStock && (
              <div className="mt-4 md:mt-8 flex items-center gap-2">
                {/* Quantity Stepper */}
                <div className="flex items-center border border-gray-300 h-11 md:h-14">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-9 md:w-10 h-full flex items-center justify-center text-gray-500 hover:text-black transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} className="w-3.5 h-3.5 md:w-auto md:h-auto" />
                  </button>
                  <span className="w-9 md:w-10 text-center text-[13px] md:text-sm font-medium tabular-nums">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(stockQuantity, q + 1))}
                    className="w-9 md:w-10 h-full flex items-center justify-center text-gray-500 hover:text-black transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} className="w-3.5 h-3.5 md:w-auto md:h-auto" />
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={cartStatus !== "idle"}
                  className="flex-1 h-11 md:h-14 bg-[#1A1A1A] text-white text-[12px] md:text-[13px] font-semibold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#333] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {cartStatus === "loading" ? (
                    "Adding..."
                  ) : cartStatus === "success" ? (
                    "Added!"
                  ) : (
                    <>
                      <ShoppingCart size={15} className="w-3.5 h-3.5 md:w-auto md:h-auto" />
                      Add to Cart
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Social + Wishlist Row */}
            <div className="mt-3.5 md:mt-6 flex items-center gap-3">
              <button
                onClick={handleWishlistClick}
                className="flex items-center gap-1.5 text-gray-500 hover:text-black transition-colors"
                aria-label={isWishlisted(product.id) ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart
                  size={15}
                  className={isWishlisted(product.id) ? "fill-red-500 stroke-red-500" : "stroke-gray-400"}
                />
                <span className="text-[10px] md:text-[11px] font-medium uppercase tracking-wider">
                  {isWishlisted(product.id) ? "Wishlisted" : "Wishlist"}
                </span>
              </button>

              <span className="w-px h-4 bg-gray-200" />

              <a href="https://www.instagram.com/happycamera_malaysia" target="_blank" rel="noopener noreferrer" className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-black hover:border-gray-400 transition-colors" aria-label="Instagram">
                <InstagramIcon size={12} />
              </a>
              <a href="https://www.carousell.com.my/u/happycamera/" target="_blank" rel="noopener noreferrer" className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-black hover:border-gray-400 transition-colors" aria-label="Carousell">
                <CarousellIcon size={12} />
              </a>
              <a href="https://www.facebook.com/p/Happy-Camera-100092200102218/" target="_blank" rel="noopener noreferrer" className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-black hover:border-gray-400 transition-colors" aria-label="Facebook">
                <FacebookIcon size={12} />
              </a>
              <a href="https://wa.me/60163208864" target="_blank" rel="noopener noreferrer" className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-black hover:border-gray-400 transition-colors" aria-label="WhatsApp">
                <WhatsAppIcon size={12} />
              </a>
              <a href="mailto:happycamerabusiness@gmail.com" className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-black hover:border-gray-400 transition-colors" aria-label="Email">
                <GmailIcon size={12} />
              </a>
            </div>

            {/* Product Link */}
            <a
              href={`/product/${product.slug}`}
              className="mt-3.5 md:mt-5 text-xs text-gray-400 hover:text-black transition-colors underline"
              onClick={onClose}
            >
              View full product details →
            </a>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
