import { getHomepageProducts } from "@/lib/homepageProducts";
import HeroBanner from "@/components/home/HeroBanner";
import HomepageProductGrid from "@/components/home/HomepageProductGrid";
import TrustSignals from "@/components/home/TrustSignals";
import CategoryGrid from "@/components/home/CategoryGrid";
import MarqueeStrip from "@/components/home/MarqueeStrip";
import ClosingCTA from "@/components/home/ClosingCTA";

const X100VI_IMAGE = "https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=800&q=80";

export default async function HomePage() {
  const homepageProducts = await getHomepageProducts();

  console.log(`[homepage] ${homepageProducts.length} products for grid`);

  return (
    <>
      <HeroBanner image={X100VI_IMAGE} />

      <HomepageProductGrid products={homepageProducts} />

      <TrustSignals />

      <CategoryGrid />

      <MarqueeStrip />

      <ClosingCTA />
    </>
  );
}
