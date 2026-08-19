export const MEGA_MENU_IMAGES: Record<string, Record<string, string>> = {
  Cameras: {
    "Mirrorless": "/images/mega-menu/mega-mirrorless.png",
    "Compact": "/images/mega-menu/mega-rx100.png",
    "DSLR": "/images/mega-menu/mega-dslr.png",
    "Cinema": "/images/mega-menu/mega-fx5.png",
    "Instant": "/images/mega-menu/mega-instant.png",
    "Medium Format": "/images/mega-menu/mega-mediumformat.png",
  },
  Lenses: {
    "Zoom": "/images/mega-menu/mega-zoom.png",
    "Mount Adapters": "/images/mega-menu/mega-mount.png",
    "Prime": "/images/mega-menu/mega-prime.png",
    "Teleconverters": "/images/mega-menu/mega-teleconveter.png",
  },
  Accessories: {
    "Batteries Chargers and Grips": "/images/mega-menu/mega-battery.png",
    "Flashes": "/images/mega-menu/mega-flash.png",
    "Lens Filters": "/images/mega-menu/mega-filter.png",
    "Memory Cards": "/images/mega-menu/mega-sdcard.png",
    "Handles": "/images/mega-menu/mega-handle.png",
    "Bags": "/images/mega-menu/mega-bag.png",
    "Others": "/images/mega-menu/mega-other.png",
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
