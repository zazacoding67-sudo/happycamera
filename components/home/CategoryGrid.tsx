"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import catLens from "@/public/images/cat-lens.jpg";
import catFilm from "@/public/images/cat-film.jpg";
import catDigital from "@/public/images/cat-digital.jpg";
import catAcc from "@/public/images/cat-acc.jpg";
import catDrybox from "@/public/images/cat-drybox.jpg";
import catBag from "@/public/images/cat-bag.jpg";
import StripeFrame from "@/components/home/StripeFrame";

const categories = [
  { title: "Lenses", slug: "lenses", image: catLens },
  { title: "Digital Bodies", slug: "cameras", image: catFilm },
  { title: "Mirrorless", slug: "cameras", subcategory: "Mirrorless", image: catDigital },
  { title: "Accessories", slug: "accessories", image: catAcc },
  { title: "Dry Cabinet", slug: "accessories", subcategory: "Others", image: catDrybox },
  { title: "Bags", slug: "accessories", subcategory: "Bags", image: catBag },
];

function CategoryCard({
  cat,
  condition,
}: {
  cat: (typeof categories)[number];
  condition: string;
}) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 200, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 200, damping: 20 });
  const [isTouching, setIsTouching] = useState(false);

  function handleMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    if (isTouching) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }

  function handleTouchStart() {
    setIsTouching(true);
  }

  return (
    <Link
      href={`/shop?category=${cat.slug}${cat.subcategory ? `&subcategory=${cat.subcategory}` : ""}&condition=${condition}`}
      className="group relative aspect-square overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-yellow-400 transition-colors duration-300"
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
    >
      <Image
        src={cat.image}
        alt={cat.title}
        fill
        className="object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-[filter] duration-700"
        sizes="(max-width: 768px) 100vw, 33vw"
        placeholder="blur"
      />
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />

      <motion.div
        className="absolute z-20 w-14 h-14 rounded-full bg-black flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100"
        style={{ left: springX, top: springY, x: "-50%", y: "-50%" }}
      >
        <span className="text-white text-[9px] font-bold uppercase tracking-widest">
          VIEW
        </span>
      </motion.div>

      <div className="relative z-10 flex flex-col justify-end p-6 h-full">
        <h3 className="text-xl font-bold text-white mb-1">{cat.title}</h3>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0">
          <span className="w-6 h-0.5 bg-yellow-400" />
          <span className="text-[10px] font-semibold uppercase tracking-widest text-white/80">
            Shop Now
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function CategoryGrid({
  condition = "new",
}: {
  condition?: "new" | "preloved";
}) {
  return (
    <section id="shop" className="bg-black scroll-mt-20">
      <StripeFrame />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="text-center mb-16">
          <span className="text-[11px] tracking-[0.3em] uppercase text-yellow-400 font-medium">
            Browse by Category
          </span>
          <h2 className="text-3xl md:text-4xl font-light tracking-tight text-white mt-3">
            Explore Our Collection
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {categories.map((cat) => (
            <CategoryCard key={cat.title} cat={cat} condition={condition} />
          ))}
        </div>
        <div className="mt-14 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-white/70 hover:text-yellow-400 transition-colors"
          >
            Browse All Gear <ArrowRight size={14} />
          </Link>
        </div>
      </div>
      <StripeFrame />
    </section>
  );
}
