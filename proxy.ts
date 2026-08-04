import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function proxy(req) {
    const { pathname, searchParams } = req.nextUrl;
    const error = searchParams.get("error");

    if (pathname === "/api/auth/signin" && error && error.startsWith("OAuth")) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.searchParams.set("error", error);
      const callbackUrl = req.cookies.get("next-auth.callback-url")?.value;
      if (callbackUrl) loginUrl.searchParams.set("callbackUrl", callbackUrl);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  },
  {
    pages: {
      signIn: "/admin/login",
    },
    callbacks: {
      authorized({ req, token }) {
        const path = req.nextUrl.pathname;
        if (path.startsWith("/api/auth")) return true;
        if (
          path === "/admin/login" ||
          path.startsWith("/admin/forgot-password") ||
          path.startsWith("/admin/reset-password")
        ) {
          return true;
        }
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/api/auth/:path*"],
};
