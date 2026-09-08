import { prisma } from "@/lib/prisma";
import { TEST_PRODUCT_NAMES } from "@/lib/testProducts";

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
      originalPrice: true,
      images: true,
      condition: true,
      conditionGrade: true,
      brand: true,
      stockQuantity: true,
      createdAt: true,
      category: { select: { slug: true, name: true } },
      reviews: {
        where: { approved: true },
        select: { id: true, customerName: true, rating: true, comment: true, createdAt: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return products.map((p) => {
    const avg =
      p.reviews.length > 0
        ? p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length
        : null;
    const reviews = p.reviews.map((r) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
    }));
    const { reviews: _prismaReviews, ...rest } = p;
    return { ...rest, createdAt: p.createdAt.toISOString(), averageRating: avg, reviews };
  });
}

export type HomepageProduct = Awaited<ReturnType<typeof getHomepageProducts>>[number];
