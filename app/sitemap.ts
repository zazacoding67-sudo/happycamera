import { prisma } from "@/lib/prisma";
import type { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://happycamera.com.my";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await prisma.product.findMany({
    select: { slug: true, updatedAt: true },
    orderBy: { slug: "asc" },
  });

  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}/product/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    { url: `${baseUrl}/`, changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/shop`, changeFrequency: "hourly", priority: 0.9 },
    { url: `${baseUrl}/wishlist`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/track`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/story`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${baseUrl}/terms`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${baseUrl}/returns`, changeFrequency: "yearly", priority: 0.3 },
    ...productPages,
  ];
}