export interface Subcategory {
  name: string;
  path: string;
  title: string;
}

export interface MegaMenuItem {
  name: string;
  path: string;
  /** Canonical category key (e.g. "Cameras", "Lenses", "Accessories") used to look up curated mega-menu images. */
  category: string;
  subcategories: Subcategory[];
  shopAll: {
    path: string;
    title: string;
  };
}
