import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ui/ProductCard";
import FilterSidebar from "@/components/shop/FilterSidebar";
import SortSelect from "@/components/shop/SortSelect";
import CategoryHero from "@/components/shop/CategoryHero";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop All Gear — Happy Camera",
  description: "Browse our curated collection of new and preloved film cameras, lenses, and accessories.",
};

type ShopParams = {
  q?: string;
  minPrice?: string;
  maxPrice?: string;
  brand?: string;
  condition?: string;
  category?: string;
  sort?: string;
};

const categoryPills = [
  { label: "Digital Bodies", slug: "digital-bodies" },
  { label: "Mirrorless", slug: "mirrorless" },
  { label: "DSLR", slug: "dslr" },
  { label: "Lenses", slug: "lenses" },
  { label: "Accessories", slug: "accessories" },
  { label: "Dry Box", slug: "dry-box" },
  { label: "Bag", slug: "bag" },
];

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<ShopParams>;
}) {
  const { q, minPrice, maxPrice, brand, condition, category, sort } = await searchParams;

  const where: Record<string, unknown> = {};

  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { category: { name: { contains: q, mode: "insensitive" } } },
    ];
  }

  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) (where.price as Record<string, unknown>).gte = parseFloat(minPrice);
    if (maxPrice) (where.price as Record<string, unknown>).lte = parseFloat(maxPrice);
  }

  if (brand) {
    where.brand = { in: brand.split(",") };
  }

  if (condition) {
    where.condition = { in: condition.split(",") };
  }

  const CAMERA_CATEGORY_SLUGS = ["dslr", "mirrorless", "digital-bodies", "lenses", "accessories"];

  let categoryData = null;
  if (category === "cameras") {
    where.category = { slug: { in: CAMERA_CATEGORY_SLUGS } };
  } else if (category) {
    categoryData = await prisma.category.findUnique({ where: { slug: category } });
    if (categoryData) where.categoryId = categoryData.id;
  }

  const orderBy: Record<string, string> | undefined =
    sort === "price-asc" ? { price: "asc" }
    : sort === "price-desc" ? { price: "desc" }
    : sort === "newest" ? { createdAt: "desc" }
    : undefined;

  const [products, allProducts] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      include: { category: { select: { slug: true, name: true } } },
    }),
    prisma.product.findMany({ select: { brand: true } }),
  ]);

  const brands = [...new Set(allProducts.map((p) => p.brand))].sort();
  const searchQuery = q || "";
  const resultCount = products.length;

  const categoryVideoMap: Record<string, string | string[]> = {
    "mirrorless": "digital.mp4",
    "digital-bodies": "film.mp4",
    "lenses": "lens.mp4",
    "bag": "bag.mp4",
    "accessories": "accesories.mp4",
    "cameras": ["digital.mp4", "film.mp4", "lens.mp4", "accesories.mp4"],
    "dslr": "dslr.mp4",
  };

  const isVirtualCategory = category === "cameras";

  const heroTitle = isVirtualCategory
    ? "Cameras"
    : categoryData
      ? categoryData.name
      : category === "dslr"
        ? "DSLR"
        : searchQuery || "All Gear";

  const heroDescription = isVirtualCategory
    ? "Digital and film bodies, lenses, and accessories for every shooter."
    : categoryData
      ? categoryData.description || null
      : searchQuery
        ? null
        : "Explore our curated selection of new and pre-loved camera equipment, from classic film bodies to modern digital systems.";

  const heroVideoFilenames = category ? (categoryVideoMap[category] ?? null) : null;

  return (
    <div className="bg-white min-h-screen">
      <div className="mb-12 md:mb-16">
        <CategoryHero
          title={heroTitle}
          description={heroDescription}
          videoFilenames={heroVideoFilenames}
          playbackRate={category === "lenses" ? 0.8 : 1}
        />
      </div>
    <div className="w-full px-8">

      <div className="flex gap-2 flex-wrap mb-8">
        {categoryPills.map((pill) => (
          <a
            key={pill.slug}
            href={`/shop?category=${pill.slug}`}
            className="border border-gray-300 rounded-full px-4 py-1.5 text-[13px] text-gray-600 hover:text-yellow-700 hover:border-yellow-400 transition-colors"
          >
            {pill.label}
          </a>
        ))}
      </div>

      <div className="flex gap-10">
        <aside className="w-72 shrink-0 hidden md:block">
          <FilterSidebar brands={brands} />
        </aside>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-end mb-6 gap-4">
            <span className="text-[11px] text-[#999] uppercase tracking-[0.1em] font-medium">
              {resultCount} product(s)
            </span>
            <form method="GET" action="/shop">
              {q && <input type="hidden" name="q" value={q} />}
              {category && <input type="hidden" name="category" value={category} />}
              {condition && <input type="hidden" name="condition" value={condition} />}
              {brand && <input type="hidden" name="brand" value={brand} />}
              {minPrice && <input type="hidden" name="minPrice" value={minPrice} />}
              {maxPrice && <input type="hidden" name="maxPrice" value={maxPrice} />}
              <SortSelect defaultValue={sort} />
            </form>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10">
            {products.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-32 text-center">
                <p className="text-[10px] tracking-[0.25em] uppercase text-[#999] mb-3">No results</p>
                <p className="text-[15px] font-medium text-[#1A1A1A] mb-1">
                  {searchQuery ? `Nothing found for "${searchQuery}"` : "No products match your filters."}
                </p>
                <p className="text-[12px] text-[#999]">Try a different keyword or browse by category</p>
              </div>
            ) : (
              products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  slug={product.slug}
                  name={product.name}
                  brand={product.brand}
                  price={product.price}
                  condition={product.condition as "new" | "preloved"}
                  images={product.images}
                  categorySlug={product.category?.slug}
                  categoryName={product.category?.name}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
