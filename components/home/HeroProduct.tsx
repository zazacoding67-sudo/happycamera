"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, type Variants } from "framer-motion";
import { formatPrice } from "@/lib/format";
import { useReducedMotion } from "@/lib/motion";

interface Spec {
  label: string;
  value: string;
}

interface HeroProductProps {
  headline: string;
  subtitle: string;
  body: string;
  specs: Spec[];
  price: number;
  condition: "new" | "preloved";
  image: string;
  slug: string;
}

const stagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const fadeSlide: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export default function HeroProduct({
  headline,
  subtitle,
  body,
  specs,
  price,
  condition,
  image,
  slug,
}: HeroProductProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px", amount: 0.1 });
  const reduced = useReducedMotion();

  return (
    <section ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-32">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
        <motion.div
          className="bg-zinc-50 overflow-hidden"
          initial={reduced ? {} : { opacity: 0, scale: 0.96 }}
          animate={inView || reduced ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <Image
            src={image}
            alt={headline}
            width={800}
            height={1000}
            className="w-full aspect-[4/5] object-cover"
            priority
          />
        </motion.div>
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <motion.span variants={fadeSlide} className="text-[11px] tracking-[0.3em] uppercase text-yellow-500 font-medium">
            {condition === "new" ? "New Arrival" : "Preloved"}
          </motion.span>
          <motion.h2 variants={fadeSlide} className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-zinc-900 leading-[1.1] mt-3">
            {headline}
          </motion.h2>
          <motion.p variants={fadeSlide} className="text-sm md:text-base text-zinc-500 mt-2">{subtitle}</motion.p>
          <motion.div variants={fadeSlide} className="w-10 h-0.5 bg-yellow-400 mt-6" />
          <motion.p variants={fadeSlide} className="mt-6 text-base text-zinc-600 leading-relaxed">
            {body}
          </motion.p>
          <motion.dl variants={fadeSlide} className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4">
            {specs.map((spec) => (
              <div key={spec.label}>
                <dt className="text-[10px] tracking-[0.15em] uppercase text-yellow-600 font-medium">
                  {spec.label}
                </dt>
                <dd className="text-sm text-zinc-800 mt-0.5">{spec.value}</dd>
              </div>
            ))}
          </motion.dl>
          <motion.div variants={fadeSlide} className="flex items-center gap-6 mt-8 pt-8 border-t border-zinc-100">
            <span className="text-xl font-medium text-zinc-900">
              {formatPrice(price)}
            </span>
            <Link
              href={`/product/${slug}`}
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold tracking-wider uppercase bg-zinc-900 text-white hover:bg-zinc-800 rounded-none transition-all"
            >
              View Details
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
