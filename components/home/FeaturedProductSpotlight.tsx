"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/motion";

interface FeaturedProductSpotlightProps {
  title: string;
  mainImage: string;
  thumbnails?: string[];
  ctaLabel: string;
  ctaLink: string;
}

export default function FeaturedProductSpotlight({
  title,
  mainImage,
  thumbnails,
  ctaLabel,
  ctaLink,
}: FeaturedProductSpotlightProps) {
  const hasThumbnails = !!thumbnails && thumbnails.length > 0;
  const reduced = useReducedMotion();

  return (
    <section className="w-full bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="flex flex-col md:flex-row md:items-center md:gap-16">
          {/* Left — Large product image with reflection/fade-out beneath */}
          <motion.div
            initial={reduced ? false : { opacity: 0, x: -24 }}
            whileInView={reduced ? {} : { opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full md:flex-[3] shrink-0"
          >
            <div className="relative">
              <Image
                src={mainImage}
                alt={title}
                width={1695}
                height={928}
                className="w-full h-auto object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={false}
              />
              {/* Reflection / fade-out gradient beneath the image */}
              <div className="absolute inset-x-0 bottom-0 h-24 md:h-32 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none" />
            </div>
          </motion.div>

          {/* Right — Stacked, vertically centered text block */}
          <motion.div
            initial={reduced ? false : { opacity: 0, x: 24 }}
            whileInView={reduced ? {} : { opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="mt-10 md:mt-0 md:flex-[2] text-center md:text-left"
          >
            <h2 className="text-2xl md:text-4xl font-bold uppercase text-white leading-tight tracking-wide">
              {title}
            </h2>

            <div className="mt-8 md:mt-10">
              {hasThumbnails && (
                <div className="flex items-center justify-center md:justify-start gap-3 md:gap-4 mb-8 md:mb-10">
                  {thumbnails.map((src, i) => (
                    <div
                      key={i}
                      className="w-16 h-16 md:w-20 md:h-20 bg-white p-1.5 flex items-center justify-center"
                    >
                      <Image
                        src={src}
                        alt={`${title} view ${i + 1}`}
                        width={72}
                        height={72}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ))}
                </div>
              )}

              <Link
                href={ctaLink}
                className="inline-block bg-white text-black px-8 md:px-10 py-3.5 md:py-4 text-[13px] md:text-sm font-semibold uppercase tracking-[0.15em] transition-colors hover:bg-zinc-200"
              >
                {ctaLabel}
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
