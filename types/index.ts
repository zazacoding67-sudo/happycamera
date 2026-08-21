export type ProductCondition = "new" | "preloved";

export type ConditionGrade = "MINT" | "EXCELLENT" | "GOOD" | "FAIR" | null;

export interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  images: string[];
  condition: ProductCondition;
  conditionGrade?: ConditionGrade;
  brand: string;
  slug: string;
  stockQuantity?: number;
  categorySlug?: string;
  categoryName?: string;
  averageRating?: number | null;
  isOnSale?: boolean;
  compareAtPrice?: number | null;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}
