import type { Metadata } from "next";
import { Inter, Space_Grotesk, Instrument_Serif } from "next/font/google";
import NavbarWrapper from "@/components/layout/NavbarWrapper";
import AppChrome from "@/components/layout/AppChrome";
import AuthSessionProvider from "@/components/layout/AuthSessionProvider";
import { CartProvider } from "@/lib/CartContext";
import { WishlistProvider } from "@/lib/WishlistContext";
import { buildNavMenus } from "@/lib/nav";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Happy Camera",
  description: "Premium camera gear — new and preloved.",
  icons: { icon: "/favicon.jpg?v=2" },
  verification: {
    google: "HREYyQtXdFsPIJdlXEPp4rj-6LJYx1CmibLfWK7yeko",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navMenus = buildNavMenus();

  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${instrumentSerif.variable}`}>
      <body className={inter.className}>
        <AuthSessionProvider>
          <CartProvider>
            <WishlistProvider>
              <NavbarWrapper navMenus={navMenus} />
              <AppChrome>{children}</AppChrome>
            </WishlistProvider>
          </CartProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
