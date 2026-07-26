"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/motion";

export default function ClosingCTA() {
  const reduced = useReducedMotion();

  return (
    <section className="relative h-[80vh] min-h-[500px] md:min-h-[600px] flex items-center justify-center overflow-hidden mt-24 md:mt-32">
      <motion.div
        className="absolute inset-0"
        initial={reduced ? {} : { scale: 1.05 }}
        whileInView={reduced ? {} : { scale: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        style={{ willChange: "transform" }}
      >
        <Image
          src="/images/home-3.jpg"
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
          quality={75}
        />
      </motion.div>
      <div className="absolute inset-0 bg-amber-900/5 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />
      <div className="relative z-10 text-center px-4 max-w-3xl">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-[11px] tracking-[0.3em] uppercase text-yellow-400 font-medium mb-4"
        >
          Ready to shoot?
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className="text-[clamp(2rem,6vw,5rem)] font-bold tracking-tight text-white leading-[1.1]"
        >
          Find your next camera.
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
          className="mt-10 flex items-center justify-center"
        >
          <Link
            href="/shop"
            className="inline-flex items-center justify-center px-8 py-4 text-sm font-semibold tracking-wider uppercase bg-yellow-400 text-black rounded-none hover:bg-yellow-300 min-w-[220px] transition-all"
          >
            Browse All Cameras
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.55 }}
          className="text-[11px] uppercase tracking-[0.25em] text-white/50 font-medium mt-10"
        >
          You Happy, We Happy
        </motion.p>
      </div>
    </section>
  );
}
