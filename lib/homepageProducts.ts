import { prisma } from "@/lib/prisma";

export const TEST_PRODUCT_NAMES = [
  "SmallRig Camera Cage",
  "UV Lens Filter 67mm",
  "Camera Battery Charger",
  "SD Memory Card 128GB",
  "Generic Teleconverter 1.4x",
  "Canon EF-RF Mount Adapter",
  "Tamron 18-300mm Zoom Lens",
  "Sigma 17-70mm Zoom Lens",
  "Fujifilm GFX Medium Format Camera",
  "Kodak Instant Camera",
  "Nikon ZR Cinema Camera",
  "Sony FX30 Cinema Camera",
] as const;

export async function getHomepageProducts() {
  const products = await prisma.product.findMany({
    where: {
      name: { notIn: [...TEST_PRODUCT_NAMES] },
      stockQuantity: { gt: 0 },
    },
    select: {
      id: true,
      slug: true,
      name: true,
      price: true,
      images: true,
      condition: true,
      conditionGrade: true,
      brand: true,
      stockQuantity: true,
      category: { select: { slug: true, name: true } },
      reviews: { where: { approved: true }, select: { rating: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return products.map((p) => {
    const avg =
      p.reviews.length > 0
        ? p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length
        : null;
    const { reviews: _reviews, ...rest } = p;
    return { ...rest, averageRating: avg };
  });
}

export type HomepageProduct = Awaited<ReturnType<typeof getHomepageProducts>>[number];
