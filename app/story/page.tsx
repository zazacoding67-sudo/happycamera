import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Story — Happy Camera",
  description: "Happy Camera is Malaysia's trusted source for premium new and preloved camera gear since 2021.",
};

export default function StoryPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <h1 className="text-4xl font-bold tracking-tight text-[#1A1A1A] mb-6">Our Story</h1>
      <div className="prose prose-sm prose-neutral max-w-none">
        <p className="text-lg leading-relaxed text-[#666]">
          Happy Camera was born in 2021 from a simple belief: great
          photography should be accessible to everyone.
        </p>
        <p className="text-[#666] leading-relaxed mt-6">
          What started as an online-only shop quickly grew into a trusted
          destination for photography gear across Malaysia — and as demand
          grew, we opened our own physical store so customers could see,
          hold, and try gear before taking it home.
        </p>
        <p className="text-[#666] leading-relaxed mt-4">
          Whether it&rsquo;s brand new or preloved, every camera we sell passes
          through our hands first. We inspect, test, and grade every preloved
          item against our own condition standards — because we don&rsquo;t just
          want to sell gear, we want to help you find the right one.
        </p>
        <p className="text-[#666] leading-relaxed mt-4">
          We&rsquo;re focused on one thing above all: giving our customers the
          best experience and the best price, so every customer walks out
          with a smile.
        </p>
      </div>
      <hr className="my-12 border-[#E5E5E5]" />
      <div className="grid grid-cols-3 gap-8 text-center">
        <div>
          <p className="text-3xl font-bold text-[#1A1A1A]">10,000+</p>
          <p className="text-xs text-[#888] mt-1">Cameras Sold</p>
        </div>
        <div>
          <p className="text-3xl font-bold text-[#1A1A1A]">100%</p>
          <p className="text-xs text-[#888] mt-1">Happy Customers</p>
        </div>
        <div>
          <p className="text-3xl font-bold text-[#1A1A1A]">5</p>
          <p className="text-xs text-[#888] mt-1">Years Running</p>
        </div>
      </div>
    </div>
  );
}
