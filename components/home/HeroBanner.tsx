"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useReducedMotion } from "@/lib/motion";

interface HeroBannerProps {
  image: string;
}

export default function HeroBanner({ image }: HeroBannerProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-120px", amount: 0.1 });
  const reduced = useReducedMotion();

  return (
    <section ref={ref} className="relative z-10 h-screen w-full -mt-20 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={image}
          alt="Fujifilm X100VI"
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
          quality={75}
        />
      </div>
      <div className="absolute inset-0 bg-amber-800/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent" />
      <div className="relative z-10 text-center px-4 max-w-3xl">
        <motion.p
          initial={reduced ? {} : { opacity: 0, y: 20 }}
          animate={inView || reduced ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-[11px] tracking-[0.3em] uppercase text-yellow-400 font-medium mb-3 md:mb-5"
        >
          Fujifilm
        </motion.p>
        <motion.h2
          initial={reduced ? {} : { opacity: 0, y: 32 }}
          animate={inView || reduced ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className="text-[clamp(2rem,6vw,5rem)] font-bold tracking-tight text-white leading-[1.1]"
        >
          The X100VI
        </motion.h2>
        <motion.p
          initial={reduced ? {} : { opacity: 0, y: 20 }}
          animate={inView || reduced ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="mt-5 text-base md:text-lg text-white/70 max-w-lg mx-auto leading-relaxed"
        >
          40MP sensor. IBIS. Classic film simulations. The everyday carry that rewards intention.
        </motion.p>
        <motion.div
          initial={reduced ? {} : { opacity: 0, y: 24 }}
          animate={inView || reduced ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
          className="mt-6 md:mt-10 flex items-center justify-center"
        >
          <Link
            href="/product/fujifilm-x100vi"
            className="inline-flex items-center justify-center px-8 py-4 text-sm font-semibold tracking-wider uppercase bg-yellow-400 text-black rounded-none hover:bg-yellow-300 min-w-[220px] transition-all"
          >
            View Product
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
