import { test, expect, type Page, type Locator } from "@playwright/test";

const BASE = "http://localhost:3000";

function megaMenu(page: Page) {
  return page.locator('[data-mega-menu="true"]').last();
}

// The desktop top-level link is covered by an `absolute inset-0` toggle overlay;
// hovering that overlay still triggers the wrapper's onMouseEnter (which opens the menu).
async function openMenu(page: Page, href: string) {
  await page.locator(`nav a[href="${href}"] + div.absolute.inset-0`).hover();
  const menu = megaMenu(page);
  await expect(menu).toBeVisible({ timeout: 5000 });
  return menu;
}

// Asserts every tile renders its curated static image (never a live product photo).
async function expectCuratedTiles(menu: Locator, tiles: [string, string][]) {
  for (const [label, img] of tiles) {
    const link = menu.locator("a.group").filter({ hasText: label });
    await expect(link).toBeVisible();
    await expect(link.locator("img")).toHaveAttribute("src", img);
  }
}

test.describe("mega menu curated images", () => {
  test("cameras panel shows all curated subcategory tiles and never Film", async ({ page }) => {
    await page.goto(BASE, { waitUntil: "networkidle" });

    const menu = await openMenu(page, "/shop");

    for (const label of ["Mirrorless", "Compact", "DSLR", "Cinema", "Instant", "Medium Format"]) {
      await expect(menu.getByText(label, { exact: true }).first()).toBeVisible();
    }

    // Film was removed as a Cameras subcategory entirely
    await expect(menu.getByText("Film", { exact: true })).toHaveCount(0);

    await expectCuratedTiles(menu, [
      ["Mirrorless", "/images/mega-menu/mega-mirrorless.png"],
      ["Compact", "/images/mega-menu/mega-rx100.png"],
      ["DSLR", "/images/mega-menu/mega-dslr.png"],
      ["Cinema", "/images/mega-menu/mega-fx5.png"],
      ["Instant", "/images/mega-menu/mega-instant.png"],
      ["Medium Format", "/images/mega-menu/mega-mediumformat.png"],
    ]);
  });

  test("lenses and accessories panels show curated tiles; no live product images anywhere", async ({ page }) => {
    await page.goto(BASE, { waitUntil: "networkidle" });

    const lensesMenu = await openMenu(page, "/shop?category=Lenses");
    await expectCuratedTiles(lensesMenu, [
      ["Zoom", "/images/mega-menu/mega-zoom.png"],
      ["Mount Adapters", "/images/mega-menu/mega-mount.png"],
      ["Prime", "/images/mega-menu/mega-prime.png"],
      ["Teleconverters", "/images/mega-menu/mega-teleconveter.png"],
    ]);

    const accMenu = await openMenu(page, "/shop?category=Accessories");
    await expectCuratedTiles(accMenu, [
      ["Batteries Chargers and Grips", "/images/mega-menu/mega-battery.png"],
      ["Flashes", "/images/mega-menu/mega-flash.png"],
      ["Lens Filters", "/images/mega-menu/mega-filter.png"],
      ["Memory Cards", "/images/mega-menu/mega-sdcard.png"],
      ["Handles", "/images/mega-menu/mega-handle.png"],
      ["Bags", "/images/mega-menu/mega-bag.png"],
      ["Others", "/images/mega-menu/mega-other.png"],
    ]);

    // The mega menu must never render a live product image (Unsplash/Supabase URLs)
    const productImgs = page.locator(
      '[data-mega-menu="true"] img[src*="images.unsplash.com"], [data-mega-menu="true"] img[src*="supabase.co"]'
    );
    await expect(productImgs).toHaveCount(0);
  });

  test("mirrorless tile filters shop by category + subcategory", async ({ page }) => {
    await page.goto(BASE, { waitUntil: "networkidle" });

    const menu = await openMenu(page, "/shop");

    // Click the Mirrorless tile -> /shop filters by category + subcategory
    await menu.locator('a[href*="subcategory=Mirrorless"]').click();
    await page.waitForURL(/subcategory=Mirrorless/);
    await expect(page.locator("a[href^='/product/']").first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("Sony ZV-E10 II").first()).toBeVisible();
  });
});
