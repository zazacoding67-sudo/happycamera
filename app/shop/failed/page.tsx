"use client";

import Link from "next/link";
import { XCircle, MessageCircle } from "lucide-react";

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "0163208864";

export default function FailedPage() {
  const waUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
    "Hi! I need help with a payment that didn't go through."
  )}`;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-16">
      <div className="max-w-lg w-full text-center">
        <XCircle
          size={48}
          className="text-red-400 mx-auto mb-6"
          strokeWidth={1.5}
        />

        <h1 className="text-4xl font-bold tracking-tight text-[var(--color-text-primary)]">
          Payment Not Completed
        </h1>

        <p className="text-sm text-[var(--color-text-secondary)] mt-4 max-w-sm mx-auto leading-relaxed">
          Your payment was not processed. No charges were made.
        </p>

        <p className="text-sm text-[var(--color-text-secondary)] mt-2 max-w-sm mx-auto">
          Your cart items are still saved.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center px-8 py-3.5 text-[13px] font-semibold uppercase tracking-wide bg-[#1A1A1A] text-white hover:bg-[#333] transition-colors"
          >
            Try Again
          </Link>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-[13px] font-semibold uppercase tracking-wide border border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-gray-50 transition-colors"
          >
            <MessageCircle size={16} strokeWidth={1.5} />
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}
