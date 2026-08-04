import { prisma } from "@/lib/prisma";
import WishlistClient from "./WishlistClient";

export default async function WishlistPage() {
  const products = await prisma.product.findMany();

  return (
    <div className="min-h-screen bg-white pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="max-w-2xl mb-12">
          <span className="text-[11px] tracking-[0.25em] uppercase text-yellow-500 font-medium">
            Your Collection
          </span>
          <h1 className="text-3xl md:text-4xl font-light tracking-tight text-zinc-900 leading-tight mt-4">
            Everything you&rsquo;re saving, in one place.
          </h1>
          <p className="text-sm text-zinc-400 mt-3 leading-relaxed max-w-md">
            Your personal edit of the catalogue — curate the gear that matters to you.
          </p>
        </div>

        <WishlistClient
          allProducts={products.map((p) => ({
            id: p.id,
            slug: p.slug,
            name: p.name,
            brand: p.brand,
            price: p.price,
            condition: p.condition as "new" | "preloved",
            images: p.images,
            stockQuantity: p.stockQuantity,
          }))}
        />
      </div>
    </div>
  );
}
