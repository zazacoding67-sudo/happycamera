import { test, expect } from "@playwright/test";

test.describe("shop filter fixes", () => {
  test("badge count only tracks brand/condition/price", async ({ page }) => {
    // no params -> no badge
    await page.goto("/shop");
    await expect(page.getByText("Filters", { exact: true })).toBeVisible();

    // category pill only -> no badge
    await page.goto("/shop?category=digital-bodies");
    await expect(page.getByText("Filters", { exact: true })).toBeVisible();
    await expect(page.locator("a[href^='/shop?category=']").first()).toBeVisible();
    const countWithCategoryOnly = page.locator(".border-black", { hasText: /^\d+$/ });
    await expect(countWithCategoryOnly).toHaveCount(0);

    // category + condition (homepage link) -> 1 (condition only)
    await page.goto("/shop?category=digital-bodies&condition=new");
    const count1 = page.locator("span").filter({ hasText: /^1$/ }).locator("visible=true").first();
    await expect(count1).toBeVisible();

    // brand + price -> 2
    await page.goto("/shop?brand=sony&minPrice=1000&maxPrice=3000");
    const count2 = page.locator("span").filter({ hasText: /^2$/ }).locator("visible=true").first();
    await expect(count2).toBeVisible();
  });

  test("brand list dedupes case-insensitively and matches case-insensitively", async ({ page }) => {
    await page.goto("/shop?brand=sony");
    // open the Brand accordion
    await page.getByRole("button", { name: "Brand", exact: true }).click();
    // brand filter should find all 4 Sony products, checkbox checked
    const sonyLabel = page.locator("label").filter({ has: page.getByText("Sony", { exact: true }) }).first();
    await expect(sonyLabel.locator('input[type="checkbox"]')).toBeChecked();
    // grid shows 4 products (2 product links per card = 8 anchors)
    const cards = page.locator("a[href^='/product/']");
    await expect(cards).toHaveCount(8);
    // only ONE brand entry for sony in the sidebar (no duplicate casing)
    const sidebar = page.locator("aside");
    await expect(sidebar.getByText("Sony", { exact: true })).toHaveCount(1);
  });
});
