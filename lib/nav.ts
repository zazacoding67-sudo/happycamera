import { CATEGORY_NAV_LABELS, CATEGORY_ORDER, CATEGORY_SUBCATEGORIES } from "@/lib/categories";
import type { MegaMenuItem } from "@/lib/navigation";

export function buildNavMenus(): MegaMenuItem[] {
  const menus: MegaMenuItem[] = [];

  for (const categoryName of CATEGORY_ORDER) {
    const subcategories = (CATEGORY_SUBCATEGORIES[categoryName] ?? []).map((sub) => ({
      name: sub,
      path: `/shop?category=${encodeURIComponent(categoryName)}&subcategory=${encodeURIComponent(sub)}`,
      title: sub,
    }));

    menus.push({
      name: CATEGORY_NAV_LABELS[categoryName] ?? categoryName,
      category: categoryName,
      path: categoryName === "Cameras" ? "/shop" : `/shop?category=${encodeURIComponent(categoryName)}`,
      subcategories,
      shopAll: {
        path: `/shop?category=${encodeURIComponent(categoryName)}`,
        title: `Shop All ${categoryName}`,
      },
    });
  }

  return menus;
}
