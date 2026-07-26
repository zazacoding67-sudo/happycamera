"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function SuccessError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Success page error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-16">
      <div className="max-w-lg w-full text-center">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
          Something went wrong
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-3 max-w-sm mx-auto leading-relaxed">
          We couldn&rsquo;t load your order confirmation. Your payment may have
          still been processed — check your email for confirmation.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center px-8 py-3.5 text-[13px] font-semibold uppercase tracking-wide bg-[#1A1A1A] text-white hover:bg-[#333] transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center px-8 py-3.5 text-[13px] font-semibold uppercase tracking-wide border border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-gray-50 transition-colors"
          >
            Back to Shop
          </Link>
        </div>
      </div>
    </div>
  );
}
