import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    authorized({ req, token }) {
      const path = req.nextUrl.pathname;
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
});

export const config = {
  matcher: ["/admin/:path*"],
};
