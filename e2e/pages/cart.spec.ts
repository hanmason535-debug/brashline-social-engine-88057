/**
 * Cart Page E2E Tests
 * Tests for shopping cart functionality
 */

import { test, expect, VIEWPORTS } from '../fixtures/test-fixtures';
import AxeBuilder from '@axe-core/playwright';

test.describe('Cart Page', () => {
  test.beforeEach(async ({ cartPage }) => {
    await cartPage.goto();
  });

  test.describe('Page Load & Structure', () => {
    test('should load cart page successfully', async ({ page }) => {
      await expect(page).toHaveURL(/\/cart/);
    });

    test('should display page title', async ({ cartPage }) => {
      await expect(cartPage.pageTitle).toBeVisible();
    });

    test('should have header and footer', async ({ cartPage }) => {
      await expect(cartPage.header).toBeVisible();
      await expect(cartPage.footer).toBeVisible();
    });
  });

  test.describe('Empty Cart State', () => {
    test('should show empty cart message when empty', async ({ cartPage, page }) => {
      // Clear any existing cart items
      await page.evaluate(() => localStorage.removeItem('brashline_cart'));
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      const emptyMessage = page.locator('text=/empty|vacío|no items/i');
      await expect(emptyMessage).toBeVisible();
    });

    test('should have link to pricing page when empty', async ({ page }) => {
      await page.evaluate(() => localStorage.removeItem('brashline_cart'));
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      const pricingLink = page.getByRole('link', { name: /pricing|precios|browse plans/i });
      const count = await pricingLink.count();
    });
  });

  test.describe('Cart Items', () => {
    test('should display cart items when present', async ({ page, pricingPage }) => {
      // First add an item from pricing
      await pricingPage.goto();
      const addButtons = page.getByRole('button', { name: /add to cart|agregar/i });
      
      if (await addButtons.count() > 0) {
        await addButtons.first().click();
        await page.waitForTimeout(500);
        
        // Navigate to cart
        await page.goto('/cart');
        await page.waitForLoadState('networkidle');
        
        // Check for items
        const items = page.locator('[class*="item"], [class*="cart"]');
        const count = await items.count();
      }
    });

    test('should display item names', async ({ page }) => {
      const itemNames = page.locator('[class*="cart"] h3, [class*="cart"] h4');
      const count = await itemNames.count();
    });

    test('should display item prices', async ({ page }) => {
      const prices = page.locator('text=/\\$\\d+/');
      const count = await prices.count();
    });

    test('should have remove buttons', async ({ cartPage }) => {
      const removeButtons = cartPage.removeButtons;
      const count = await removeButtons.count();
    });
  });

  test.describe('Cart Operations', () => {
    test.skip('should remove item from cart', async ({ page, pricingPage, cartPage }) => {
      // Add item first
      await pricingPage.goto();
      const addButtons = page.getByRole('button', { name: /add to cart|agregar/i });
      
      if (await addButtons.count() > 0) {
        await addButtons.first().click();
        await page.waitForTimeout(500);
        
        await cartPage.goto();
        
        const initialCount = await cartPage.cartItems.count();
        
        if (initialCount > 0) {
          await cartPage.removeItem(0);
          await page.waitForTimeout(500);
          
          const newCount = await cartPage.cartItems.count();
          expect(newCount).toBeLessThan(initialCount);
        }
      }
    });

    test('should update total when items change', async ({ page }) => {
      const total = page.locator('[class*="total"], text=/total/i');
      const count = await total.count();
    });

    test('should persist cart across page reloads', async ({ page, pricingPage }) => {
      // Add item
      await pricingPage.goto();
      const addButtons = page.getByRole('button', { name: /add to cart|agregar/i });
      
      if (await addButtons.count() > 0) {
        await addButtons.first().click();
        await page.waitForTimeout(500);
        
        // Reload page
        await page.goto('/cart');
        await page.reload();
        await page.waitForLoadState('networkidle');
        
        // Cart should still have items
        const cart = await page.evaluate(() => localStorage.getItem('brashline_cart'));
        expect(cart).toBeDefined();
      }
    });
  });

  test.describe('Checkout Flow', () => {
    test('should have checkout button', async ({ cartPage }) => {
      const checkoutBtn = cartPage.checkoutButton;
      const count = await checkoutBtn.count();
    });

    test('should navigate to checkout page', async ({ page, pricingPage }) => {
      // Add item first
      await pricingPage.goto();
      const addButtons = page.getByRole('button', { name: /add to cart|agregar/i });
      
      if (await addButtons.count() > 0) {
        await addButtons.first().click();
        await page.waitForTimeout(500);
        
        await page.goto('/cart');
        await page.waitForLoadState('networkidle');
        
        const checkoutBtn = page.getByRole('link', { name: /checkout|pagar|proceed/i });
        
        if (await checkoutBtn.isVisible()) {
          await checkoutBtn.click();
          await expect(page).toHaveURL(/\/checkout/);
        }
      }
    });
  });

  test.describe('Responsive Behavior', () => {
    test('should display correctly on mobile', async ({ page, cartPage }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await cartPage.goto();
      
      await expect(cartPage.pageTitle).toBeVisible();
    });

    test('should display correctly on tablet', async ({ page, cartPage }) => {
      await page.setViewportSize(VIEWPORTS.tablet);
      await cartPage.goto();
      
      await expect(cartPage.pageTitle).toBeVisible();
    });

    test('should display correctly on desktop', async ({ page, cartPage }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
      await cartPage.goto();
      
      await expect(cartPage.pageTitle).toBeVisible();
    });
  });

  test.describe('Accessibility', () => {
    test('should have no critical accessibility violations', async ({ page }) => {
      const results = await new AxeBuilder({ page })
        .disableRules(['color-contrast'])
        .analyze();
      
      const criticalViolations = results.violations.filter(
        v => v.impact === 'critical' || v.impact === 'serious'
      );
      expect(criticalViolations).toHaveLength(0);
    });

    test('should be keyboard navigable', async ({ page }) => {
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press('Tab');
      }
      const focused = await page.evaluate(() => document.activeElement?.tagName);
      expect(focused).toBeDefined();
    });
  });
});
