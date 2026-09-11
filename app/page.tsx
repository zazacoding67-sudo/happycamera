import { getHomepageProducts } from "@/lib/homepageProducts";
import { getNewArrivals } from "@/lib/newArrivals";
import HeroCarousel from "@/components/home/HeroCarousel";
import HomepageProductGrid from "@/components/home/HomepageProductGrid";
import TrustSignals from "@/components/home/TrustSignals";
import FeaturedProductSpotlight from "@/components/home/FeaturedProductSpotlight";
import NewArrivals from "@/components/home/NewArrivals";
import MarqueeStrip from "@/components/home/MarqueeStrip";
import ClosingCTA from "@/components/home/ClosingCTA";

export default async function HomePage() {
  const homepageProducts = await getHomepageProducts();
  const newArrivals = await getNewArrivals(6);

  console.log(
    `[homepage] Cameras ${homepageProducts.Cameras.length} / Lenses ${homepageProducts.Lenses.length} / Accessories ${homepageProducts.Accessories.length} products for grid`
  );
  console.log(`[homepage] ${newArrivals.length} new arrivals`);

  return (
    <>
      <HeroCarousel />

      <HomepageProductGrid products={homepageProducts} />

      <TrustSignals />

      <FeaturedProductSpotlight
        title="SONY A7 MARK V MIRRORLESS CAMERA"
        mainImage="/images/hero-main-camera.png"
        ctaLabel="Shop Now"
        ctaLink="/shop"
      />

      <NewArrivals products={newArrivals} />

      <MarqueeStrip />

      <ClosingCTA />
    </>
  );
}
