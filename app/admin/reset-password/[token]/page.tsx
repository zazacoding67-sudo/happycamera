"use client";

import { useState, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Camera, Eye, EyeOff, ArrowLeft } from "lucide-react";

export default function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong.");
      } else {
        setSuccess(true);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8F7F4]">
        <header className="sticky top-0 z-30 bg-yellow-400 h-14 flex items-center px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Camera size={18} className="text-black" />
            <span className="text-sm font-bold tracking-tight text-black">
              Happy Camera
            </span>
          </Link>
        </header>
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="w-full max-w-sm">
            <h1 className="text-lg font-bold tracking-tight text-[#1A1A1A]">
              Password reset
            </h1>
            <p className="mt-2 text-sm text-[#6B6B6B] leading-relaxed">
              Your password has been updated. You can now sign in with your new
              password.
            </p>
            <Link
              href="/admin/login"
              className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-yellow-600 hover:text-yellow-700 transition-colors"
            >
              <ArrowLeft size={14} />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

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

          <h1 className="text-lg font-bold tracking-tight text-[#1A1A1A]">
            Set new password
          </h1>
          <p className="mt-1 text-sm text-[#6B6B6B]">
            Choose a new password for your admin account.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
            <div>
              <label
                htmlFor="password"
                className="text-[11px] font-semibold uppercase tracking-widest text-[#6B6B6B]"
              >
                New password
              </label>
              <div className="relative mt-1.5">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-[#E5E3DE] bg-white px-3 py-2.5 text-sm outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-colors rounded-none pr-10"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#666] hover:text-black transition-colors"
                >
                  {showPassword ? <EyeOff size={18} className="text-[#666]" /> : <Eye size={18} className="text-[#666]" />}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirm"
                className="text-[11px] font-semibold uppercase tracking-widest text-[#6B6B6B]"
              >
                Confirm password
              </label>
              <div className="relative mt-1.5">
                <input
                  id="confirm"
                  type={showConfirm ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full border border-[#E5E3DE] bg-white px-3 py-2.5 text-sm outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-colors rounded-none pr-10"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                  aria-pressed={showConfirm}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#666] hover:text-black transition-colors"
                >
                  {showConfirm ? <EyeOff size={18} className="text-[#666]" /> : <Eye size={18} className="text-[#666]" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-yellow-400 text-black text-sm font-semibold py-3 tracking-wide hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-none"
            >
              {submitting ? "Resetting..." : "Reset password"}
            </button>
          </form>

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
