import type { Metadata } from "next";
import { Inter, Space_Grotesk, Instrument_Serif } from "next/font/google";
import NavbarWrapper from "@/components/layout/NavbarWrapper";
import AppChrome from "@/components/layout/AppChrome";
import AuthSessionProvider from "@/components/layout/AuthSessionProvider";
import { CartProvider } from "@/lib/CartContext";
import { WishlistProvider } from "@/lib/WishlistContext";
import { CheckoutProvider } from "@/lib/CheckoutContext";
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
  description: "Premium camera gear — new and preloved. Film cameras, digital bodies, lenses, bags and dry boxes in Malaysia.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://happycamera.com.my"),
  icons: { icon: "/favicon.jpg?v=2" },
  verification: {
    google: "HREYyQtXdFsPIJdlXEPp4rj-6LJYx1CmibLfWK7yeko",
  },
  openGraph: {
    type: "website",
    siteName: "Happy Camera",
    title: "Happy Camera",
    description: "Premium camera gear — new and preloved. Film cameras, digital bodies, lenses, bags and dry boxes in Malaysia.",
    url: "/",
    locale: "en_MY",
    images: [
      {
        url: "/images/hero-main-camera.png",
        width: 1695,
        height: 928,
        alt: "Happy Camera",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Happy Camera",
    description: "Premium camera gear — new and preloved.",
    images: ["/images/hero-main-camera.png"],
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
              <CheckoutProvider>
                <NavbarWrapper navMenus={navMenus} />
                <AppChrome>{children}</AppChrome>
              </CheckoutProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
