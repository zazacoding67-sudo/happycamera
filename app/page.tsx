import { prisma } from "@/lib/prisma";
import TheWorld from "@/components/home/TheWorld";
import BrandEthos from "@/components/home/BrandEthos";
import HeroProduct from "@/components/home/HeroProduct";
import TrustSignals from "@/components/home/TrustSignals";
import ConditionFilterSection from "@/components/home/ConditionFilterSection";
import MarqueeStrip from "@/components/home/MarqueeStrip";
import ClosingCTA from "@/components/home/ClosingCTA";

export default async function HomePage() {
  const x100vi = await prisma.product.findFirst({
    where: { slug: "fujifilm-x100vi" },
  });

  return (
    <>
      <TheWorld />

      <BrandEthos />

      {x100vi && (
        <HeroProduct
          headline="The X100VI"
          subtitle="Fujifilm's sixth-generation rangefinder"
          body="Half a century of rangefinder heritage in a body you can carry in one hand. The X100VI doesn't chase spec sheets — it rewards patience, forces intention, and turns every walk into a possible frame. This is the camera you reach for when the moment matters more than the settings."
          specs={[
            { label: "Sensor", value: "40.2MP APS-C X-Trans 5" },
            { label: "Lens", value: "23mm f/2 (35mm equiv.)" },
            { label: "ISO Range", value: "125–12800" },
            { label: "Weight", value: "521g" },
            { label: "Viewfinder", value: "Hybrid optical/electronic" },
          ]}
          price={x100vi.price}
          condition={x100vi.condition as "new" | "preloved"}
          image={x100vi.images[0] || ""}
          slug={x100vi.slug}
        />
      )}

      <TrustSignals />

      <ConditionFilterSection />

      <MarqueeStrip />

      <ClosingCTA />
    </>
  );
}
