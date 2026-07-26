import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--color-text-secondary)]">
        Error 404
      </p>
      <h1 className="text-4xl font-bold tracking-tight text-[var(--color-text-primary)] mt-4">
        Page not found
      </h1>
      <p className="text-sm text-[var(--color-text-secondary)] mt-3 text-center max-w-sm">
        Looks like this frame is out of focus. Let&rsquo;get you back on track.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center justify-center px-6 py-3 text-sm font-medium tracking-wide bg-[#1A1A1A] text-white hover:bg-[#333] transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}
