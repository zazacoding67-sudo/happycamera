"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView, type Variants } from "framer-motion";

const stagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

const fadeSlide: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

export default function BrandEthos() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-120px", amount: 0.1 });

  return (
    <section ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <motion.span variants={fadeSlide} className="text-[11px] tracking-[0.25em] uppercase text-yellow-500 font-medium">
            Our Ethos
          </motion.span>
          <motion.h2 variants={fadeSlide} className="text-4xl md:text-5xl font-light tracking-tight text-zinc-900 leading-tight mt-4">
            Gear curated for the modern creator.
          </motion.h2>
          <motion.p variants={fadeSlide} className="mt-6 text-base text-zinc-500 leading-relaxed max-w-md">
            Whether you&apos;re shooting your first roll of 35mm film or rigging a
            cinema camera for a commercial set, we source the highest quality new
            and preloved equipment to bring your vision to life.
          </motion.p>
        </motion.div>
        <motion.div
          className="relative group overflow-hidden aspect-[4/5]"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        >
          <Image
            src="/images/ethos-yellow-image.png"
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <Image
            src="/images/ethos-image.png"
            alt="Camera lifestyle"
            fill
            className="object-cover transition-opacity duration-700 ease-in-out group-hover:opacity-0"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </motion.div>
      </div>
    </section>
  );
}
