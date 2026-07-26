import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name, slug, brand, price, condition, conditionGrade, conditionNotes,
      includedAccessories, shutterCount, mount, format, warranty,
      stockQuantity, description, categoryId, images,
    } = body;

    const fields: Record<string, string> = {};
    if (!name || !name.trim()) fields.name = "Name is required.";
    if (!slug || !slug.trim()) fields.slug = "Slug is required.";
    else if (!SLUG_PATTERN.test(slug)) fields.slug = "Slug can only contain lowercase letters, numbers, and hyphens.";
    if (!brand || !brand.trim()) fields.brand = "Brand is required.";
    if (price === undefined || price === null || isNaN(Number(price)) || Number(price) <= 0) fields.price = "Price must be greater than 0.";
    if (stockQuantity === undefined || stockQuantity === null || isNaN(Number(stockQuantity)) || Number(stockQuantity) < 0) fields.stockQty = "Stock quantity must be 0 or more.";
    if (!categoryId) fields.categoryId = "Category is required.";
    if (!description || !description.trim()) fields.description = "Description is required.";
    if (condition === "preloved" && !conditionGrade) fields.conditionGrade = "Grade is required for preloved items.";
    if (!images || images.length === 0) fields.images = "At least one image is required.";

    if (Object.keys(fields).length > 0) {
      return NextResponse.json({ error: "Please fix the highlighted fields and try again.", fields }, { status: 400 });
    }

    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "A product with this slug already exists.", fields: { slug: "Slug is already taken." } }, { status: 409 });
    }

    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        slug: slug.trim(),
        brand: brand.trim(),
        price: Number(price),
        condition,
        conditionGrade: conditionGrade || null,
        conditionNotes: conditionNotes || null,
        includedAccessories: includedAccessories || [],
        shutterCount: shutterCount || null,
        mount: mount || null,
        format: format || null,
        warranty: warranty || null,
        stockQuantity: stockQuantity ? parseInt(String(stockQuantity), 10) : 1,
        description,
        categoryId,
        images: images || [],
      },
    });

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error("Failed to create product:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
