import { prisma } from "@/lib/prisma";
import { normalizeBrand } from "@/lib/brand";
import FilterSidebar from "@/components/shop/FilterSidebar";
import MobileFilter from "@/components/shop/MobileFilter";
import ProductsGrid from "@/components/shop/ProductsGrid";
import SortSelect from "@/components/shop/SortSelect";
import CategoryHero from "@/components/shop/CategoryHero";
import ShopHero from "@/components/shop/ShopHero";
import type { Metadata } from "next";

export const revalidate = 60;

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
  subcategory?: string;
  sort?: string;
};

const categoryPills = [
  { label: "Cameras", slug: "cameras" },
  { label: "Lenses", slug: "lenses" },
  { label: "Accessories", slug: "accessories" },
];

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<ShopParams>;
}) {
  const { q, minPrice, maxPrice, brand, condition, category, subcategory, sort } = await searchParams;

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
    const and = Array.isArray(where.AND) ? (where.AND as unknown[]) : [];
    where.AND = [
      ...and,
      {
        OR: brand.split(",").map((b) => ({
          brand: { equals: b.trim(), mode: "insensitive" },
        })),
      },
    ];
  }

  if (condition) {
    where.condition = { in: condition.split(",") };
  }

  const CAMERA_CATEGORY_SLUGS = ["cameras", "lenses", "accessories"];

  let categoryData = null;
  if (category) {
    const slug = category.trim().toLowerCase();
    if (CAMERA_CATEGORY_SLUGS.includes(slug)) {
      categoryData = await prisma.category.findFirst({
        where: { OR: [{ slug }, { name: { equals: category.trim(), mode: "insensitive" } }] },
      });
      if (categoryData) where.categoryId = categoryData.id;
    }
  }

  if (subcategory) {
    where.subcategory = { equals: subcategory.trim(), mode: "insensitive" };
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
      include: {
        category: { select: { slug: true, name: true } },
        reviews: {
          where: { approved: true },
          select: { id: true, customerName: true, rating: true, comment: true, createdAt: true },
        },
      },
    }),
    prisma.product.findMany({ select: { brand: true } }),
  ]);

  const brandMap = new Map<string, string>();
  for (const p of allProducts) {
    const key = p.brand.trim().toLowerCase();
    if (!brandMap.has(key)) brandMap.set(key, normalizeBrand(p.brand));
  }
  const brands = [...brandMap.values()].sort();
  const searchQuery = q || "";
  const resultCount = products.length;
  const gridKey = [q ?? "", category ?? "", brand ?? "", condition ?? "", minPrice ?? "", maxPrice ?? "", subcategory ?? "", sort ?? ""].join("|");

  const categoryVideoMap: Record<string, string | string[]> = {
    "cameras": ["digital.mp4", "film.mp4"],
    "lenses": "lens.mp4",
    "accessories": "accesories.mp4",
  };

  const categoryKey = category?.trim().toLowerCase() ?? "";

  const heroTitle = categoryData
    ? categoryData.name
    : subcategory
      ? subcategory.trim()
      : searchQuery || "All Gear";

  const heroDescription = categoryData
    ? categoryData.description || null
    : searchQuery
      ? null
      : subcategory
        ? null
        : "Explore our curated selection of new and pre-loved camera equipment, from classic film bodies to modern digital systems.";

  const heroVideoFilenames = categoryData ? (categoryVideoMap[categoryKey] ?? null) : null;

  return (
    <div className="bg-white min-h-screen">
      <div className="mb-12 md:mb-16">
        {!categoryData && !subcategory && !searchQuery ? (
          <ShopHero productCount={resultCount} />
        ) : (
          <CategoryHero
            title={heroTitle}
            description={heroDescription}
            videoFilenames={heroVideoFilenames}
            playbackRate={categoryKey === "lenses" ? 0.8 : 1}
          />
        )}
      </div>
    <div className="w-full px-8 pb-24 md:pb-32">

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
          <div className="mb-6 flex flex-col items-stretch gap-3 md:flex-row md:items-center md:justify-end md:gap-4">
            <MobileFilter brands={brands} resultCount={resultCount} className="self-start md:self-auto" />
            <div className="flex items-center justify-between gap-4 md:justify-end">
            <span className="text-[11px] text-[#999] uppercase tracking-[0.1em] font-medium">
              {resultCount} product(s)
            </span>
            <form method="GET" action="/shop">
              {q && <input type="hidden" name="q" value={q} />}
              {category && <input type="hidden" name="category" value={category} />}
              {subcategory && <input type="hidden" name="subcategory" value={subcategory} />}
              {condition && <input type="hidden" name="condition" value={condition} />}
              {brand && <input type="hidden" name="brand" value={brand} />}
              {minPrice && <input type="hidden" name="minPrice" value={minPrice} />}
              {maxPrice && <input type="hidden" name="maxPrice" value={maxPrice} />}
              <SortSelect defaultValue={sort} />
            </form>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <p className="text-[10px] tracking-[0.25em] uppercase text-[#999] mb-3">No results</p>
              <p className="text-[15px] font-medium text-[#1A1A1A] mb-1">
                {searchQuery ? `Nothing found for "${searchQuery}"` : "No products match your filters."}
              </p>
              <p className="text-[12px] text-[#999]">Try a different keyword or browse by category</p>
            </div>
          ) : (
            <ProductsGrid
              key={gridKey}
              products={products.map((product) => ({
                id: product.id,
                slug: product.slug,
                name: product.name,
                brand: product.brand,
                price: product.price,
                originalPrice: product.originalPrice,
                condition: product.condition as "new" | "preloved",
                images: product.images,
                stockQuantity: product.stockQuantity,
                categorySlug: product.category?.slug,
                categoryName: product.category?.name,
                reviews: product.reviews.map((r) => ({
                  ...r,
                  createdAt: r.createdAt.toISOString(),
                })),
              }))}
            />
          )}
        </div>
      </div>
    </div>
    </div>
  );
}
