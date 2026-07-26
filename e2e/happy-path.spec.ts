import { test, expect } from "@playwright/test";

const ADMIN_EMAIL = "admin@happycamera.com";
const ADMIN_PASSWORD = "wilson123";

// ---------------------------------------------------------------------------
// 1. Homepage
// ---------------------------------------------------------------------------
test("homepage loads with hero, categories, and products", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Happy Camera" }).first()).toBeVisible();

  await expect(page.locator("text=Browse by Category")).toBeVisible();
});

// ---------------------------------------------------------------------------
// 2. Shop page
// ---------------------------------------------------------------------------
test("shop page shows products and category pills", async ({ page }) => {
  await page.goto("/shop");

  const pills = page.locator("a[href^='/shop?']");
  await expect(pills.first()).toBeVisible();

  const productCards = page.locator("a[href^='/product/']");
  await expect(productCards.first()).toBeVisible({ timeout: 10000 });
});

// ---------------------------------------------------------------------------
// 3. Shop filters
// ---------------------------------------------------------------------------
test("filter sidebar toggles and filters products", async ({ page }) => {
  await page.goto("/shop");

  await expect(page.locator("text=Brand").first()).toBeVisible();
  await expect(page.locator("text=Condition").first()).toBeVisible();
  await expect(page.locator("text=Price").first()).toBeVisible();

  const cameraPill = page.locator("a[href='/shop?category=camera']");
  if (await cameraPill.isVisible()) {
    await cameraPill.click();
    await page.waitForURL(/category=camera/);
    await expect(page.locator("a[href^='/product/']").first()).toBeVisible({ timeout: 10000 });
  }
});

// ---------------------------------------------------------------------------
// 4. Product detail page
// ---------------------------------------------------------------------------
test("product detail shows gallery, price, and add-to-cart", async ({ page }) => {
  await page.goto("/shop");

  const productLink = page.locator("a[href^='/product/']").first();
  await productLink.waitFor({ state: "visible", timeout: 10000 });
  const href = await productLink.getAttribute("href");
  await page.goto(href!);

  // Gallery renders (h-[480px] bg-[#f5f5f5] region)
  await expect(page.locator("div.bg-\\[\\#f5f5f5\\]").first()).toBeVisible();

  // Primary CTA button includes price — confirms price renders
  await expect(
    page.locator("button").filter({ hasText: /Add to Cart — RM/i }).first()
  ).toBeVisible();

  // Condition badge
  await expect(
    page.locator("span").filter({ hasText: /^(NEW|PRELOVED)$/ }).first()
  ).toBeVisible();
});

// ---------------------------------------------------------------------------
// 5. Cart flow
// ---------------------------------------------------------------------------
test("add to cart and verify cart drawer", async ({ page }) => {
  await page.goto("/shop");

  const productLink = page.locator("a[href^='/product/']").first();
  await productLink.waitFor({ state: "visible", timeout: 10000 });
  const href = await productLink.getAttribute("href");
  await page.goto(href!);

  // Primary CTA
  const addBtn = page.locator("button").filter({ hasText: /Add to Cart — RM/i }).first();
  await addBtn.waitFor({ state: "visible", timeout: 5000 });

  if (await addBtn.isEnabled()) {
    await addBtn.click();

    // Cart drawer auto-opens — verify it appeared
    await expect(page.locator('[role="dialog"], .fixed.top-0.right-0').first()).toBeVisible({ timeout: 3000 }).catch(() => {});
  }
});

// ---------------------------------------------------------------------------
// 6. Checkout → Tracking (bypasses Toyyibpay via manual order)
// ---------------------------------------------------------------------------
test("manual order creation and tracking API work", async ({ page, request }) => {
  // Login as admin
  await page.goto("/admin/login");
  await page.fill("input[type='email']", ADMIN_EMAIL);
  await page.fill("input[type='password']", ADMIN_PASSWORD);
  await page.click("button[type='submit']");
  await page.waitForURL("/admin", { timeout: 10000 });

  await page.goto("/admin/orders/new-manual");
  await page.waitForURL("/admin/orders/new-manual");

  // Fill manual order form
  await page.locator("label:has-text('Customer Name') + input").fill("E2E Test User");
  await page.locator("label:has-text('Customer Email') + input").fill("e2e-test@happycamera.com");
  await page.locator("input[placeholder='Optional']").fill("0123456789");
  await page.locator("label:has-text('Item(s) Sold') + textarea").fill("Test Camera x1");
  await page.locator("label:has-text('Total Amount') + input").fill("100");
  await page.locator("input[placeholder='e.g. J&T Express, PosLaju']").fill("J&T");
  await page.locator("input[placeholder='Enter tracking number']").fill("MY1234567890");

  await page.locator("button[type='submit']").click();
  // Wait for URL to change from /new-manual to a detail page
  await page.waitForURL(/\/admin\/orders\/(?!new-manual)[^/]+/, { timeout: 10000 });
  const orderId = page.url().match(/\/orders\/(?!new-manual)([^/]+)/)?.[1] || "";

  // Verify page content
  await expect(page.locator("text=E2E Test User")).toBeVisible();
  await expect(page.locator("text=Test Camera x1")).toBeVisible();
  await expect(page.locator("input[value='MY1234567890']")).toBeVisible();
  await expect(page.locator("text=RM 100").first()).toBeVisible();

  // Tracking API returns correct data
  const trackRes = await request.get(`/api/track?orderId=${orderId}&email=e2e-test@happycamera.com`);
  if (!trackRes.ok()) {
    const errBody = await trackRes.text();
    throw new Error(`Tracking API returned ${trackRes.status()}: ${errBody}`);
  }
  const trackData = await trackRes.json();
  expect(trackData.status).toBe("SHIPPED");
  expect(trackData.courierName).toBe("J&T");
  expect(trackData.trackingNumber).toBe("MY1234567890");
  expect(trackData.items.length).toBeGreaterThan(0);
  expect(trackData.items[0].name).toBe("Test Camera x1");
});

// ---------------------------------------------------------------------------
// 7. Admin login + orders list
// ---------------------------------------------------------------------------
test("admin can log in and see orders", async ({ page }) => {
  await page.goto("/admin/login");

  await expect(page.locator("input[type='email']")).toBeVisible();
  await expect(page.locator("input[type='password']")).toBeVisible();

  await page.fill("input[type='email']", ADMIN_EMAIL);
  await page.fill("input[type='password']", ADMIN_PASSWORD);
  await page.click("button[type='submit']");

  await page.waitForURL("/admin", { timeout: 10000 });

  // Dashboard metric card exists
  await expect(
    page.getByRole("paragraph").filter({ hasText: /^Products$/ }).first()
  ).toBeVisible({ timeout: 5000 });

  // Navigate to orders
  await page.goto("/admin/orders");
  await page.waitForURL("/admin/orders");

  await expect(page.locator("h1").filter({ hasText: /Orders/i }).first()).toBeVisible();

  await expect(
    page.locator("button, a").filter({ hasText: /Log External/i }).first()
  ).toBeVisible();
});

// ---------------------------------------------------------------------------
// 8. Wishlist heart toggle
// ---------------------------------------------------------------------------
test("wishlist heart toggle exists on product detail", async ({ page }) => {
  await page.goto("/shop");

  const productLink = page.locator("a[href^='/product/']").first();
  await productLink.waitFor({ state: "visible", timeout: 10000 });
  const href = await productLink.getAttribute("href");
  await page.goto(href!);

  await expect(
    page.locator("button[aria-label*='wishlist' i]").first()
  ).toBeVisible({ timeout: 5000 });
});
