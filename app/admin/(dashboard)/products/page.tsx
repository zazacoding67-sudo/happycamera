import { prisma } from "@/lib/prisma";
import ProductsClient from "./ProductsClient";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  const serialized = products.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    brand: p.brand,
    price: p.price,
    originalPrice: p.originalPrice,
    condition: p.condition,
    stockQuantity: p.stockQuantity,
    images: p.images,
    categoryId: p.categoryId,
    categoryName: p.category.name,
  }));

  return <ProductsClient products={serialized} />;
}