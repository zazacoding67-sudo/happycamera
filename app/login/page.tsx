"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { AlertCircle, ArrowLeft } from "lucide-react";

function LoginContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  return (
    <div className="min-h-screen bg-white pt-16 flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <Link href="/" className="inline-block mb-8">
          <span className="text-xl font-bold tracking-tight text-zinc-900">
            Happy Camera
          </span>
        </Link>

        {error && (
          <div className="border border-red-100 bg-red-50 p-4 mb-6 text-left">
            <div className="flex items-start gap-2">
              <AlertCircle size={16} className="text-red-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-800">
                  Sign-in failed
                </p>
                <p className="text-xs text-red-600 mt-0.5">
                  {error === "OAuthCallback"
                    ? "We couldn't authenticate your account. Please try signing in again."
                    : error === "OAuthSignin"
                      ? "The sign-in request wasn't completed. Please try again."
                      : error === "OAuthAccountNotLinked"
                        ? "This email is already linked to another sign-in method."
                        : error === "AccessDenied"
                          ? "Sign-in was denied."
                          : "An unexpected error occurred. Please try again."}
                </p>
                {error === "OAuthCallback" && (
                  <p className="text-xs text-red-500 mt-1 font-mono">
                    If this persists, contact hello@happycamera.my
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <p className="text-sm text-zinc-500 mb-8 leading-relaxed">
          Sign in with your Google account to view your order history and saved items.
        </p>

        <button
          onClick={() => signIn("google", { callbackUrl })}
          className="w-full flex items-center justify-center gap-3 bg-zinc-900 text-white text-sm font-medium px-6 py-3.5 hover:opacity-90 transition-opacity rounded-none"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
            <path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
            <path fill="#fff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#fff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#fff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign in with Google
        </button>

        <div className="mt-6">
          <Link
            href={callbackUrl === "/" ? "/shop" : callbackUrl}
            className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            <ArrowLeft size={12} />
            Continue browsing
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white pt-16" />}>
      <LoginContent />
    </Suspense>
  );
}
