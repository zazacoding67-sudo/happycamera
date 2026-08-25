import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  if (!q || q.trim().length === 0) {
    return NextResponse.json([]);
  }

  const cleanQuery = q.toLowerCase().replace(/[^a-z0-9]/g, "");

  if (cleanQuery.length === 0) {
    return NextResponse.json([]);
  }

  const products = await prisma.product.findMany({
    select: { name: true, price: true, images: true, slug: true },
    take: 50,
  });

  const filtered = products
    .filter((p) =>
      p.name.toLowerCase().replace(/[^a-z0-9]/g, "").includes(cleanQuery)
    )
    .slice(0, 8)
    .map((p) => ({
      name: p.name,
      price: p.price,
      imageUrl: p.images[0] || "",
      slug: p.slug,
    }));

  return NextResponse.json(filtered);
}
