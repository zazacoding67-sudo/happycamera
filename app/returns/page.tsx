import type { Metadata } from "next";
import { POLICIES } from "@/lib/policies";

export const metadata: Metadata = {
  title: "Returns & Exchanges — Happy Camera",
  description: "Happy Camera return policy.",
};

export default function ReturnsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <h1 className="text-4xl font-bold tracking-tight text-[#1A1A1A] mb-6">Returns & Exchanges</h1>
      <div className="prose prose-sm prose-neutral max-w-none text-[#666] leading-relaxed space-y-4">
        <p>We accept returns within <strong>{POLICIES.returnWindow}</strong> of delivery.</p>
        <p>{POLICIES.returnConditions}</p>
        <p>{POLICIES.warranty.general} {POLICIES.warranty.condition}</p>
        <h3 className="text-[#1A1A1A] font-semibold mt-6">Exclusions</h3>
        <ul className="list-disc pl-5 space-y-1">
          {POLICIES.exclusions.map((exclusion, i) => (
            <li key={i}>{exclusion}</li>
          ))}
        </ul>
        <p className="mt-6">
          To start a return, email <a href="mailto:hello@happycamera.com.my" className="underline underline-offset-2 text-[#1A1A1A]">hello@happycamera.com.my</a> with your order number.
        </p>
        <p className="text-xs text-[#888] pt-8">Last updated: January 2026</p>
      </div>
    </div>
  );
}
