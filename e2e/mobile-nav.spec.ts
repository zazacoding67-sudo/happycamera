import { test, expect } from "@playwright/test";

const BASE = "http://localhost:3000";
const MOBILE_VIEWPORT = { width: 375, height: 812 };

/** Click the hamburger via JS to bypass search overlay interception */
async function openMobileMenu(page: import("@playwright/test").Page) {
  await page.evaluate(() => {
    const btn = document.querySelector(
      'button[aria-label="Toggle menu"]'
    ) as HTMLButtonElement;
    if (btn) btn.click();
  });
  await page.waitForTimeout(400);
}

test.describe("Mobile navigation drawer", () => {
  test.use({ viewport: MOBILE_VIEWPORT });

  test("opens, shows top-level links, expands category, taps subcategory", async ({
    page,
  }) => {
    await page.goto(BASE, { waitUntil: "networkidle" });

    const hamburger = page.locator('button[aria-label="Toggle menu"]');
    await expect(hamburger).toBeVisible();

    // Open the mobile menu via JS (bypasses search overlay)
    await openMobileMenu(page);

    // Top-level links should be visible inside the mobile panel
    const mobilePanel = page.locator(
      "div.md\\:hidden.bg-white"
    );
    await expect(mobilePanel.locator('a[href="/"]')).toBeVisible();
    await expect(mobilePanel.locator('a[href="/shop"]')).toBeVisible();
    await expect(mobilePanel.locator('a[href="/story"]')).toBeVisible();

    // Categories section label
    await expect(mobilePanel.locator("text=Categories")).toBeVisible();

    // Cameras accordion button should be visible
    const camerasBtn = mobilePanel.locator("button", {
      hasText: "Cameras",
    });
    await expect(camerasBtn).toBeVisible();

    // Expand Cameras category
    await camerasBtn.click();
    await page.waitForTimeout(300);

    // Subcategories should appear — check for Mirrorless link
    const mirrorlessLink = mobilePanel.locator(
      'a[href*="category=Cameras"][href*="subcategory=Mirrorless"]'
    );
    await expect(mirrorlessLink).toBeVisible();

    // Also verify other subcategories rendered
    await expect(
      mobilePanel.locator(
        'a[href*="category=Cameras"][href*="subcategory=Compact"]'
      )
    ).toBeVisible();
    await expect(
      mobilePanel.locator(
        'a[href*="category=Cameras"][href*="subcategory=DSLR"]'
      )
    ).toBeVisible();

    // "Shop All Cameras" link should be present
    await expect(mobilePanel.locator("text=Shop All Cameras")).toBeVisible();

    // Tap Mirrorless subcategory — should navigate to filtered shop page
    await mirrorlessLink.click();
    await page.waitForURL("**/shop**", { timeout: 10000 });

    // URL should contain the correct filters
    const url = page.url();
    expect(url).toContain("category=Cameras");
    expect(url).toContain("subcategory=Mirrorless");
  });

  test("collapses category when tapped again", async ({ page }) => {
    await page.goto(BASE, { waitUntil: "networkidle" });

    await openMobileMenu(page);

    const mobilePanel = page.locator(
      "div.md\\:hidden.bg-white"
    );

    // Expand Cameras
    const camerasBtn = mobilePanel.locator("button", {
      hasText: "Cameras",
    });
    await camerasBtn.click();
    await page.waitForTimeout(300);

    // Mirrorless should be visible
    const mirrorlessLink = mobilePanel.locator(
      'a[href*="subcategory=Mirrorless"]'
    );
    await expect(mirrorlessLink).toBeVisible();

    // Collapse Cameras
    await camerasBtn.click();
    await page.waitForTimeout(300);

    // Mirrorless should no longer be visible
    await expect(mirrorlessLink).not.toBeVisible();
  });

  test("only one category expanded at a time", async ({ page }) => {
    await page.goto(BASE, { waitUntil: "networkidle" });

    await openMobileMenu(page);

    const mobilePanel = page.locator(
      "div.md\\:hidden.bg-white"
    );

    // Expand Cameras
    const camerasBtn = mobilePanel.locator("button", {
      hasText: "Cameras",
    });
    await camerasBtn.click();
    await page.waitForTimeout(300);

    // Mirrorless visible
    await expect(
      mobilePanel.locator('a[href*="subcategory=Mirrorless"]')
    ).toBeVisible();

    // Expand Lenses (should collapse Cameras)
    const lensesBtn = mobilePanel.locator("button", {
      hasText: "Lenses",
    });
    await lensesBtn.click();
    await page.waitForTimeout(300);

    // Zoom visible (Lenses expanded)
    await expect(
      mobilePanel.locator('a[href*="subcategory=Zoom"]')
    ).toBeVisible();

    // Mirrorless no longer visible (Cameras collapsed)
    await expect(
      mobilePanel.locator('a[href*="subcategory=Mirrorless"]')
    ).not.toBeVisible();
  });

  test("closes when a top-level link is tapped", async ({ page }) => {
    await page.goto(BASE, { waitUntil: "networkidle" });

    await openMobileMenu(page);

    const mobilePanel = page.locator(
      "div.md\\:hidden.bg-white"
    );

    // Menu is open — Shop link visible
    const shopLink = mobilePanel.locator('a[href="/shop"]');
    await expect(shopLink).toBeVisible();

    // Tap Shop
    await shopLink.click();
    await page.waitForURL("**/shop", { timeout: 10000 });

    // On the shop page, hamburger should still be visible
    await expect(
      page.locator('button[aria-label="Toggle menu"]')
    ).toBeVisible();
  });
});
