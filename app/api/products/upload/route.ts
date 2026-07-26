import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function parseCSV(text: string): Record<string, string>[] {
  const lines: string[] = [];
  let current = "";
  let inQuotes = false;
  for (const ch of text) {
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === "\n" && !inQuotes) {
      lines.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  if (current.trim()) lines.push(current);

  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((h) => h.trim().replace(/^"(.*)"$/, "$1"));

  return lines.slice(1).map((line) => {
    const fields: string[] = [];
    let buf = "";
    let q = false;
    for (const ch of line) {
      if (ch === '"') {
        q = !q;
      } else if (ch === "," && !q) {
        fields.push(buf.trim());
        buf = "";
      } else {
        buf += ch;
      }
    }
    fields.push(buf.trim());

    const record: Record<string, string> = {};
    headers.forEach((h, i) => {
      record[h] = (fields[i] || "").replace(/^"(.*)"$/, "$1");
    });
    return record;
  });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No CSV file provided." }, { status: 400 });
    }

    const text = await file.text();
    const rows = parseCSV(text);

    if (rows.length === 0) {
      return NextResponse.json({ error: "CSV file is empty or has no data rows." }, { status: 400 });
    }

    // Fetch all categories for lookup
    const allCategories = await prisma.category.findMany();
    const categoryMap = new Map(allCategories.map((c) => [c.slug, c.id]));

    const created: string[] = [];
    const errors: { row: number; message: string }[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNum = i + 2; // 1-indexed, skip header

      const name = row.name?.trim();
      const slug = row.slug?.trim();
      const brand = row.brand?.trim();
      const priceStr = row.price?.trim();
      const condition = row.condition?.trim().toLowerCase();
      const categorySlug = row.categorySlug?.trim();

      if (!name || !slug || !brand || !priceStr || !condition || !categorySlug) {
        errors.push({ row: rowNum, message: "Missing required field (name, slug, brand, price, condition, categorySlug)" });
        continue;
      }

      const price = parseFloat(priceStr);
      if (isNaN(price) || price <= 0) {
        errors.push({ row: rowNum, message: `Invalid price: "${priceStr}"` });
        continue;
      }

      if (!["new", "preloved"].includes(condition)) {
        errors.push({ row: rowNum, message: `Invalid condition: "${condition}". Must be "new" or "preloved".` });
        continue;
      }

      const categoryId = categoryMap.get(categorySlug);
      if (!categoryId) {
        errors.push({ row: rowNum, message: `Unknown category slug: "${categorySlug}"` });
        continue;
      }

      const stockQuantity = parseInt(row.stockQuantity, 10) || 1;

      const includedAccessories = row.includedAccessories
        ? row.includedAccessories.split(";").map((s: string) => s.trim()).filter(Boolean)
        : [];

      const validGrades = ["MINT", "EXCELLENT", "GOOD", "FAIR"];
      const conditionGrade = row.conditionGrade?.trim().toUpperCase() || null;
      if (conditionGrade && !validGrades.includes(conditionGrade)) {
        errors.push({ row: rowNum, message: `Invalid conditionGrade: "${conditionGrade}". Must be MINT, EXCELLENT, GOOD, or FAIR.` });
        continue;
      }

      const shutterCount = row.shutterCount ? parseInt(row.shutterCount, 10) || null : null;

      try {
        await prisma.product.upsert({
          where: { slug },
          update: {
            name,
            brand,
            description: row.description || "",
            price,
            condition,
            conditionGrade: conditionGrade as any || null,
            conditionNotes: row.conditionNotes || null,
            includedAccessories,
            shutterCount,
            mount: row.mount || null,
            format: row.format || null,
            warranty: row.warranty || null,
            stockQuantity,
            categoryId,
          },
          create: {
            name,
            slug,
            brand,
            description: row.description || "",
            price,
            condition,
            conditionGrade: conditionGrade as any || null,
            conditionNotes: row.conditionNotes || null,
            includedAccessories,
            shutterCount,
            mount: row.mount || null,
            format: row.format || null,
            warranty: row.warranty || null,
            stockQuantity,
            images: [],
            categoryId,
          },
        });
        created.push(name);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        errors.push({ row: rowNum, message });
      }
    }

    return NextResponse.json({
      created: created.length,
      createdNames: created,
      errors: errors.length,
      errorDetails: errors,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
