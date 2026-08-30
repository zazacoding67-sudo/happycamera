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

  console.log(`[homepage] ${homepageProducts.length} products for grid`);
  console.log(`[homepage] ${newArrivals.length} new arrivals`);

  return (
    <>
      <HeroCarousel />

      <HomepageProductGrid products={homepageProducts} />

      <TrustSignals />

      <FeaturedProductSpotlight
        title="SONY ALPHA 7 V MIRRORLESS DIGITAL CAMERA"
        mainImage="/images/hero-main-camera.png"
        ctaLabel="Shop Now"
        ctaLink="/product/sony-alpha-a7c-ii"
      />

      <NewArrivals products={newArrivals} />

      <MarqueeStrip />

      <ClosingCTA />
    </>
  );
}
