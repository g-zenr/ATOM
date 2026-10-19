import { expect, test } from "@playwright/test";

/**
 * Smoke coverage for the ATOM shell and its auth boundaries.
 * Authenticated flows are covered by the manual verification in
 * docs/NEXTJS-STANDARDS.md — this suite stays deterministic and anonymous.
 */

test.describe("ATOM public shell", () => {
  test("landing page renders the brand", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "ATOM" })).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Open dashboard" }),
    ).toBeVisible();
  });

  test("protected routes redirect to sign-in", async ({ page }) => {
    for (const route of ["/dashboard", "/notes", "/tasks", "/time"]) {
      await page.goto(route);
      await expect(page).toHaveURL(/\/auth\/sign-in$/);
    }
  });

  test("sign-in page renders an accessible form", async ({ page }) => {
    await page.goto("/auth/sign-in");
    await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
  });

  test("health endpoint reports database status without a token", async ({
    request,
  }) => {
    const response = await request.get("/api/health");
    expect(response.status()).toBe(200);
    expect(await response.json()).toMatchObject({ db: "up" });
  });

  test("API endpoints require the bearer token", async ({ request }) => {
    for (const route of ["/api/notes", "/api/tasks", "/api/time"]) {
      const response = await request.get(route);
      expect(response.status()).toBe(401);
    }
  });

  test("unknown routes render the 404 page", async ({ page }) => {
    await page.goto("/this-element-does-not-exist");
    await expect(page.getByText("This element doesn’t exist")).toBeVisible();
  });
});
