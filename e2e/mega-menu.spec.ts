import { test, expect, type Page } from "@playwright/test";

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

test.describe("mega menu taxonomy", () => {
  test("shows only populated subcategories and filters shop on click", async ({ page }) => {
    await page.goto(BASE, { waitUntil: "networkidle" });

    const menu = await openMenu(page, "/shop");

    // Populated subcategories render as tiles
    for (const label of ["Mirrorless", "Compact", "DSLR"]) {
      await expect(menu.getByText(label, { exact: true }).first()).toBeVisible();
    }

    // Empty subcategories must not appear (no in-stock products for them)
    for (const empty of [
      "Cinema",
      "Instant",
      "Film",
      "Medium Format",
      "Zoom",
      "Mount Adapters",
      "Teleconverters",
      "Memory Cards",
      "Handles",
    ]) {
      await expect(menu.getByText(empty, { exact: true })).toHaveCount(0);
    }

    // Click the Mirrorless tile -> /shop filters by category + subcategory
    await menu.locator('a[href*="subcategory=Mirrorless"]').click();
    await page.waitForURL(/subcategory=Mirrorless/);
    await expect(page.locator("a[href^='/product/']").first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("Sony ZV-E10 II").first()).toBeVisible();
  });

  test("lenses menu shows only Prime; accessories menu shows populated tiles", async ({ page }) => {
    await page.goto(BASE, { waitUntil: "networkidle" });

    // Lenses
    const lensesMenu = await openMenu(page, "/shop?category=Lenses");
    await expect(lensesMenu.getByText("Prime", { exact: true }).first()).toBeVisible();
    await expect(lensesMenu.getByText("Zoom", { exact: true })).toHaveCount(0);

    // Camera Accessories
    const accMenu = await openMenu(page, "/shop?category=Accessories");
    for (const label of ["Flashes", "Bags", "Others"]) {
      await expect(accMenu.getByText(label, { exact: true }).first()).toBeVisible();
    }
    await expect(accMenu.getByText("Memory Cards", { exact: true })).toHaveCount(0);
  });
});
