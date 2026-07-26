import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany();

  return (
    <div className="p-8">
      <p className="text-xs text-gray-400 mb-1">
        <Link href="/admin" className="hover:text-gray-600 transition-colors">Admin</Link>
        {" / "}
        <Link href="/admin/products" className="hover:text-gray-600 transition-colors">Products</Link>
        {" / Add Product"}
      </p>
      <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
        Add New Product
      </h1>
      <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
        Fill in the details below to list a new item.
      </p>
      <div className="mt-8">
        <ProductForm categories={categories} />
      </div>
    </div>
  );
}
