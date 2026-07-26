"use client";

import { ShieldCheck, Search, RotateCcw } from "lucide-react";

interface Props {
  variant: "new" | "preloved";
}

export default function TrustStrip({ variant }: Props) {
  return (
    <div className="w-full bg-yellow-50 border-y border-yellow-200">
      <div className="max-w-7xl mx-auto px-8 py-4 flex flex-row items-center justify-center gap-10 flex-wrap">
        {variant === "new" ? (
          <>
            <span className="flex items-center gap-2 text-xs text-gray-500 tracking-widest font-medium uppercase">
              <ShieldCheck size={14} className="shrink-0" />
              Sealed &amp; Unopened
            </span>
            <span className="flex items-center gap-2 text-xs text-gray-500 tracking-widest font-medium uppercase">
              <Search size={14} className="shrink-0" />
              Authorized Dealer
            </span>
            <span className="flex items-center gap-2 text-xs text-gray-500 tracking-widest font-medium uppercase">
              <RotateCcw size={14} className="shrink-0" />
              Full Warranty
            </span>
          </>
        ) : (
          <>
            <span className="flex items-center gap-2 text-xs text-gray-500 tracking-widest font-medium uppercase">
              <ShieldCheck size={14} className="shrink-0" />
              Inspected &amp; Verified
            </span>
            <span className="flex items-center gap-2 text-xs text-gray-500 tracking-widest font-medium uppercase">
              <Search size={14} className="shrink-0" />
              Graded Condition
            </span>
            <span className="flex items-center gap-2 text-xs text-gray-500 tracking-widest font-medium uppercase">
              <RotateCcw size={14} className="shrink-0" />
              6-Month Warranty
            </span>
          </>
        )}
      </div>
    </div>
  );
}
