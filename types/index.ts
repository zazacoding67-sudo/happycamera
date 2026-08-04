export type ProductCondition = "new" | "preloved";

export type ConditionGrade = "MINT" | "EXCELLENT" | "GOOD" | "FAIR" | null;

export interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  images: string[];
  condition: ProductCondition;
  brand: string;
  slug: string;
  stockQuantity?: number;
  categorySlug?: string;
  categoryName?: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}
