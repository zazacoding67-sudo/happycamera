"use client";

export default function StripeFrame() {
  return (
    <div className="w-full overflow-hidden">
      <div
        className="h-[14px] animate-marquee"
        style={{
          width: "200%",
          backgroundImage:
            "repeating-linear-gradient(45deg, #000 0 18px, #FBBF24 18px 36px)",
        }}
      />
    </div>
  );
}
