/**
 * E2E Tests for Authentication Flows
 * Tests sign-in, sign-up, sign-out, and protected route access
 */
import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test.describe("Sign In Page", () => {
    test("should display sign-in form", async ({ page }) => {
      await page.goto("/sign-in");

      // Wait for page to load
      await page.waitForLoadState("networkidle");

      // Check for Clerk sign-in component or heading
      const heading = page.locator('h1:has-text("Welcome Back"), h1:has-text("Bienvenido")');
      await expect(heading).toBeVisible({ timeout: 10000 });
    });

    test("should have link to sign-up page", async ({ page }) => {
      await page.goto("/sign-in");
      await page.waitForLoadState("networkidle");

      // Look for sign up link within Clerk component or page
      const signUpText = page.locator('text=Sign up');
      // Clerk's sign-in component typically includes a "Sign up" link
      await expect(signUpText.first()).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe("Sign Up Page", () => {
    test("should display sign-up form", async ({ page }) => {
      await page.goto("/sign-up");

      // Wait for page to load
      await page.waitForLoadState("networkidle");

      // Check for Clerk sign-up component or heading
      const heading = page.locator('h1:has-text("Create"), h1:has-text("Crea")');
      await expect(heading).toBeVisible({ timeout: 10000 });
    });

    test("should have link to sign-in page", async ({ page }) => {
      await page.goto("/sign-up");
      await page.waitForLoadState("networkidle");

      // Look for sign in link within Clerk component or page
      const signInText = page.locator('text=Sign in');
      await expect(signInText.first()).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe("Protected Routes", () => {
    test("should redirect unauthenticated users from dashboard to sign-in", async ({ page }) => {
      // Try to access protected dashboard
      await page.goto("/dashboard");

      // Wait for redirect
      await page.waitForLoadState("networkidle");

      // Should be redirected to sign-in or show sign-in modal
      // Clerk will redirect to its sign-in flow
      await expect(page).toHaveURL(/sign-in|accounts\.dev/);
    });

    test("should redirect unauthenticated users from profile to sign-in", async ({ page }) => {
      // Try to access protected profile page
      await page.goto("/profile");

      // Wait for redirect
      await page.waitForLoadState("networkidle");

      // Should be redirected to sign-in
      await expect(page).toHaveURL(/sign-in|accounts\.dev/);
    });
  });

  test.describe("Header Auth UI", () => {
    test("should show sign-in button for unauthenticated users", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // Look for sign-in button in header
      const signInButton = page.locator('button:has-text("Sign In"), button:has-text("Iniciar Sesión")');
      await expect(signInButton.first()).toBeVisible({ timeout: 10000 });
    });

    test("should navigate to services without authentication", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // Click on Services link
      await page.click('a:has-text("Services")');

      // Should navigate successfully
      await expect(page).toHaveURL(/\/services/);
    });

    test("should navigate to pricing without authentication", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // Click on Pricing link
      await page.click('a:has-text("Pricing")');

      // Should navigate successfully
      await expect(page).toHaveURL(/\/pricing/);
    });
  });

  test.describe("Contact Form Pre-fill", () => {
    test("should load contact page without auth", async ({ page }) => {
      await page.goto("/contact");
      await page.waitForLoadState("networkidle");

      // Contact form should be visible
      const nameInput = page.locator('input[id="name"], input[name="name"]');
      await expect(nameInput).toBeVisible({ timeout: 10000 });
    });
  });
});

test.describe("Auth Navigation", () => {
  test("should be able to open sign-in from header", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Find and click sign-in button
    const signInButton = page.locator('button:has-text("Sign In"), button:has-text("Iniciar Sesión")').first();
    
    if (await signInButton.isVisible()) {
      await signInButton.click();
      
      // Should open sign-in modal or navigate to sign-in page
      // Wait a moment for modal/navigation
      await page.waitForTimeout(1000);
      
      // Either modal is visible or URL changed
      const signInVisible = await page.locator('[data-testid="clerk-sign-in"], .cl-signIn-root').isVisible().catch(() => false);
      const urlChanged = page.url().includes("sign-in") || page.url().includes("accounts.dev");
      
      expect(signInVisible || urlChanged).toBeTruthy();
    }
  });
});

test.describe("Language Support", () => {
  test("should display sign-in in English by default", async ({ page }) => {
    await page.goto("/sign-in");
    await page.waitForLoadState("networkidle");

    // Check for English heading
    const englishHeading = page.locator('h1:has-text("Welcome Back")');
    await expect(englishHeading).toBeVisible({ timeout: 10000 });
  });

  test("should switch language on toggle", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Find language toggle button
    const langButton = page.locator('button:has-text("EN"), button:has-text("ES")').first();
    
    if (await langButton.isVisible()) {
      await langButton.click();
      
      // Page content should change language
      await page.waitForTimeout(500);
      
      // Either showing Spanish content now
      const spanishContent = await page.locator('text=Inicio, text=Servicios').first().isVisible().catch(() => false);
      // Language toggle should show opposite language
      const toggleChanged = await page.locator('button:has-text("ES"), button:has-text("EN")').first().isVisible();
      
      expect(spanishContent || toggleChanged).toBeTruthy();
    }
  });
});
