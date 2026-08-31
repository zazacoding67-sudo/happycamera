"use client";

import { usePathname } from "next/navigation";
import SmoothScrolling from "@/components/layout/SmoothScrolling";
import PageTransition from "@/components/layout/PageTransition";
import CartDrawer from "@/components/ui/CartDrawer";
import WishlistDrawer from "@/components/ui/WishlistDrawer";
import Footer from "@/components/layout/Footer";

export default function AppChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <>
      <main className="min-h-screen pt-20">
        <SmoothScrolling>
          <PageTransition>{children}</PageTransition>
        </SmoothScrolling>
      </main>
      <CartDrawer />
      <WishlistDrawer />
      <Footer />
    </>
  );
}
