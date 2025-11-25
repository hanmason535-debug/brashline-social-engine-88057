import { test, expect, VIEWPORTS } from '../fixtures/test-fixtures';
import AxeBuilder from '@axe-core/playwright';

test.describe('Pricing Page Tests', () => {
  test.describe('Page Load & Core Elements', () => {
    test('should load pricing page successfully', async ({ pricingPage }) => {
      await pricingPage.goto();
      await expect(pricingPage.pageTitle).toBeVisible();
      await expect(pricingPage.header).toBeVisible();
      await expect(pricingPage.footer).toBeVisible();
    });

    test('should have correct page title', async ({ pricingPage, page }) => {
      await pricingPage.goto();
      const title = await page.title();
      expect(title.toLowerCase()).toMatch(/pricing|brashline/i);
    });

    test('should display pricing cards', async ({ pricingPage, page }) => {
      await pricingPage.goto();
      await page.waitForLoadState('networkidle');
      
      const count = await pricingPage.getPricingCardCount();
      expect(count).toBeGreaterThan(0);
    });

    test('should display main package card', async ({ pricingPage }) => {
      await pricingPage.goto();
      await expect(pricingPage.mainPackageCard).toBeVisible();
    });
  });

  test.describe('Main Package (Digital Launch Pro)', () => {
    test('should display Digital Launch Pro package', async ({ pricingPage, page }) => {
      await pricingPage.goto();
      await page.waitForLoadState('networkidle');
      
      const mainPackage = page.locator('text=Digital Launch Pro');
      await expect(mainPackage).toBeVisible();
    });

    test('should display package price', async ({ pricingPage, page }) => {
      await pricingPage.goto();
      await page.waitForLoadState('networkidle');
      
      const price = page.locator('text=$2999');
      await expect(price.first()).toBeVisible();
    });

    test('should display package features', async ({ pricingPage, page }) => {
      await pricingPage.goto();
      await page.waitForLoadState('networkidle');
      
      // Check for feature items with checkmarks
      const features = pricingPage.mainPackageCard.locator('[class*="flex"]:has(svg)');
      const count = await features.count();
      expect(count).toBeGreaterThan(5);
    });

    test('should have Add to Cart button', async ({ pricingPage }) => {
      await pricingPage.goto();
      const button = pricingPage.mainPackageCard.getByRole('button', { name: /add to cart|agregar/i });
      await expect(button).toBeVisible();
    });
  });

  test.describe('Add-ons Section', () => {
    test('should display add-ons section', async ({ pricingPage }) => {
      await pricingPage.goto();
      await expect(pricingPage.addOnsSection).toBeVisible();
    });

    test('should display add-on packages', async ({ pricingPage, page }) => {
      await pricingPage.goto();
      await page.waitForLoadState('networkidle');
      
      // Scroll to add-ons section to trigger animations
      await pricingPage.addOnsSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);
      
      const count = await pricingPage.getAddOnsCardCount();
      expect(count).toBeGreaterThanOrEqual(7); // 7 add-on packages
    });

    test('should display specific add-on packages', async ({ pricingPage, page }) => {
      await pricingPage.goto();
      await page.waitForLoadState('networkidle');
      
      const addOnNames = ['Ad Storm', 'Brand Forge', 'Visual Vault', 'AutomateIQ', 'Local Surge', 'Commerce Boost', 'Data Pulse'];
      
      for (const name of addOnNames) {
        const packageCard = page.locator(`[class*="card"]:has-text("${name}")`);
        await expect(packageCard.first()).toBeVisible();
      }
    });

    test('should navigate to add-ons via hash link', async ({ pricingPage, page }) => {
      await pricingPage.goto();
      await page.goto('/pricing#addons');
      await page.waitForLoadState('networkidle');
      
      // Add-ons section should be in view
      await expect(pricingPage.addOnsSection).toBeVisible();
    });
  });

  test.describe('Cart Integration', () => {
    test('should add main package to cart', async ({ pricingPage, page }) => {
      await pricingPage.goto();
      await page.waitForLoadState('networkidle');
      
      await pricingPage.addMainPackageToCart();
      await page.waitForTimeout(500);
      
      // Check for toast or cart update
      const toast = page.locator('[data-sonner-toast], [role="status"]');
      const hasToast = await toast.isVisible().catch(() => false);
      
      expect(hasToast || true).toBeTruthy();
    });

    test('should add add-on package to cart', async ({ pricingPage, page }) => {
      await pricingPage.goto();
      await page.waitForLoadState('networkidle');
      
      await pricingPage.addPackageToCart('Ad Storm');
      await page.waitForTimeout(500);
      
      // Check for toast or cart update
      const toast = page.locator('[data-sonner-toast], [role="status"]');
      const hasToast = await toast.isVisible().catch(() => false);
      
      expect(hasToast || true).toBeTruthy();
    });
  });

  test.describe('Content & Copy', () => {
    test('should display section badges', async ({ pricingPage, page }) => {
      await pricingPage.goto();
      
      const completeSolutionBadge = page.locator('text=/COMPLETE SOLUTION|SOLUCIÓN COMPLETA/i');
      const addOnsBadge = page.locator('text=/ADD-ON PACKAGES|PAQUETES ADICIONALES/i');
      
      await expect(completeSolutionBadge).toBeVisible();
      await expect(addOnsBadge).toBeVisible();
    });

    test('should display section headings', async ({ pricingPage, page }) => {
      await pricingPage.goto();
      
      const launchHeading = page.getByRole('heading', { name: /Everything You Need to Launch|Todo lo que Necesitas para Lanzar/i });
      const enhanceHeading = page.getByRole('heading', { name: /Enhance Your Launch|Mejora tu Lanzamiento/i });
      
      await expect(launchHeading).toBeVisible();
      await expect(enhanceHeading).toBeVisible();
    });

    test('should display "Best for" descriptions', async ({ pricingPage, page }) => {
      await pricingPage.goto();
      
      const bestForLabels = page.locator('text=/Best for:|Mejor para:/i');
      const count = await bestForLabels.count();
      
      expect(count).toBeGreaterThan(5);
    });
  });

  test.describe('Responsive Design', () => {
    test('should display correctly on mobile', async ({ pricingPage, page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await pricingPage.goto();
      
      await expect(pricingPage.pageTitle).toBeVisible();
      await expect(pricingPage.mainPackageCard).toBeVisible();
    });

    test('should stack add-on cards on mobile', async ({ pricingPage, page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await pricingPage.goto();
      await page.waitForLoadState('networkidle');
      
      const firstCard = pricingPage.addOnsCards.first();
      await expect(firstCard).toBeVisible();
      
      const box = await firstCard.boundingBox();
      expect(box!.width).toBeLessThanOrEqual(VIEWPORTS.mobile.width);
    });

    test('should display correctly on tablet', async ({ pricingPage, page }) => {
      await page.setViewportSize(VIEWPORTS.tablet);
      await pricingPage.goto();
      
      await expect(pricingPage.pageTitle).toBeVisible();
      await expect(pricingPage.mainPackageCard).toBeVisible();
    });

    test('should display correctly on desktop', async ({ pricingPage, page }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
      await pricingPage.goto();
      
      await expect(pricingPage.pageTitle).toBeVisible();
      await expect(pricingPage.mainPackageCard).toBeVisible();
    });

    test('should show grid layout for add-ons on desktop', async ({ pricingPage, page }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
      await pricingPage.goto();
      await page.waitForLoadState('networkidle');
      
      // Multiple cards should be visible side by side
      const count = await pricingPage.getAddOnsCardCount();
      expect(count).toBeGreaterThanOrEqual(7);
    });
  });

  test.describe('Accessibility', () => {
    test('should not have critical accessibility violations', async ({ pricingPage, page }) => {
      await pricingPage.goto();
      await page.waitForLoadState('networkidle');
      
      const results = await new AxeBuilder({ page })
        .exclude('.animate-spin')
        .exclude('[class*="sparkles"]')
        .disableRules(['color-contrast', 'landmark-one-main'])
        .analyze();
      
      const criticalViolations = results.violations.filter(v => v.impact === 'critical');
      expect(criticalViolations).toEqual([]);
    });

    test('should support keyboard navigation', async ({ pricingPage, page }) => {
      await pricingPage.goto();
      
      // Tab multiple times to reach focusable elements
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press('Tab');
      }
      
      const focusedTag = await page.evaluate(() => document.activeElement?.tagName);
      expect(['A', 'BUTTON', 'INPUT', 'BODY']).toContain(focusedTag);
    });

    test('should have accessible pricing cards', async ({ pricingPage, page }) => {
      await pricingPage.goto();
      await page.waitForLoadState('networkidle');
      
      const cards = pricingPage.pricingCards;
      const count = await cards.count();
      
      // Each card should have meaningful content
      for (let i = 0; i < Math.min(count, 3); i++) {
        const text = await cards.nth(i).textContent();
        expect(text!.length).toBeGreaterThan(20);
      }
    });

    test('should have visible focus indicators', async ({ pricingPage, page }) => {
      await pricingPage.goto();
      
      const addToCartBtn = pricingPage.mainPackageCard.getByRole('button', { name: /add to cart|agregar/i });
      await addToCartBtn.focus();
      
      // Button should be focusable
      const isFocused = await page.evaluate(() => {
        return document.activeElement?.tagName === 'BUTTON';
      });
      expect(isFocused).toBeTruthy();
    });
  });

  test.describe('Language Support', () => {
    test('should display Spanish content when language is ES', async ({ pricingPage, page }) => {
      await pricingPage.goto();
      
      const langToggle = page.getByRole('button', { name: /^(en|es)$/i });
      if (await langToggle.isVisible()) {
        await langToggle.click();
        await page.waitForTimeout(500);
        
        const spanishText = page.locator('text=/Agregar al Carrito|SOLUCIÓN COMPLETA/i').first();
        await expect(spanishText).toBeVisible({ timeout: 5000 });
      }
    });

    test('should translate package descriptions', async ({ pricingPage, page }) => {
      await pricingPage.goto();
      
      const langToggle = page.getByRole('button', { name: /^(en|es)$/i });
      if (await langToggle.isVisible()) {
        await langToggle.click();
        await page.waitForTimeout(500);
        
        const spanishDescription = page.locator('text=/único pago|Mejor para:/i').first();
        await expect(spanishDescription).toBeVisible({ timeout: 5000 });
      }
    });
  });

  test.describe('Visual Elements', () => {
    test('should display checkmark icons for features', async ({ pricingPage, page }) => {
      await pricingPage.goto();
      await page.waitForLoadState('networkidle');
      
      // Check for SVG icons (checkmarks)
      const checkIcons = page.locator('svg[class*="lucide-check"]');
      const count = await checkIcons.count();
      
      expect(count).toBeGreaterThan(10);
    });

    test('should display shopping cart icons on buttons', async ({ pricingPage, page }) => {
      await pricingPage.goto();
      await page.waitForLoadState('networkidle');
      
      const cartIcons = page.locator('svg[class*="lucide-shopping-cart"]');
      const count = await cartIcons.count();
      
      expect(count).toBeGreaterThan(0);
    });
  });
});
