## Goal
- Build a Moment-inspired e-commerce site for Happy Camera with admin dashboard, live search, mega menu, image uploads, Toyyibpay checkout, reviews, wishlist, filters, gallery, WhatsApp integration, condition grading, order tracking, email notifications, redesigned admin UI, unified member/admin login flow, polished carousel interactions, premium product detail image display, and a series of visual overhauls to match empi.re / minimalist reference screenshots.

## Constraints & Preferences
- Stack: Next.js 16 (Turbopack, App Router), TypeScript 6, Tailwind CSS v3.4.19, Prisma 7.8.0 (PrismaPg adapter, no `datasource.url`), Supabase PostgreSQL/Storage, NextAuth v4, Toyyibpay, lucide-react, framer-motion, clsx + tailwind-merge, bcryptjs, resend, react-easy-crop v6.
- Design: started with stark white/surface cards, bold typography, crisp edges. Then iterated through: warm `#F2F2F0` page bg (empi.re) → white bg (minimalist revert). Cards went from `border-[#EBEBEB]` + shadow → `bg-[#F5F5F5]` no border → white with subtle shadow → white with no shadow / `rounded-2xl` image area.
- Current state: Navbar is a simple 3-column grid — left `text-[13px] font-medium` links (Home, Shop, News, Contact), center `text-xl font-bold` logo, right SearchModal + cart icon. Mega menu removed. ProductCard `aspect-square bg-[#f4f4f4] rounded-2xl p-6 flex`, image `max-w-full max-h-full object-contain` via `<img>`, badges `bg-black text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full top-3 left-3 flex-row`. Title `text-[14px] text-black font-medium mt-3`. FilterSidebar accordion with `+`/`−`, section headers `13px font-semibold`, checkboxes `w-4 h-4 border-gray-300 rounded-sm focus:ring-black`, labels `text-[13px] text-[#333] ml-3`. Category pills restored in `/shop` as `border border-gray-300 rounded-full px-4 py-1.5 text-[13px]`. Page bg white.
- Touch: complete isolation from synthesized mouse events using `pointer: coarse` detection + `lastTouchTime` timestamp guard.
- No customer account system currently exists (affects wishlist — uses localStorage, not server).
- `.env` + `.env.local` both used (Prisma CLI reads `.env.local` via `prisma.config.ts`, Next.js reads `.env.local`).
- `prefers-reduced-motion` supported via `useReducedMotion` hook with fallback path in `PageTransition`.
- All admin pages use `export const dynamic = "force-dynamic"` except `/admin/login` and `/admin/signout` (static).
- Currency: RM (Malaysian Ringgit), formatted as `RM 4,299` via `formatPrice()`.
- All prices shown as RM, not `$`.
- Crop modal aspect ratio: 4:3 (landscape) matching product card grid.
- Product names in DB no longer contain `(Preloved)` or `(New)` suffixes — condition shown separately via badge.
- Condition values in DB are lowercase `"preloved"` and `"new"` — matching filter strings.

## Progress
### Done
- **Schema (all phases)**: added `ConditionGrade` enum (MINT, EXCELLENT, GOOD, FAIR), `OrderStatus` enum (PENDING, PAID, PROCESSING, SHIPPED, DELIVERED, CANCELLED), `Review` model, `Product.images` (String[]), `Product.stockQuantity` (Int, default 1), `Product.conditionGrade`, `Product.conditionNotes`, `Product.includedAccessories` (String[]), `Product.shutterCount` (Int?), `Product.mount` (String?), `Product.format` (String?), `Order.courierName`, `Order.trackingNumber`. Removed `Product.inStock` and `Product.imageUrl`. `prisma db push --accept-data-loss` applied.
- **Login flow**: Redesigned `/admin/login` as split-screen. Created `/admin/signout` confirmation card. Created unified `/login` page with role-based redirect (admin → `/admin`, others → `/`). Updated NextAuth `pages.signIn` to `/login` in both `route.ts` and `middleware.ts`.
- **Phase 1 — Trust & Credibility**: `ConditionReport.tsx` (grade badge with colour hierarchy, mount/format/shutter display, pill shape). `lib/policies.ts`. `ReviewSection.tsx` with submission form + moderation. `POST /api/reviews` + `PATCH /api/reviews/[id]`. `/admin/reviews` table. `WhatsAppButton.tsx` (floating, desktop hover tooltip). `Footer.tsx`.
- **Phase 2 — Product & Shopping Experience**: `Gallery.tsx` (defensive `validImages` filter, hides strip when ≤1, fixed `h-[480px]`, `bg-[#f5f5f5]`, `object-contain`, no hover/transitions, `p-6` breathing room, thumbnails `64×64` with `opacity-60` inactive state). `MultiImageUpload.tsx` (react-easy-crop v6, crop area background `#1A1A1A`, 4:3 crop, canvas export, clamped coordinates, replaces images array). `AddToCartButton` state machine. Stock scarcity display. Related products. `WishlistContext.tsx` (localStorage). `/wishlist` page. `FilterSidebar.tsx`. `/shop` reads `minPrice`, `maxPrice`, `brand`, `condition`, `category` params. Checkout decrements `stockQuantity`.
- **Product form redesign**: `components/admin/ProductForm.tsx` — card-based two-column layout (6 cards), per-field validation, auto-slug, breadcrumbs, delete with confirmation.
- **All Phases — Migration from `imageUrl` to `images`**: Schema column dropped. All queries use `images` field.
- **Phase 3 — Orders + Tracking + Emails**: `/admin/orders` list. `/admin/orders/[id]` detail with status toggle + courier tracking. `PATCH /api/orders/[id]`. `lib/email.ts` (Resend).
- **Phase 4 — Content & SEO**: `/story`, `/privacy`, `/terms`, `/returns` pages. `generateMetadata` on `/product/[slug]` + JSON-LD. `generateMetadata` on `/shop`, `/shop/new`, `/shop/preloved`.
- **Phase 6 — Polish**: SVG favicon. Sticky mobile add-to-cart bar. Legal pages. Footer.
- **Admin overhaul (dashboard + sidebar)**: Route group `(dashboard)`. Dark sidebar with nav, sign-out, active state. Dashboard metric cards + recent orders + low-stock alerts. Products list with search, edit/delete, stock badges. Orders list with search + pill status. Reviews moderation with star ratings + approve/reject.
- **Mount/Format spec fix**: Mount/format added to schema, `db push`. Both in `ProductForm`. Product detail page renders conditionally. HINISO mount/format cleared to null. API routes pass mount/format through.
- **Category fix**: 3 missing categories added to seed + live DB. Homepage cards use all 6. Dropdown auto-reads via `prisma.category.findMany()`.
- **Price format**: Created `lib/format.ts` with `formatPrice()`. Replaced ALL inline `$` strings across: `ProductCard.tsx`, `CartDrawer.tsx`, `StickyAddToCart.tsx`, `AddToCartButton.tsx`, `SearchModal.tsx`, product detail page, all admin pages (ProductsClient, OrdersClient, order detail, dashboard metric), JSON-LD changed to "MYR".
- **Seed — 20 products**: Refactored seed from `deleteMany`+`createMany` to `upsert` pattern (re-runnable). 7 categories. Latest seed run: 20 products with entirely re-matched Unsplash images. Products removed: Peak Design Everyday Backpack 20L, Wonderchef Dry Cabinet 30L, Forspark Dry Box 10L, duplicate X100VI. Products added: HINISO Electronic Dry Cabinet 60L, Peli 1510 Case, Digi Cabi DHC-N150. Product names stripped of `(Preloved)`/`(New)` suffixes. Condition values use lowercase `"preloved"`/`"new"`. Ran `npx prisma db seed`.
- **CategoryCarousel visual overhaul**: Segmented index ticks, ghost arrows, drag hint, depth-of-field card scaling, edge fade mask, condition badges, `formatPrice()`.
- **Product page premium UI/UX upgrade**: Brand `tracking-[0.2em]`, title `leading-tight`, price `text-2xl`, red low-stock pill, trust signals under `border-t` divider, spec table converted to `<dl>` with `divide-y`, primary CTA button `h-14 text-[15px] uppercase font-semibold`, ghost trade-in button, reviews section editorial heading + sharp input focus.
- **Gallery multi-upload fix**: Added `uploadedInBatchRef` to accumulate URLs during batch crop processing (fixes stale closure).
- **Seed image audit**: All 20 product images replaced with correctly matched Unsplash photo IDs. Verified in DB.
- **Cleanup Round 2**: (1) `quality={85}` on all thumbnails, (2) stripped `(Preloved)`/`(New)` from seed names, (3) `text-[var(--color-text-primary)]` on parent `<dl>` for spec table, (4) proper singular/plural `unit`/`units`, (5) `object-contain` + `flex items-center justify-center` for white gap fix.
- **Gallery final rewrite**: Fixed `h-[480px]`, `bg-[#f5f5f5]`, removed `boxShadow`, removed `hover:scale`, removed all transition classes, added `p-6` on image, thumbnails `64×64` with `opacity-60` inactive state.
- **THIS SESSION — Layout alignment pass**:
  - **Navbar**: Completely rewritten from mega menu system to strict 3-column grid (`grid grid-cols-3 items-center`). Left `justify-start`: text links (Home, Shop, News, Contact) at `text-[13px] font-medium`. Center `justify-center`: "Happy Camera" logo at `text-xl font-bold`. Right `justify-end`: SearchModal (search input + results) and cart icon.
  - **ProductCard**: Image container changed to `relative aspect-square w-full bg-[#f4f4f4] rounded-2xl p-6 flex items-center justify-center`. Image changed from Next.js `Image fill` to `<img>` tag with `max-w-full max-h-full object-contain` (respects padding, no stretching). Title changed to `text-[14px] text-black font-medium mt-3`.
  - **Shop page**: Category pills restored as `border border-gray-300 rounded-full px-4 py-1.5 text-[13px] text-gray-600` horizontal row. Product count moved to right side grouped with SortSelect (`justify-end`). Layout gap-fixes.
- **THIS SESSION — Preloved Edit redesigned**: Hero replaced from video to static `home-1.jpg`. Brand New/Preloved toggle + swap-carousel removed. Non-interactive trust strip (always preloved). NEW `GradingScale` component — 4-panel MINT/EXCELLENT/GOOD/FAIR explainer with `whileInView` staggered reveal, grade-colored labels/bars. NEW `PinnedScrollSequence` — sticky scroll-driven crossfade through 3 story beats (Character & History → Verified Condition → Built to Last), opacity-only via `useScroll`/`useTransform`, native CSS `sticky`, progress indicator via `scaleY`, reduced-motion fallback (static stacked `whileInView`), mobile disables pinning below `md`. Product gallery replaced from horizontal carousel to CSS columns masonry grid with `conditionNotes` on hover. MarqueeStrip removed from Preloved Edit page (stays on homepage). PrelovedEditorial kept as-is. Server page fetches preloved products only.

### In Progress
- (none)

### Blocked
- (none)

## Key Decisions
- `Product.inStock` dropped; `stockQuantity > 0` is single source of truth. `imageUrl` column also dropped — only `images[]` exists.
- `Order.status` changed from free string to `OrderStatus` enum — existing data lost during `prisma db push --accept-data-loss` (acceptable, no production orders yet).
- `ProductCard.tsx` marked `"use client"` to support `WishlistContext` heart toggle — all consumers receive props unchanged.
- Wishlist uses client-only localStorage since there are no customer accounts; flagged for future server-side migration.
- Filters on `/shop` use URL search params for shareable/bookmarkable URLs.
- Gallery changed from `aspect-[4/3]` to fixed `h-[480px]` — all products show at same height regardless of image ratio.
- Gallery background `bg-[#f5f5f5]` (neutral light) — works for both white-bg and dark-bg product photos without visible black bars.
- Gallery main image uses `object-contain` with `p-6` padding — full camera visible, never cropped, intentional breathing room.
- Thumbnails use `opacity-60` for inactive state instead of border-only change.
- **THIS SESSION (Layout)**: Mega menu replaced with simple text links. User explicitly requested this layout: `grid grid-cols-3 items-center` with text links, centered logo, search bar + cart.
- **THIS SESSION (Preloved Edit)**: Preloved page reframed as storytelling — Grading Scale explains the enum, Pinned Scroll Sequence makes an emotional case through 3 scrollytelling beats, editorial masonry gallery reveals per-item condition on hover. MarqueeStrip replaced by PinnedScrollSequence (MarqueeStrip stays on homepage only).
- **Pinned Scroll Sequence**: opacity-only crossfade via `useScroll`/`useTransform`; native CSS `sticky` for pinning; legibility overlays (`bg-gradient-to-r from-black/80 via-black/40 to-transparent` on static `div`, never on animated element); full static-stack fallback under reduced motion or mobile <768px. 4 segment panels with ~5% overlap crossfade, progress indicator via `scaleY`.
- MultiImageUpload `onChange` appends via ref `uploadedInBatchRef.current = [...uploadedInBatchRef.current, urlData.publicUrl]` — fixes stale closure bug during batch processing.
- All prices formatted via centralised `formatPrice()` in `lib/format.ts` — no inline `$` strings remain.
- Login pages (public `/login` and `/admin/login`) share the same split-screen layout but differ in headline/subheading.

## Next Steps
1. **Phase 5 — Admin / Operations**: Replace dashboard overview with recharts revenue chart + top products. Build CSV bulk product upload page (`/admin/products/upload`).
2. **Phase 7 — Testing**: Run full e2e flow (browse → filter → add to cart → checkout → payment callback → order status update → tracking). Verify field-level validation on ProductForm, crop modal interaction (4:3 aspect, fill-frame default), sequential multi-image cropping (appends via ref), and all four login scenarios.

## Critical Context
- `prisma db push --accept-data-loss` was used multiple times. No production data exists so this is acceptable.
- Admin login: `admin@happycamera.com` / `wilson123` at `/admin/login` or `/login`.
- WhatsApp number env var: `NEXT_PUBLIC_WHATSAPP_NUMBER`.
- Image crop: `react-easy-crop` v6, CSS imported as `"react-easy-crop/react-easy-crop.css"`, canvas-to-blob JPEG quality 0.85, max 2400px longest side. Crop aspect 4:3. Default zoom=1 (fill frame). Background `#1A1A1A`.
- Upload appends to images array via ref: `uploadedInBatchRef.current = [...uploadedInBatchRef.current, urlData.publicUrl]` — old URLs are preserved during batch.
- Products in DB: 20 total (7 cameras, 6 bags, 5 dry boxes + Zeiss lens in Lenses category). Product names no longer have `(Preloved)`/`(New)` suffixes.
- 7 categories in DB: Film Cameras, Digital Bodies, Lenses, Accessories, Dry Box, Bag, Camera.
- Public `/login` redirects admin users to `/admin` on success, others to `/`. NextAuth `pages.signIn` set to `/login`.
- Condition values in DB are lowercase `"preloved"` and `"new"` — matching filter strings.
- **Navbar**: Replaced mega menu with simple 3-column grid layout (`grid grid-cols-3 items-center`). Left: Home, Shop, News, Contact text links. Center: logo. Right: search bar + cart.
- **CartDrawer.tsx** has `"use client"` and uses `useCart()` from `CartContext` — includes checkout button.
- **Pinned Scroll Sequence**: opacity-only crossfade via `useScroll`/`useTransform`; native CSS `sticky` for pinning; legibility overlays (`bg-gradient-to-r from-black/80 via-black/40 to-transparent` on static `div`, never on animated element); full static-stack fallback under reduced motion or mobile <768px. 3 beat panels with ~5% overlap crossfade, progress indicator via `scaleY`.

## Relevant Files
- `prisma/schema.prisma`: 8 models/2 enums — no `inStock`/`imageUrl`; has `mount` (String?), `format` (String?).
- `prisma/seed.ts`: 7 categories, 20 products with all fields + correctly matched Unsplash photo IDs; uses `upsert` pattern. Product names stripped of condition suffixes.
- `lib/format.ts`: `formatPrice()` — returns `RM 4,299`.
- `lib/policies.ts`: centralized policy text.
- `lib/email.ts`: Resend integration for order emails.
- `lib/prisma.ts`: PrismaClient singleton with `PrismaPg` adapter.
- `lib/WishlistContext.tsx`: localStorage-persisted wishlist.
- `lib/CartContext.tsx`: localStorage-persisted cart with hydration guard.
- `lib/motion.ts`: materialEase, fade variants, useReducedMotion.
- `lib/useSearch.ts`: debounced search hook.
- `lib/utils.ts`: `cn()` via clsx + tailwind-merge.
- `lib/navigation.ts`: hardcoded mega menu categories (no longer used by Navbar but kept for reference).
- `types/index.ts`: `ProductCardProps` (images[]), `ConditionGrade`, `CartItem`.
- `components/layout/Navbar.tsx`: simplified 3-column grid — left text links (`text-[13px] font-medium`), center logo (`text-xl font-bold`), right search bar + cart.
- `components/layout/NavbarWrapper.tsx`: hides `<Navbar />` on `/admin` paths.
- `components/layout/SearchModal.tsx`: search input with results dropdown, used directly in header nav.
- `components/layout/Footer.tsx`: SSM, address, contact, legal links.
- `components/layout/PageTransition.tsx`: AnimatePresence with fade variants.
- `components/home/HeroSection.tsx`: parallax-scroll hero.
- `components/ui/ProductCard.tsx`: `bg-white`, `aspect-square bg-[#f4f4f4] rounded-2xl p-6 flex items-center justify-center`, image `<img>` tag `max-w-full max-h-full object-contain`, badges `bg-black text-white rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest top-3 left-3 flex-row`, title `text-[14px] text-black font-medium mt-3`, price `text-[14px] text-[#666] mt-1`, heart `bg-white/80 rounded-full`.
- `components/ui/CategoryCarousel.tsx`: horizontal scroll carousel with snap, drag-to-scroll, segmented index ticks, ghost arrows, drag hint, depth-of-field scaling, edge fade mask, condition badges.
- `components/ui/ConditionReport.tsx`: grade badge (colour hierarchy, pill shape), mount/format/shutter count.
- `components/ui/ReviewSection.tsx`: avg rating, approved reviews, submission form. Editorial heading + sharp focus state.
- `components/ui/Gallery.tsx`: fixed `h-[480px]`, `bg-[#f5f5f5]`, `object-contain p-6`, no hover/transitions/box-shadow, thumbnails `64×64` with `opacity-60` inactive, vertical left strip on desktop.
- `components/ui/MultiImageUpload.tsx`: react-easy-crop v6, 4:3 crop, default zoom=1, bg `#1A1A1A`, appends to ref `uploadedInBatchRef` on crop confirm.
- `components/ui/WhatsAppButton.tsx`: floating WA link with desktop hover tooltip.
- `components/ui/AddToCartButton.tsx`: `formatPrice()` in button label.
- `components/ui/Button.tsx`: primary variant `h-14 text-[15px] uppercase font-semibold`, status prop (loading spinner, success checkmark).
- `components/ui/StickyAddToCart.tsx`: mobile sticky bar, `formatPrice()`.
- `components/ui/CartDrawer.tsx`: line items + subtotal use `formatPrice()`.
- `components/shop/PinnedScrollSequence.tsx`: NEW — pinned scroll-driven crossfade through 3 story beats. Uses `useScroll`/`useTransform` for opacity mapping, native CSS `sticky` positioning, progress bar via `scaleY` on `scrollYProgress`. Reduced motion → static `whileInView` stack. Mobile (<768px) → disables pinning, uses static stack.
- `components/shop/GradingScale.tsx`: NEW — 4-panel MINT/EXCELLENT/GOOD/FAIR explainer with `whileInView` stagger, grade-colored labels/bars.
- `components/shop/PrelovedEditClient.tsx`: Complete rewrite — static image hero, inline trust strip, GradingScale, PinnedScrollSequence, editorial masonry gallery with conditionNotes on hover, PrelovedEditorial. Removed MarqueeStrip + ConditionFilterBar + ProductHoverCarousel imports.
- `components/shop/FilterSidebar.tsx`: accordion — headers `text-[13px] font-semibold text-black mb-4` with `+`/`−`, sub-items `text-[13px] text-[#333] hover:text-black`, checkboxes `w-4 h-4 border-gray-300 rounded-sm focus:ring-black cursor-pointer`, `border-b border-[#EBEBEB]` dividers, FILTERS (N) header with Clear button.
- `components/shop/SortSelect.tsx`: `text-[11px] font-medium uppercase tracking-[0.1em] border border-[#D8D8D8] bg-white rounded-none`.
- `components/admin/ProductForm.tsx`: card-based two-column redesign, per-field validation, auto-slug, breadcrumbs, delete-with-confirmation.
- `app/layout.tsx`: CartProvider + WishlistProvider + NavbarWrapper + PageTransition + Footer + WhatsAppButton.
- `app/page.tsx`: fetches products grouped by category (`take: 2`), renders HeroSection + MarqueeStrip + "Shop by Category" + 3 category sections using `grid grid-cols-2 gap-px bg-[#EBEBEB]`. Section headers use `border-t border-[#1A1A1A] pt-4 mb-6`. Section spacing `mb-20`. Page top padding `pt-12`.
- `app/shop/page.tsx`: `bg-white`, category pills row (`border border-gray-300 rounded-full`), grid `gap-x-6 gap-y-10`, sidebar `w-56`, header `text-[28px] font-bold tracking-tight`, product count `text-[11px] uppercase` grouped with sort on right (`justify-end`).
- `app/shop/preloved-edit/page.tsx`: server page, fetches preloved products only, renders `<PrelovedEditClient />`.
- `app/product/[slug]/page.tsx`: gallery (fixed height, neutral bg, object-contain), condition report (mount/format/shutter), policy block, spec table as `<dl>` with `divide-y`, reviews, related products, stock scarcity, sticky mobile add-to-cart, JSON-LD with "MYR", CTA button `h-14` uppercase.
- `app/wishlist/page.tsx`: editorial header + client-side product filter by localStorage wishlist.
- `app/admin/login/page.tsx`: split-screen admin login.
- `app/admin/(dashboard)/layout.tsx`: dark sidebar (`#111`), wordmark, nav with active state, inline sign-out confirm modal.
- `app/admin/(dashboard)/page.tsx`: 4 metric cards, recent orders table, low-stock alerts.
- `app/admin/(dashboard)/products/` + `ProductsClient.tsx`: search, edit/delete, stock badges, `formatPrice()`.
- `app/admin/(dashboard)/orders/` + `OrdersClient.tsx`: search, pill badges, `formatPrice()`.
- `app/admin/(dashboard)/orders/[id]/` + `OrderDetailClient.tsx`: status toggle, courier tracking, `formatPrice()`.
- `app/admin/(dashboard)/reviews/` + `ReviewModeration.tsx`: empty state, star ratings, approve/reject.
- `app/api/products/route.ts`: POST (create, passes mount/format + images array).
- `app/api/products/[id]/route.ts`: PATCH (update, passes mount/format + images array) + DELETE.
- `app/api/orders/[id]/route.ts`: PATCH (status, courierName, trackingNumber).
- `app/api/reviews/route.ts`: POST (create review).
- `app/api/reviews/[id]/route.ts`: PATCH (approve/reject).
- `app/api/payment/callback/route.ts`: decrements stockQuantity on success.
- `app/api/auth/[...nextauth]/route.ts`: `pages.signIn` set to `/login`.
- `middleware.ts`: `pages.signIn` set to `/login`.
- `next.config.ts`: remotePatterns for supabase.co + unsplash.
- `app/not-found.tsx`: camera-themed 404.
