import { prisma } from "@/lib/prisma";
import { CATEGORY_NAV_LABELS, CATEGORY_ORDER, CATEGORY_SUBCATEGORIES } from "@/lib/categories";
import type { MegaMenuItem } from "@/lib/navigation";

export async function buildNavMenus(): Promise<MegaMenuItem[]> {
  const products = await prisma.product.findMany({
    where: { stockQuantity: { gt: 0 } },
    select: {
      subcategory: true,
      images: true,
      category: { select: { name: true, slug: true } },
    },
  });

  const byCategory = new Map<string, Map<string, string>>();

  for (const p of products) {
    const categoryName = p.category?.name;
    const sub = p.subcategory?.trim();
    if (!categoryName || !sub) continue;
    const valid = CATEGORY_SUBCATEGORIES[categoryName];
    if (!valid || !valid.some((s) => s.toLowerCase() === sub.toLowerCase())) continue;

    let subMap = byCategory.get(categoryName);
    if (!subMap) {
      subMap = new Map();
      byCategory.set(categoryName, subMap);
    }
    if (!subMap.has(sub) && p.images[0]) subMap.set(sub, p.images[0]);
  }

  const menus: MegaMenuItem[] = [];

  for (const categoryName of CATEGORY_ORDER) {
    const subMap = byCategory.get(categoryName);
    const validList = CATEGORY_SUBCATEGORIES[categoryName] ?? [];
    const subcategories = validList
      .filter((sub) => subMap?.has(sub))
      .map((sub) => ({
        name: sub,
        path: `/shop?category=${encodeURIComponent(categoryName)}&subcategory=${encodeURIComponent(sub)}`,
        image: subMap?.get(sub) ?? "",
        title: sub,
      }));

    if (subcategories.length === 0) continue;

    menus.push({
      name: CATEGORY_NAV_LABELS[categoryName] ?? categoryName,
      path: categoryName === "Cameras" ? "/shop" : `/shop?category=${encodeURIComponent(categoryName)}`,
      subcategories,
      shopAll: {
        path: `/shop?category=${encodeURIComponent(categoryName)}`,
        image: subcategories[0].image,
        title: `Shop All ${categoryName}`,
      },
    });
  }

  return menus;
}
