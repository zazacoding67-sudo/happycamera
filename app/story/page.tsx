import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Story — Happy Camera",
  description: "Happy Camera is Malaysia's trusted source for premium new and preloved camera gear since 2022.",
};

export default function StoryPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <h1 className="text-4xl font-bold tracking-tight text-[#1A1A1A] mb-6">Our Story</h1>
      <div className="prose prose-sm prose-neutral max-w-none">
        <p className="text-lg leading-relaxed text-[#666]">
          Happy Camera was born in 2022 from a simple belief: great photography should be accessible to everyone.
        </p>
        <p className="text-[#666] leading-relaxed mt-6">
          What started as a small collection of vintage film cameras shared among friends quickly grew into Malaysia&rsquo;s most curated marketplace for photography gear. Every camera we sell — new or preloved — passes through our hands first.
        </p>
        <p className="text-[#666] leading-relaxed mt-4">
          We inspect, test, and grade every preloved item against our stringent condition standards. We don&rsquo;t just flip gear; we match each piece with someone who will use it, treasure it, and pass it on.
        </p>
        <p className="text-[#666] leading-relaxed mt-4">
          Whether you&rsquo;re a working professional or a first-time film shooter, we&rsquo;re here to help you find your perfect frame.
        </p>
      </div>
      <hr className="my-12 border-[#E5E5E5]" />
      <div className="grid grid-cols-3 gap-8 text-center">
        <div>
          <p className="text-3xl font-bold text-[#1A1A1A]">500+</p>
          <p className="text-xs text-[#888] mt-1">Cameras Sold</p>
        </div>
        <div>
          <p className="text-3xl font-bold text-[#1A1A1A]">98%</p>
          <p className="text-xs text-[#888] mt-1">Happy Customers</p>
        </div>
        <div>
          <p className="text-3xl font-bold text-[#1A1A1A]">3</p>
          <p className="text-xs text-[#888] mt-1">Years Running</p>
        </div>
      </div>
    </div>
  );
}
