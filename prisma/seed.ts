import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/--+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function main() {
  // One-time data migration: rename film-cameras -> digital-bodies, digital-bodies -> mirrorless
  // Guards prevent double-rename on subsequent seed runs
  await prisma.$executeRawUnsafe(`
    UPDATE "Category" SET slug = 'digital-bodies', name = 'Digital Bodies'
    WHERE slug = 'film-cameras'
    AND NOT EXISTS (SELECT 1 FROM "Category" WHERE slug = 'digital-bodies')
  `);
  await prisma.$executeRawUnsafe(`
    UPDATE "Category" SET slug = 'mirrorless', name = 'Mirrorless'
    WHERE slug = 'digital-bodies'
    AND NOT EXISTS (SELECT 1 FROM "Category" WHERE slug = 'mirrorless')
  `);

  const filmCat = await prisma.category.upsert({
    where: { slug: "digital-bodies" },
    update: { name: "Digital Bodies" },
    create: { name: "Digital Bodies", slug: "digital-bodies" },
  });
  const mirrorlessCat = await prisma.category.upsert({
    where: { slug: "mirrorless" },
    update: { name: "Mirrorless" },
    create: { name: "Mirrorless", slug: "mirrorless" },
  });
  const lensCat = await prisma.category.upsert({
    where: { slug: "lenses" },
    update: { name: "Lenses" },
    create: { name: "Lenses", slug: "lenses" },
  });
  const accessoriesCat = await prisma.category.upsert({
    where: { slug: "accessories" },
    update: { name: "Accessories" },
    create: { name: "Accessories", slug: "accessories" },
  });
  const dryBoxCat = await prisma.category.upsert({
    where: { slug: "dry-box" },
    update: { name: "Dry Box" },
    create: { name: "Dry Box", slug: "dry-box" },
  });
  const bagCat = await prisma.category.upsert({
    where: { slug: "bag" },
    update: { name: "Bag" },
    create: { name: "Bag", slug: "bag" },
  });
  const dslrCat = await prisma.category.upsert({
    where: { slug: "dslr" },
    update: { name: "DSLR" },
    create: { name: "DSLR", slug: "dslr" },
  });
  const cameraCat = await prisma.category.upsert({
    where: { slug: "camera" },
    update: { name: "Camera" },
    create: { name: "Camera", slug: "camera" },
  });

  const products = [
    // --- CAMERAS ---
    {
      slug: "leica-m6-ttl",
      name: "Leica M6 TTL",
      brand: "Leica",
      price: 8500,
      condition: "preloved",
      conditionGrade: "EXCELLENT" as const,
      conditionNotes:
        "Minor brassing on edges. Viewfinder clean, RF patch bright. Light seals replaced 2024.",
      includedAccessories: [
        "Original box",
        "Leica strap",
        "UV filter",
        "Batteries (2x LR44)",
      ],
      shutterCount: null,
      mount: "Leica M",
      format: "35mm",
      stockQuantity: 1,
      description:
        "A legendary rangefinder. Fully mechanical, beautifully engineered, and ready for your next roll of Portra 400.",
      images: [
        "https://images.unsplash.com/photo-1495707902641-75cac588d2e9?w=800&q=80",
      ],
      categoryId: filmCat.id,
    },
    {
      slug: "fujifilm-x100vi",
      name: "Fujifilm X100VI",
      brand: "Fujifilm",
      price: 7299,
      condition: "new",
      conditionGrade: null,
      conditionNotes: null,
      includedAccessories: [
        "USB-C cable",
        "Wrist strap",
        "Lens cap",
        "Hot shoe cover",
      ],
      shutterCount: 0,
      mount: "Fixed (23mm f/2)",
      format: "APS-C",
      stockQuantity: 3,
      description:
        "The ultimate everyday carry. 40MP sensor, IBIS, and those classic film simulations packed into a beautiful, tactile body.",
      images: [
        "https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=800&q=80",
      ],
      categoryId: mirrorlessCat.id,
    },
    {
      slug: "canon-eos-r50",
      name: "Canon EOS R50",
      brand: "Canon",
      price: 3499,
      condition: "new",
      conditionGrade: null,
      conditionNotes: null,
      includedAccessories: [],
      shutterCount: null,
      mount: null,
      format: null,
      stockQuantity: 12,
      description:
        "Lightweight and capable RF-mount camera perfect for content creators and beginners.",
      images: [
        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
      ],
      categoryId: cameraCat.id,
    },
    {
      slug: "sony-alpha-a6700",
      name: "Sony Alpha A6700",
      brand: "Sony",
      price: 6299,
      condition: "new",
      conditionGrade: null,
      conditionNotes: null,
      includedAccessories: [],
      shutterCount: null,
      mount: null,
      format: null,
      stockQuantity: 8,
      description:
        "Sony's latest APS-C flagship with AI-powered autofocus and 26MP stacked sensor. Brand new in box.",
      images: [
        "https://images.unsplash.com/photo-1606986628253-fc0bd12f8c48?w=800&q=80",
      ],
      categoryId: cameraCat.id,
    },
    {
      slug: "nikon-z30",
      name: "Nikon Z30",
      brand: "Nikon",
      price: 2799,
      condition: "preloved",
      conditionGrade: null,
      conditionNotes: null,
      includedAccessories: [],
      shutterCount: null,
      mount: null,
      format: null,
      stockQuantity: 1,
      description:
        "Compact and vlogger-friendly Z-mount camera. Perfect entry into Nikon's mirrorless system.",
      images: [
        "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&q=80",
      ],
      categoryId: cameraCat.id,
    },
    {
      slug: "hasselblad-500-cm",
      name: "Hasselblad 500 C/M",
      brand: "Hasselblad",
      price: 12500,
      condition: "preloved",
      conditionGrade: "GOOD" as const,
      conditionNotes:
        "Cosmetic wear consistent with age. All shutter speeds accurate. Includes 80mm f/2.8 Planar and A12 back.",
      includedAccessories: [
        "80mm f/2.8 Planar CB",
        "A12 film back (x2)",
        "Waist-level finder",
        "Eveready case",
      ],
      shutterCount: null,
      mount: "Hasselblad V",
      format: "Medium Format 6x6",
      stockQuantity: 1,
      description:
        "The pinnacle of medium format modularity. Serviced and firing perfectly at all speeds.",
      images: [
        "https://images.unsplash.com/photo-1452780212461-a8b822f6396d?w=800&q=80",
      ],
      categoryId: filmCat.id,
    },
    {
      slug: "zeiss-35mm-f1-4",
      name: "Zeiss 35mm f/1.4",
      brand: "Zeiss",
      price: 4200,
      condition: "new",
      conditionGrade: null,
      conditionNotes: null,
      includedAccessories: [
        "Front/rear caps",
        "Lens hood",
        "Padded pouch",
      ],
      shutterCount: null,
      mount: "Canon EF / Nikon F / Sony E",
      format: "35mm Full Frame",
      stockQuantity: 2,
      description:
        "Incredible micro-contrast and that signature Zeiss 3D pop. A versatile focal length perfect for street, documentary, and environmental portraiture.",
      images: [
        "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=800&q=80",
      ],
      categoryId: lensCat.id,
    },
    {
      slug: "sony-alpha-a7c-ii",
      name: "Sony Alpha A7C II",
      brand: "Sony",
      price: 5499,
      condition: "preloved",
      conditionGrade: null,
      conditionNotes: null,
      includedAccessories: [],
      shutterCount: null,
      mount: null,
      format: null,
      stockQuantity: 1,
      description:
        "Compact full-frame mirrorless with exceptional autofocus. Lightly used and in great condition.",
      images: [
        "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80",
      ],
      categoryId: cameraCat.id,
    },
    {
      slug: "fujifilm-x-t5",
      name: "Fujifilm X-T5",
      brand: "Fujifilm",
      price: 4299,
      condition: "preloved",
      conditionGrade: null,
      conditionNotes: null,
      includedAccessories: [],
      shutterCount: null,
      mount: null,
      format: null,
      stockQuantity: 2,
      description:
        "Retro-styled APS-C powerhouse with 40MP sensor and classic film simulations. Well cared for by its previous owner.",
      images: [
        "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80",
      ],
      categoryId: cameraCat.id,
    },

    // --- BAGS ---
    {
      slug: "shimoda-explore-v2-35l",
      name: "Shimoda Explore V2 35L",
      brand: "Shimoda",
      price: 1099,
      condition: "new",
      conditionGrade: null,
      conditionNotes: null,
      includedAccessories: [],
      shutterCount: null,
      mount: null,
      format: null,
      stockQuantity: 7,
      description:
        "Lightweight adventure pack designed for photographers who hike. Comfortable harness system and ample storage.",
      images: [
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
      ],
      categoryId: bagCat.id,
    },
    {
      slug: "peak-design-travel-backpack-45l",
      name: "Peak Design Travel Backpack 45L",
      brand: "Peak Design",
      price: 1299,
      condition: "new",
      conditionGrade: null,
      conditionNotes: null,
      includedAccessories: [],
      shutterCount: null,
      mount: null,
      format: null,
      stockQuantity: 6,
      description:
        "The ultimate travel-camera hybrid. Expands from carry-on to weekender with ease. Brand new.",
      images: [
        "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&q=80",
      ],
      categoryId: bagCat.id,
    },
    {
      slug: "f-stop-tilopa-50l",
      name: "F-Stop Tilopa 50L",
      brand: "F-Stop",
      price: 699,
      condition: "preloved",
      conditionGrade: null,
      conditionNotes: null,
      includedAccessories: [],
      shutterCount: null,
      mount: null,
      format: null,
      stockQuantity: 1,
      description:
        "Adventure-ready camera pack built for backcountry shoots. Fits large telephoto setups with room to spare.",
      images: [
        "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=800&q=80",
      ],
      categoryId: bagCat.id,
    },
    {
      slug: "lowepro-protactic-450-aw",
      name: "Lowepro ProTactic 450 AW",
      brand: "Lowepro",
      price: 449,
      condition: "preloved",
      conditionGrade: null,
      conditionNotes: null,
      includedAccessories: [],
      shutterCount: null,
      mount: null,
      format: null,
      stockQuantity: 2,
      description:
        "Modular professional camera backpack with all-weather cover. Plenty of space for a full kit.",
      images: [
        "https://images.unsplash.com/photo-1622560480654-d96214fdc887?w=800&q=80",
      ],
      categoryId: bagCat.id,
    },
    {
      slug: "manfrotto-manhattan-mover-50",
      name: "Manfrotto Manhattan Mover 50",
      brand: "Manfrotto",
      price: 599,
      condition: "new",
      conditionGrade: null,
      conditionNotes: null,
      includedAccessories: [],
      shutterCount: null,
      mount: null,
      format: null,
      stockQuantity: 4,
      description:
        "Professional roller backpack with removable camera insert. Smooth rolling and airline carry-on compliant.",
      images: [
        "https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800&q=80",
      ],
      categoryId: bagCat.id,
    },
    {
      slug: "ruggard-thunderhead-49l",
      name: "Ruggard Thunderhead 49L",
      brand: "Ruggard",
      price: 329,
      condition: "preloved",
      conditionGrade: null,
      conditionNotes: null,
      includedAccessories: [],
      shutterCount: null,
      mount: null,
      format: null,
      stockQuantity: 1,
      description:
        "Weather-resistant duffel-style camera bag with removable insert. Lightly used, great condition.",
      images: [
        "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=800&q=80",
      ],
      categoryId: bagCat.id,
    },

    // --- DRY BOX ---
    {
      slug: "hiniso-electronic-dry-cabinet-30l",
      name: "HINISO Electronic Dry Cabinet 30L",
      brand: "HINISO",
      price: 149,
      condition: "new",
      conditionGrade: null,
      conditionNotes: null,
      includedAccessories: [],
      shutterCount: null,
      mount: null,
      format: null,
      stockQuantity: 10,
      description:
        "Compact electronic dry cabinet with adjustable humidity control. Perfect for storing lenses and bodies.",
      images: [
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      ],
      categoryId: dryBoxCat.id,
    },
    {
      slug: "hiniso-electronic-dry-cabinet-60l",
      name: "HINISO Electronic Dry Cabinet 60L",
      brand: "HINISO",
      price: 899,
      condition: "new",
      conditionGrade: null,
      conditionNotes: null,
      includedAccessories: [],
      shutterCount: null,
      mount: null,
      format: null,
      stockQuantity: 5,
      description:
        "Large-capacity electronic dry cabinet with digital humidity display and lockable door. Brand new in box.",
      images: [
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      ],
      categoryId: dryBoxCat.id,
    },
    {
      slug: "forspark-dry-box-67l",
      name: "Forspark Dry Box 67L",
      brand: "Forspark",
      price: 189,
      condition: "preloved",
      conditionGrade: null,
      conditionNotes: null,
      includedAccessories: [],
      shutterCount: null,
      mount: null,
      format: null,
      stockQuantity: 3,
      description:
        "Large portable dry box with upgraded seal and hygrometer. Plenty of space for a full kit.",
      images: [
        "https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&q=80",
      ],
      categoryId: dryBoxCat.id,
    },
    {
      slug: "peli-1510-case",
      name: "Peli 1510 Case",
      brand: "Peli",
      price: 899,
      condition: "new",
      conditionGrade: null,
      conditionNotes: null,
      includedAccessories: [],
      shutterCount: null,
      mount: null,
      format: null,
      stockQuantity: 5,
      description:
        "Indestructible waterproof case with pick-and-pluck foam. Ideal for travelling with delicate gear.",
      images: [
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
      ],
      categoryId: dryBoxCat.id,
    },
    {
      slug: "digi-cabi-dhc-n150",
      name: "Digi Cabi DHC-N150",
      brand: "Digi Cabi",
      price: 279,
      condition: "preloved",
      conditionGrade: null,
      conditionNotes: null,
      includedAccessories: [],
      shutterCount: null,
      mount: null,
      format: null,
      stockQuantity: 2,
      description:
        "Compact electronic dry cabinet with touch controls and silent operation. Lightly used, in excellent condition.",
      images: [
        "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=800&q=80",
      ],
      categoryId: dryBoxCat.id,
    },
  ];

  for (const product of products) {
    const { slug, ...data } = product;
    await prisma.product.upsert({
      where: { slug },
      update: data,
      create: { slug, ...data },
    });
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
