export interface Subcategory {
  name: string;
  path: string;
  image: string;
  title: string;
}

export interface MegaMenuItem {
  name: string;
  path: string;
  subcategories: Subcategory[];
  shopAll: {
    path: string;
    image: string;
    title: string;
  };
}
