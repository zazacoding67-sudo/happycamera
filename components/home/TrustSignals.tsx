"use client";

import Image from "next/image";
import { ShieldCheck, Lock, BadgeCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/motion";

const trustBadges = [
  { icon: ShieldCheck, label: "Secure Payments" },
  { icon: Lock, label: "Encrypted" },
  { icon: BadgeCheck, label: "Safe & Reliable" },
];

export default function TrustSignals() {
  const reduced = useReducedMotion();

  return (
    <section className="w-full">
      <div className="flex flex-col md:flex-row items-stretch">
        {/* Left side — We Accept banner image (contained card) */}
        <motion.div
          initial={reduced ? false : { opacity: 0, x: -24 }}
          whileInView={reduced ? {} : { opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 bg-white flex items-center justify-center p-8 md:p-14"
        >
          <Image
            src="/payment.png"
            alt="We Accept — bank transfers, e-wallets, pay later, and secure payments"
            width={1920}
            height={1080}
            className="w-full h-auto object-contain max-w-lg md:max-w-xl"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </motion.div>

        {/* Right side — Text, badges & Info */}
        <motion.div
          initial={reduced ? false : { opacity: 0, x: 24 }}
          whileInView={reduced ? {} : { opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="flex-1 bg-gray-100 flex items-center justify-center px-6 md:px-10 py-12 md:py-0"
        >
          <div className="max-w-md text-center md:text-left">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-zinc-900 leading-tight mb-3 md:mb-4">
              Shop Now, Pay Your Way
            </h2>
            <p className="text-sm md:text-base text-zinc-500 leading-relaxed">
              Pay however works best for you — straight from your bank, through an e-wallet,
              or split it later with Atome or GrabPay. Every payment is safe, encrypted, and protected.
            </p>
            <div className="mt-6 md:mt-8 flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-3">
              {trustBadges.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon size={16} strokeWidth={2} className="text-zinc-700 shrink-0" />
                  <span className="text-xs md:text-sm font-medium text-zinc-600">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
