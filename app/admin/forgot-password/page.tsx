"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { Camera, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Something went wrong.");
      } else {
        setSent(true);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F7F4]">
      <header className="sticky top-0 z-30 bg-yellow-400 h-14 flex items-center px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Camera size={18} className="text-black" />
          <span className="text-sm font-bold tracking-tight text-black">
            Happy Camera
          </span>
        </Link>
        <div className="ml-auto">
          <Link
            href="/admin/login"
            className="text-xs font-medium text-black/60 hover:text-black transition-colors"
          >
            Back to Login
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2 mb-6">
            <Link
              href="/admin/login"
              className="text-xs text-[#6B6B6B] hover:text-[#1A1A1A] flex items-center gap-1 transition-colors"
            >
              <ArrowLeft size={14} />
              Login
            </Link>
          </div>

          {sent ? (
            <div>
              <h1 className="text-lg font-bold tracking-tight text-[#1A1A1A]">
                Check your email
              </h1>
              <p className="mt-2 text-sm text-[#6B6B6B] leading-relaxed">
                If an account exists for that email, we&rsquo;ve sent a reset
                link. It expires in 1 hour.
              </p>
            </div>
          ) : (
            <>
              <h1 className="text-lg font-bold tracking-tight text-[#1A1A1A]">
                Reset password
              </h1>
              <p className="mt-1 text-sm text-[#6B6B6B]">
                Enter your admin email and we&rsquo;ll send a reset link.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
                <div>
                  <label
                    htmlFor="email"
                    className="text-[11px] font-semibold uppercase tracking-widest text-[#6B6B6B]"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1.5 w-full border border-[#E5E3DE] bg-white px-3 py-2.5 text-sm outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-colors rounded-none"
                    required
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-500">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-yellow-400 text-black text-sm font-semibold py-3 tracking-wide hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-none"
                >
                  {submitting ? "Sending..." : "Send reset link"}
                </button>
              </form>
            </>
          )}

          <div className="mt-8 pt-6 border-t border-[#E5E3DE]">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[#6B6B6B]">
              Happy Camera Admin
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
