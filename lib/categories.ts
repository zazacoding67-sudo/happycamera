export const CATEGORY_SUBCATEGORIES: Record<string, readonly string[]> = {
  Cameras: ["Mirrorless", "Compact", "DSLR", "Cinema", "Instant", "Medium Format"],
  Lenses: ["Zoom", "Mount Adapters", "Prime", "Teleconverters"],
  Accessories: [
    "Batteries Chargers and Grips",
    "Flashes",
    "Lens Filters",
    "Memory Cards",
    "Handles",
    "Bags",
    "Dry Box",
    "Others",
  ],
};

export const CATEGORY_NAV_LABELS: Record<string, string> = {
  Cameras: "Cameras",
  Lenses: "Lenses",
  Accessories: "Camera Accessories",
};

export const CATEGORY_ORDER: readonly string[] = ["Cameras", "Lenses", "Accessories"];

export function sortCategoriesByOrder<T extends { name: string }>(categories: T[]): T[] {
  const rank = new Map<string, number>();
  CATEGORY_ORDER.forEach((name, i) => rank.set(name, i));
  return [...categories].sort(
    (a, b) => (rank.get(a.name) ?? 99) - (rank.get(b.name) ?? 99) || a.name.localeCompare(b.name)
  );
}

export function isValidSubcategory(category: string, subcategory: string): boolean {
  const list = CATEGORY_SUBCATEGORIES[category];
  if (!list) return false;
  const needle = subcategory.trim().toLowerCase();
  return list.some((s) => s.toLowerCase() === needle);
}
