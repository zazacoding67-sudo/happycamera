"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useState } from "react";
import { useRef } from "react";
import { useReducedMotion } from "@/lib/motion";

export default function ClosingCTA() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [isMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches,
  );
  const noHide = reduced || isMobile;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const parallaxY = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? ["0%", "0%"] : ["-8%", "8%"],
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-full aspect-[4/3] md:h-auto md:min-h-[80vh] md:aspect-auto flex items-end md:items-center justify-center overflow-hidden mt-24 md:mt-32 mb-16 md:mb-0"
    >
      <motion.div
        className="absolute -inset-y-[12%] inset-x-0 md:inset-0 overflow-hidden"
        style={{ y: parallaxY, willChange: "transform" }}
      >
        <motion.div
          className="absolute inset-0"
          initial={noHide ? {} : { scale: 1.05 * 1.15 }}
          whileInView={reduced ? {} : { scale: 1.15 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: "top" }}
        >
          <Image
            src="/images/home-storefront.webp"
            alt=""
            fill
            className="object-cover object-[62%_0%] md:object-[50%_0%]"
            sizes="100vw"
            priority
            quality={75}
          />
        </motion.div>
      </motion.div>
      <div className="absolute inset-0 bg-amber-900/5 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />
      <div className="relative z-10 text-center px-4 max-w-3xl pb-6 md:pb-0">
        <motion.p
          initial={noHide ? {} : { opacity: 0, y: 20 }}
          whileInView={reduced ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-yellow-400 font-medium mb-2 md:mb-4"
        >
          Ready to shoot?
        </motion.p>
        <motion.h2
          initial={noHide ? {} : { opacity: 0, y: 32 }}
          whileInView={reduced ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className="text-[clamp(1.5rem,7vw,5rem)] md:text-[clamp(2rem,6vw,5rem)] font-bold tracking-tight text-white leading-[1.1]"
        >
          Find your next camera.
        </motion.h2>
        <motion.div
          initial={noHide ? {} : { opacity: 0, y: 24 }}
          whileInView={reduced ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
          className="mt-4 md:mt-10 flex items-center justify-center"
        >
          <Link
            href="/shop"
            className="inline-flex items-center justify-center px-6 py-2.5 md:px-8 md:py-4 text-xs md:text-sm font-semibold tracking-wider uppercase bg-yellow-400 text-black rounded-none hover:bg-yellow-300 min-w-[200px] md:min-w-[220px] transition-all"
          >
            Browse All Cameras
          </Link>
        </motion.div>

        <motion.p
          initial={noHide ? {} : { opacity: 0, y: 12 }}
          whileInView={reduced ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.55 }}
          className="hidden md:block text-[11px] uppercase tracking-[0.25em] text-white/50 font-medium mt-10"
        >
          You Happy, We Happy
        </motion.p>
      </div>
    </section>
  );
}
