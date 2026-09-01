import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Happy Camera",
  description: "Happy Camera terms of service.",
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <h1 className="text-4xl font-bold tracking-tight text-[#1A1A1A] mb-6">Terms of Service</h1>
      <div className="prose prose-sm prose-neutral max-w-none text-[#666] leading-relaxed space-y-4">
        <p>All prices are in RM (Malaysian Ringgit) and include applicable taxes unless stated otherwise.</p>
        <p>Payment must be received in full before an order is processed. We accept payments via CHIP (FPX, e-wallet, and card).</p>
        <p>All preloved items are described to the best of our ability. Condition grades are assigned by our team and are final unless a significant discrepancy is found.</p>
        <p>We reserve the right to cancel any order if fraud is suspected or if an item is unexpectedly out of stock. A full refund will be issued in such cases.</p>
        <p>These terms are governed by the laws of Malaysia.</p>
        <p className="text-xs text-[#888] pt-8">Last updated: January 2026</p>
      </div>
    </div>
  );
}
