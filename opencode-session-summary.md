# Happy Camera — Handover Document

## Context
You are picking up work on the Happy Camera e-commerce project. The following summarises the current state, what was done this session, and what remains. Read this first to understand where things stand before making any changes.

---

## Project Stack
- Next.js 16 (Turbopack, App Router), TypeScript 6, Tailwind CSS v3.4.19
- Prisma 7.8.0 with PrismaPg adapter (no `datasource.url` in schema)
- Supabase PostgreSQL + Storage
- NextAuth v4, Toyyibpay, lucide-react, framer-motion, clsx + tailwind-merge, bcryptjs, resend, react-easy-crop v6

## Currency
All prices in RM (Malaysian Ringgit). Use `formatPrice()` from `lib/format.ts`. No `$` anywhere.

## Admin Login
- URL: `/admin/login` or `/login`
- Email: `admin@happycamera.com`
- Password: `wilson123`

---

## Current Layouts (Verified Correct)

### Gallery — `components/ui/Gallery.tsx`
The file already matches the final version:
- Fixed `h-[480px]` container (NOT `aspect-[4/3]`)
- `bg-[#f5f5f5]` (light neutral background)
- Main image: `object-contain` with `p-6` padding
- No hover effects, no transitions, no `boxShadow` on main image
- Thumbnails: `64×64` with `border-2 border-[#1A1A1A]` for active, `opacity-60 hover:opacity-100` for inactive
- Desktop: vertical thumbnail strip on left (`hidden md:flex flex-col`)
- Mobile: horizontal scroll below (`flex md:hidden`)
- `validImages` filter: `img.startsWith("https://")` preserved
- Empty state: `h-[480px] bg-[#f5f5f5]` with "No image" text

### Product Detail Page — `app/product/[slug]/page.tsx`
The file already matches the polished format:
- Brand: `text-xs font-semibold uppercase tracking-[0.2em]`
- Title: `text-3xl sm:text-4xl font-bold leading-tight`
- Price: `text-2xl font-semibold`
- Stock badges: red `text-[10px]` uppercase pills (`bg-red-50 text-red-700`, `bg-red-50 text-red-600`)
- Trust signals: `ShieldCheck` + `RotateCcw` icons under `border-t` divider
- CTA button: `AddToCartButton` component
- Trade-in button: ghost style with `border border-[var(--color-border)]`
- Spec table: `<dl>` with `divide-y divide-[var(--color-border)]`, parent `text-[var(--color-text-primary)]`
- Each spec row: `flex justify-between py-3` with `<dt>` (uppercase, grey) + `<dd>` (medium weight)
- Stock row: proper singular/plural (`unit` / `units`)
- Reviews: `ReviewSection` component with productId and mapped reviews
- Related products: `ProductCard` grid, `take: 4`
- JSON-LD with `priceCurrency: "MYR"`
- Sticky mobile add-to-cart: `<StickyAddToCart>` shown only when `inStock`

---

## Seed Database — `prisma/seed.ts`

### Current state
- 23 products across 7 categories (Film Cameras, Digital Bodies, Lenses, Accessories, Dry Box, Bag, Camera)
- Original 5: Leica M6 TTL, Fujifilm X100VI, Zeiss 35mm f/1.4, Hasselblad 500 C/M, HINISO Electronic Dry Cabinet
- New 18: 3 Camera preloved + 3 Camera new + 3 Bag preloved + 3 Bag new + 3 Dry Box preloved + 3 Dry Box new
- All image URLs use correctly matched Unsplash photos (verified this session)
- No `(Preloved)` or `(New)` suffixes in product names — condition shown via separate badge
- Condition values lowercase: `"new"` or `"preloved"`
- Uses `upsert` keyed on `slug` — re-runnable without wiping data

### Re-run seed
```bash
npx prisma db seed
```

### If you get "Unknown argument" errors
Kill the dev server, delete `.next`, run `npx prisma generate`, then restart.

---

## Image Upload — `components/ui/MultiImageUpload.tsx`
- react-easy-crop v6 (CSS imported as `"react-easy-crop/react-easy-crop.css"`)
- Crop aspect: 4:3
- Default zoom: 1 (fill frame)
- Background: `#1A1A1A`
- Output: canvas-to-blob JPEG, quality 0.85, max 2400px longest side
- Appends to images array via `uploadedInBatchRef.current` (ref, not state — fixes stale closure during batch crop processing)

---

## Schema Notes
Do NOT reintroduce these deprecated fields:
- `Product.inStock` — use `stockQuantity > 0`
- `Product.imageUrl` — use `images[]`

Key models/enums:
- `Product.mount` (String? | null)
- `Product.format` (String? | null)
- `ConditionGrade` enum: MINT, EXCELLENT, GOOD, FAIR
- `OrderStatus` enum: PENDING, PAID, PROCESSING, SHIPPED, DELIVERED, CANCELLED
- All admin pages: `export const dynamic = "force-dynamic"` (except `/admin/login` and `/admin/signout`)

---

## Design Conventions
- Colors: CSS variables (`--color-text-primary`, `--color-text-secondary`, `--color-border`, `--color-surface`)
- Gallery bg: `#f5f5f5`
- Admin sidebar: `#111` with white text
- Primary buttons: `h-14 text-[15px] uppercase font-semibold`
- Login pages: split-screen layout
- `formatPrice()` returns e.g. `RM 4,299`

---

## Rules — Do Not Break
- Do NOT remove `validImages` filter (`img.startsWith("https://")`) in Gallery.tsx
- Do NOT use `deleteMany` + `createMany` in seed — keep `upsert` keyed on `slug`
- Do NOT reintroduce `Product.inStock`, `Product.imageUrl`, or any deprecated fields
- Seed `condition` values must stay lowercase: `"new"` or `"preloved"`
- Do NOT use `$` for prices anywhere — always use `formatPrice()` from `lib/format.ts`
- Do NOT run a full build unless explicitly asked — just run `npx tsc --noEmit` for type checking

---

## Pending / Next Steps

1. **Phase 5 — Admin / Operations**
   - Replace dashboard overview with recharts revenue chart + top products
   - Build CSV bulk product upload page (`/admin/products/upload`)

2. **Phase 7 — Testing**
   - Run full e2e flow: browse → filter → add to cart → checkout → payment callback → order status update → tracking
   - Verify field-level validation on ProductForm
   - Verify crop modal interaction (4:3 aspect, fill-frame default)
   - Verify sequential multi-image cropping (appends via ref)
   - Confirm `h-[480px]` gallery works consistently across portrait, square, and landscape images
   - Confirm `opacity-60` inactive thumbnail state is visually clear
