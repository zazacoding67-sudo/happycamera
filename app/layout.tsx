import type { Metadata } from "next";
import NavbarWrapper from "@/components/layout/NavbarWrapper";
import SmoothScrolling from "@/components/layout/SmoothScrolling";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/ui/CartDrawer";
import WishlistDrawer from "@/components/ui/WishlistDrawer";
import AuthSessionProvider from "@/components/layout/AuthSessionProvider";
import { CartProvider } from "@/lib/CartContext";
import { WishlistProvider } from "@/lib/WishlistContext";
import PageTransition from "@/components/layout/PageTransition";
import { buildNavMenus } from "@/lib/nav";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Happy Camera",
  description: "Premium camera gear — new and preloved.",
  icons: { icon: "/favicon.svg" },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navMenus = await buildNavMenus();

  return (
    <html lang="en">
      <body>
        <AuthSessionProvider>
          <CartProvider>
            <WishlistProvider>
              <NavbarWrapper navMenus={navMenus} />
              <main className="min-h-screen pt-16">
                <SmoothScrolling>
                  <PageTransition>{children}</PageTransition>
                </SmoothScrolling>
              </main>
              <CartDrawer />
              <WishlistDrawer />
              <Footer />
            </WishlistProvider>
          </CartProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
