import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Happy Camera",
  description: "Happy Camera privacy policy.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <h1 className="text-4xl font-bold tracking-tight text-[#1A1A1A] mb-6">Privacy Policy</h1>
      <div className="prose prose-sm prose-neutral max-w-none text-[#666] leading-relaxed space-y-4">
        <p>We collect only the information necessary to process your order and provide support: your name, email, phone, and shipping address.</p>
        <p>Payment details are handled entirely by CHIP — we never see or store your card information.</p>
        <p>We do not sell, rent, or share your personal data with third parties except as required to fulfill your order (e.g., courier services).</p>
        <p>You may request deletion of your data at any time by contacting <a href="mailto:hello@happycamera.com.my" className="underline underline-offset-2 text-[#1A1A1A]">hello@happycamera.com.my</a>.</p>
        <p className="text-xs text-[#888] pt-8">Last updated: January 2026</p>
      </div>
    </div>
  );
}
