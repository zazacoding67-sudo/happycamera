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

export const navigationMenus: MegaMenuItem[] = [
  {
    name: "Cameras",
    path: "/shop",
    subcategories: [
      {
        name: "Digital",
        path: "/shop?category=digital-bodies",
        image: "/images/digital-mega.jpg",
        title: "Shoot Digital",
      },
      {
        name: "Mirrorless",
        path: "/shop?category=mirrorless",
        image: "/images/mirrorless-mega.jpg",
        title: "Mirrorless Bodies",
      },
      {
        name: "DSLR",
        path: "/shop?category=dslr",
        image: "/images/dslr-mega.jpg",
        title: "DSLR Classics",
      },
      {
        name: "Lenses",
        path: "/shop?category=lenses",
        image: "/images/lens-mega.jpg",
        title: "Browse Lenses",
      },
    ],
    shopAll: {
      path: "/shop?category=cameras",
      image: "/images/digital-mega.jpg",
      title: "Shop All Cameras",
    },
  },
  {
    name: "Bags",
    path: "/shop",
    subcategories: [
      {
        name: "Backpacks",
        path: "/shop?q=backpack",
        image: "/images/bag-mega.jpg",
        title: "Camera Backpacks",
      },
      {
        name: "Sling Bag",
        path: "/shop?q=slingbag",
        image: "/images/bag-mega.jpg",
        title: "Sling Bag",
      },
    ],
    shopAll: {
      path: "/shop?category=bag",
      image: "/images/bag-mega.jpg",
      title: "Shop All Bags",
    },
  },
  {
    name: "Dry Box",
    path: "/shop?category=dry-box",
    subcategories: [
      {
        name: "Shop Dry Box",
        path: "/shop?category=dry-box",
        image: "/images/drybox-mega.jpg",
        title: "Dry Box Storage",
      },
    ],
    shopAll: {
      path: "/shop?category=dry-box",
      image: "/images/drybox-mega.jpg",
      title: "Shop All Dry Box",
    },
  },
];
