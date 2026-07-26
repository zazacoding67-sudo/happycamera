import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AddToCartButton from "@/components/ui/AddToCartButton";
import Gallery from "@/components/ui/Gallery";
import ReviewSection from "@/components/ui/ReviewSection";
import StickyAddToCart from "@/components/ui/StickyAddToCart";
import ProductCard from "@/components/ui/ProductCard";
import { formatPrice } from "@/lib/format";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) return { title: "Product Not Found" };
  return {
    title: `${product.name} — Happy Camera`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 160),
      images: product.images[0] ? [{ url: product.images[0] }] : [],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      reviews: { where: { approved: true }, orderBy: { createdAt: "desc" } },
    },
  });

  if (!product) notFound();

  const relatedProducts = product.categoryId
    ? await prisma.product.findMany({
        where: {
          categoryId: product.categoryId,
          id: { not: product.id },
        },
        take: 4,
      })
    : [];

  const cartProduct = {
    id: product.id,
    slug: product.slug,
    name: product.name,
    brand: product.brand,
    price: product.price,
    condition: product.condition as "new" | "preloved",
    images: product.images,
  };

  const inStock = product.stockQuantity > 0;
  const lowStock = product.stockQuantity > 0 && product.stockQuantity <= 3;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    brand: { "@type": "Brand", name: product.brand },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "MYR",
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {inStock && <StickyAddToCart product={cartProduct} />}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:pb-12 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <Gallery images={product.images} name={product.name} />

          <div className="flex flex-col">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#888]">
              {product.brand}
            </p>
            <h1 className="text-2xl font-bold text-black mt-2">
              {product.name}
            </h1>
            <p className="text-2xl font-semibold text-black mt-4">
              {formatPrice(product.price)}
            </p>

            <div className="flex flex-row gap-2 mt-3">
              {!inStock && (
                <span className="border border-red-500 text-red-600 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                  OUT OF STOCK
                </span>
              )}
              {product.stockQuantity === 1 && inStock && (
                <span className="border border-red-500 text-red-600 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                  ONLY 1 LEFT
                </span>
              )}
              <span className="bg-yellow-400 text-black text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                {product.condition === "new" ? "NEW" : "PRELOVED"}
              </span>
            </div>

            <p className="text-base text-gray-500 mt-6">
              {product.description}
            </p>

            <div className="mt-8 flex flex-col gap-3">
              {inStock && <AddToCartButton product={cartProduct} />}
            </div>

            <div className="mt-8">
              <div className="flex justify-between py-4 border-b border-[#E5E5E5]">
                <span className="text-base font-medium text-black">Condition</span>
                <span className="text-base font-medium text-black">
                  {product.condition === "new" ? "New" : "Preloved"}
                </span>
              </div>
              {product.includedAccessories && product.includedAccessories.length > 0 && (
                <div className="flex justify-between py-4 border-b border-[#E5E5E5]">
                  <span className="text-base font-medium text-black">Includes</span>
                  <ul className="text-base text-gray-500 text-right">
                    {product.includedAccessories.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="flex justify-between py-4 border-b border-[#E5E5E5]">
                <span className="text-base font-medium text-black">Warranty</span>
                <span className="text-base font-medium text-black">
                  {product.warranty || "6-month warranty on all products."}
                </span>
              </div>
            </div>
          </div>
        </div>

        <ReviewSection
          productId={product.id}
          reviews={product.reviews.map((r) => ({
            id: r.id,
            customerName: r.customerName,
            rating: r.rating,
            comment: r.comment,
            createdAt: r.createdAt.toISOString(),
          }))}
        />

        {relatedProducts.length > 0 && (
          <section className="mt-12 pt-10 border-t border-[var(--color-border)]">
            <h2 className="text-lg font-bold tracking-tight text-[var(--color-text-primary)] mb-6">
              You Might Also Like
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  slug={p.slug}
                  name={p.name}
                  brand={p.brand}
                  price={p.price}
                  condition={p.condition as "new" | "preloved"}
                  images={p.images}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
