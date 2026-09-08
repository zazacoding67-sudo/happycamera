import { prisma } from "@/lib/prisma";

export const HOME_CATEGORIES = [
  { name: "Cameras", slug: "cameras" },
  { name: "Lenses", slug: "lenses" },
  { name: "Accessories", slug: "accessories" },
] as const;

export type HomeCategoryName = (typeof HOME_CATEGORIES)[number]["name"];

async function fetchCategory(slug: string) {
  const products = await prisma.product.findMany({
    where: { stockQuantity: { gt: 0 }, category: { slug } },
    take: 8,
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

export type HomepageProduct = Awaited<ReturnType<typeof fetchCategory>>[number];

export async function getHomepageProducts() {
  const entries = await Promise.all(
    HOME_CATEGORIES.map(async (cat) => [cat.name, await fetchCategory(cat.slug)] as const)
  );
  return Object.fromEntries(entries) as Record<HomeCategoryName, HomepageProduct[]>;
}