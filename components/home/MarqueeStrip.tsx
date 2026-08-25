const phrase = (
  <>
    <span className="text-white text-[13px] font-medium tracking-[0.15em] uppercase shrink-0">
      CERTIFIED PRE-OWNED
    </span>
    <span className="text-yellow-400 shrink-0">·</span>
    <span className="text-white text-[13px] font-medium tracking-[0.15em] uppercase shrink-0">
      EXPRESS SHIPPING
    </span>
    <span className="text-yellow-400 shrink-0">·</span>
    <span className="text-white text-[13px] font-medium tracking-[0.15em] uppercase shrink-0">
      14-DAY RETURNS
    </span>
    <span className="text-yellow-400 shrink-0">·</span>
    <span className="text-white text-[13px] font-medium tracking-[0.15em] uppercase shrink-0">
      TRUSTED BY COLLECTORS
    </span>
    <span className="text-yellow-400 shrink-0">·</span>
  </>
);

export default function MarqueeStrip() {
  return (
    <section className="w-full bg-black overflow-hidden py-5">
      <div className="flex items-center whitespace-nowrap animate-marquee w-max gap-x-3">
        {phrase}
        {phrase}
        {phrase}
        {phrase}
      </div>
    </section>
  );
}
