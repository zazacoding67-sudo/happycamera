export const MEGA_MENU_IMAGES: Record<string, Record<string, string>> = {
  Cameras: {
    "Mirrorless": "/images/mega-menu/mega-mirrorless.webp",
    "Compact": "/images/mega-menu/mega-rx100.webp",
    "DSLR": "/images/mega-menu/mega-dslr.webp",
    "Cinema": "/images/mega-menu/mega-fx5.webp",
    "Instant": "/images/mega-menu/mega-instant.webp",
    "Medium Format": "/images/mega-menu/mega-mediumformat.webp",
  },
  Lenses: {
    "Zoom": "/images/mega-menu/mega-zoom.webp",
    "Mount Adapters": "/images/mega-menu/mega-mount.webp",
    "Prime": "/images/mega-menu/mega-prime.webp",
    "Teleconverters": "/images/mega-menu/mega-teleconveter.webp",
  },
  Accessories: {
    "Batteries Chargers and Grips": "/images/mega-menu/mega-battery.webp",
    "Flashes": "/images/mega-menu/mega-flash.webp",
    "Lens Filters": "/images/mega-menu/mega-filter.webp",
    "Memory Cards": "/images/mega-menu/mega-sdcard.webp",
    "Handles": "/images/mega-menu/mega-handle.webp",
    "Bags": "/images/mega-menu/mega-bag.webp",
    "Others": "/images/mega-menu/mega-other.webp",
  },
};

export function getMegaMenuImage(
  category: string,
  subcategory: string
): string | undefined {
  const subs = MEGA_MENU_IMAGES[category];
  if (!subs) return undefined;
  return subs[subcategory];
}
