"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { ChevronLeft, ChevronRight, Move } from "lucide-react";
import { fadeUp, standardTransition } from "@/lib/motion";
import { formatPrice } from "@/lib/format";
import type { ProductCardProps } from "@/types";

interface Props {
  title: string;
  shopAllHref: string;
  products: ProductCardProps[];
}

const CARD_W = 320;
const GAP = 20;
const CARD_TOTAL = CARD_W + GAP;

interface CardDepth {
  scale: number;
  opacity: number;
}

export default function CategoryCarousel({ title, shopAllHref, products }: Props) {
  const ref = useRef(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px", amount: 0.1 });

  const [activeIndex, setActiveIndex] = useState(0);
  const [cardDepths, setCardDepths] = useState<CardDepth[]>([]);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  const [dragHintVisible, setDragHintVisible] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isPointerFine, setIsPointerFine] = useState(false);

  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);
  const dragPositions = useRef<{ x: number; t: number }[]>([]);
  const momentumRaf = useRef<number | null>(null);
  const tickRaf = useRef<number | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    setIsPointerFine(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsPointerFine(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const computeCardStates = useCallback(() => {
    const el = scrollRef.current;
    if (!el || products.length === 0) return;
    const containerCenter = el.scrollLeft + el.clientWidth / 2;
    const halfCard = CARD_W / 2;
    let minDist = Infinity;
    let activeIdx = 0;
    const depths: CardDepth[] = products.map((_, i) => {
      const cardCenter = i * CARD_TOTAL + halfCard;
      const dist = Math.abs(cardCenter - containerCenter);
      if (dist < minDist) {
        minDist = dist;
        activeIdx = i;
      }
      const normalized = Math.min(dist / (CARD_TOTAL * 2.5), 1);
      return {
        scale: 1 - normalized * 0.05,
        opacity: 1 - normalized * 0.3,
      };
    });
    setActiveIndex(activeIdx);
    setCardDepths(depths);
  }, [products.length]);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setIsAtStart(el.scrollLeft <= 0);
    setIsAtEnd(el.scrollLeft >= maxScroll - 1);
  }, []);

  const rafUpdate = useCallback(() => {
    if (tickRaf.current) return;
    tickRaf.current = requestAnimationFrame(() => {
      tickRaf.current = null;
      computeCardStates();
      updateScrollState();
    });
  }, [computeCardStates, updateScrollState]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", rafUpdate, { passive: true });
    rafUpdate();
    return () => {
      el.removeEventListener("scroll", rafUpdate);
      if (tickRaf.current) cancelAnimationFrame(tickRaf.current);
    };
  }, [rafUpdate]);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -CARD_TOTAL : CARD_TOTAL,
      behavior: "smooth",
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    isDragging.current = true;
    startX.current = e.pageX - el.offsetLeft;
    scrollLeftStart.current = el.scrollLeft;
    dragPositions.current = [{ x: e.pageX, t: Date.now() }];
    el.style.cursor = "grabbing";
    el.style.userSelect = "none";
    if (momentumRaf.current) cancelAnimationFrame(momentumRaf.current);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!isDragging.current || !el) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX.current) * 1;
    el.scrollLeft = scrollLeftStart.current - walk;
    dragPositions.current.push({ x: e.pageX, t: Date.now() });
    if (dragPositions.current.length > 5) dragPositions.current.shift();
  };

  const handleMouseUp = () => {
    const el = scrollRef.current;
    if (!isDragging.current || !el) return;
    isDragging.current = false;
    el.style.cursor = "";
    el.style.userSelect = "";

    const pos = dragPositions.current;
    if (pos.length >= 2) {
      const first = pos[0];
      const last = pos[pos.length - 1];
      const dt = last.t - first.t;
      if (dt > 0) {
        const velocity = ((last.x - first.x) / dt) * 15;
        if (Math.abs(velocity) > 1) {
          momentumRaf.current = requestAnimationFrame(() =>
            applyMomentum(el, velocity)
          );
        }
      }
    }
    dragPositions.current = [];
    rafUpdate();
  };

  const handleMouseLeave = () => {
    if (!isDragging.current) return;
    handleMouseUp();
  };

  function applyMomentum(el: HTMLDivElement, velocity: number) {
    const friction = 0.95;
    const step = () => {
      velocity *= friction;
      if (Math.abs(velocity) < 0.5) return;
      el.scrollLeft -= velocity;
      momentumRaf.current = requestAnimationFrame(step);
    };
    step();
  }

  const handleDragHintMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.pageX, y: e.pageY });
  };

  return (
    <section ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mb-16 border-t border-[#E8E8E8]">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="flex items-center justify-between mb-8"
      >
        <h2 className="text-[11px] tracking-[0.25em] uppercase text-[#1A1A1A] font-medium">
          {title}
        </h2>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-1">
            {products.map((_, i) => (
              <div
                key={i}
                className="h-[2px] rounded-full transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
                style={{
                  width: i === activeIndex ? "28px" : "16px",
                  backgroundColor:
                    i === activeIndex
                      ? "var(--color-text-primary)"
                      : "var(--color-border)",
                }}
              />
            ))}
          </div>
          <Link
            href={shopAllHref}
            className="text-[11px] tracking-[0.15em] uppercase text-[#888] hover:text-[#1A1A1A] transition-colors whitespace-nowrap"
          >
            Shop All &rarr;
          </Link>
        </div>
      </motion.div>

      <div
        className="relative overflow-visible group"
        onMouseEnter={() => setDragHintVisible(true)}
        onMouseMove={handleDragHintMove}
        onMouseLeave={() => setDragHintVisible(false)}
      >
        {isPointerFine && (
          <div
            className="hidden md:block fixed pointer-events-none z-50 transition-opacity duration-150"
            style={{
              opacity: dragHintVisible ? 1 : 0,
              transform: `translate(${mousePos.x + 16}px, ${mousePos.y + 8}px)`,
            }}
          >
            <span className="flex items-center gap-1.5 bg-[var(--color-text-primary)] text-white text-xs uppercase tracking-wide rounded-full px-3 py-1.5">
              <Move size={12} strokeWidth={2} />
              Drag
            </span>
          </div>
        )}

        <button
          onClick={() => scroll("left")}
          disabled={isAtStart}
          className={`hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -left-4 z-10 w-9 h-9 rounded-full border border-[var(--color-border)] bg-transparent items-center justify-center transition-all duration-200 ${
            isAtStart
              ? "opacity-40 pointer-events-none"
              : "opacity-0 group-hover:opacity-100 hover:bg-[var(--color-text-primary)] hover:border-[var(--color-text-primary)] hover:text-white"
          }`}
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-4 h-4 text-[var(--color-text-primary)]" />
        </button>

        <div
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] cursor-grab active:cursor-grabbing"
          style={{
            maskImage:
              "linear-gradient(to right, transparent 0%, black 3%, black 97%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 3%, black 97%, transparent 100%)",
          }}
        >
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              className="snap-start flex-shrink-0 min-w-[300px] w-[300px] sm:min-w-[320px] sm:w-[320px]"
              animate={{
                scale: cardDepths[i]?.scale ?? 1,
                opacity: cardDepths[i]?.opacity ?? 1,
              }}
              transition={standardTransition}
            >
              <Link
                href={`/product/${product.slug}`}
                className="block group/card"
              >
                <div className="relative h-[220px] bg-gray-100 overflow-hidden">
                  {product.images?.[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      sizes="320px"
                      className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover/card:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-xs text-gray-400">No image</span>
                    </div>
                  )}
                  <span
                    className={`absolute bottom-2 left-2 text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-sm ${
                      product.condition === "new"
                        ? "bg-black text-white"
                        : "bg-white text-black border border-black"
                    }`}
                  >
                    {product.condition === "new" ? "NEW" : "PRELOVED"}
                  </span>
                </div>
                <div className="px-3 py-3">
                  <h3 className="text-sm font-semibold text-[var(--color-text-primary)] leading-snug line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-sm font-bold text-[var(--color-text-primary)] mt-1">
                    {formatPrice(product.price)}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <button
          onClick={() => scroll("right")}
          disabled={isAtEnd}
          className={`hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 -right-4 z-10 w-9 h-9 rounded-full border border-[var(--color-border)] bg-transparent items-center justify-center transition-all duration-200 ${
            isAtEnd
              ? "opacity-40 pointer-events-none"
              : "opacity-0 group-hover:opacity-100 hover:bg-[var(--color-text-primary)] hover:border-[var(--color-text-primary)] hover:text-white"
          }`}
          aria-label="Scroll right"
        >
          <ChevronRight className="w-4 h-4 text-[var(--color-text-primary)]" />
        </button>
      </div>
    </section>
  );
}
