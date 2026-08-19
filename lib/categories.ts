export const CATEGORY_SUBCATEGORIES: Record<string, readonly string[]> = {
  Cameras: ["Mirrorless", "Compact", "DSLR", "Cinema", "Instant", "Film", "Medium Format"],
  Lenses: ["Zoom", "Mount Adapters", "Prime", "Teleconverters"],
  Accessories: [
    "Batteries Chargers and Grips",
    "Flashes",
    "Lens Filters",
    "Memory Cards",
    "Handles",
    "Bags",
    "Others",
  ],
};

export const CATEGORY_NAV_LABELS: Record<string, string> = {
  Cameras: "Cameras",
  Lenses: "Lenses",
  Accessories: "Camera Accessories",
};

export const CATEGORY_ORDER: readonly string[] = ["Cameras", "Lenses", "Accessories"];

export function isValidSubcategory(category: string, subcategory: string): boolean {
  const list = CATEGORY_SUBCATEGORIES[category];
  if (!list) return false;
  const needle = subcategory.trim().toLowerCase();
  return list.some((s) => s.toLowerCase() === needle);
}
