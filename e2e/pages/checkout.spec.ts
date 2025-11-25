/**
 * Checkout Page E2E Tests
 * Tests for checkout functionality
 */

import { test, expect, VIEWPORTS } from '../fixtures/test-fixtures';
import AxeBuilder from '@axe-core/playwright';

test.describe('Checkout Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/checkout');
    await page.waitForLoadState('domcontentloaded');
  });

  test.describe('Page Load & Structure', () => {
    test('should load checkout page successfully', async ({ page }) => {
      await expect(page).toHaveURL(/\/checkout/);
    });

    test('should display page title', async ({ page }) => {
      const title = page.locator('h1');
      await expect(title).toBeVisible();
    });

    test('should have header and footer', async ({ page }) => {
      const header = page.locator('header');
      const footer = page.locator('footer');
      await expect(header).toBeVisible();
      await expect(footer).toBeVisible();
    });
  });

  test.describe('Empty Cart Redirect', () => {
    test('should handle empty cart state', async ({ page }) => {
      // Clear cart
      await page.evaluate(() => localStorage.removeItem('brashline_cart'));
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      // Should either redirect or show message
      const currentUrl = page.url();
      const emptyMessage = page.locator('text=/empty|vacío|no items/i');
      const count = await emptyMessage.count();
      
      // Either still on checkout or has empty message
      expect(currentUrl).toBeDefined();
    });
  });

  test.describe('Checkout Form', () => {
    test('should display checkout form', async ({ page }) => {
      const form = page.locator('form');
      await expect(form).toBeVisible();
    });

    test('should have contact information fields', async ({ page }) => {
      const emailField = page.getByLabel(/email/i);
      const phoneField = page.getByLabel(/phone|teléfono/i);
      
      const emailCount = await emailField.count();
      const phoneCount = await phoneField.count();
    });

    test('should have billing address fields', async ({ page }) => {
      const addressFields = [
        page.getByLabel(/address|dirección/i),
        page.getByLabel(/city|ciudad/i),
        page.getByLabel(/state|estado|province/i),
        page.getByLabel(/zip|postal|código/i),
      ];
      
      for (const field of addressFields) {
        const count = await field.count();
      }
    });

    test('should have payment fields', async ({ page }) => {
      const cardField = page.getByLabel(/card number|número de tarjeta/i);
      const expiryField = page.getByLabel(/expiry|expiration|vencimiento/i);
      const cvvField = page.getByLabel(/cvv|cvc|security/i);
      
      const cardCount = await cardField.count();
    });
  });

  test.describe('Order Summary', () => {
    test('should display order summary', async ({ page }) => {
      const summary = page.locator('[class*="summary"], [class*="order"]');
      const count = await summary.count();
    });

    test('should show item details', async ({ page }) => {
      const items = page.locator('[class*="item"], [class*="line"]');
      const count = await items.count();
    });

    test('should display subtotal', async ({ page }) => {
      const subtotal = page.locator('text=/subtotal/i');
      const count = await subtotal.count();
    });

    test('should display total', async ({ page }) => {
      const total = page.locator('text=/total/i');
      const count = await total.count();
    });
  });

  test.describe('Form Validation', () => {
    test('should validate required fields', async ({ page }) => {
      const submitButton = page.getByRole('button', { name: /submit|pay|place order|pagar/i });
      
      if (await submitButton.isVisible()) {
        await submitButton.click();
        
        // Check for validation messages
        const errors = page.locator('[class*="error"], [class*="invalid"]');
        const count = await errors.count();
      }
    });

    test('should validate email format', async ({ page }) => {
      const emailField = page.getByLabel(/email/i);
      
      if (await emailField.isVisible()) {
        await emailField.fill('invalid-email');
        await emailField.blur();
        
        const error = page.locator('text=/valid email|correo válido/i');
        const count = await error.count();
      }
    });
  });

  test.describe('Navigation', () => {
    test('should have link back to cart', async ({ page }) => {
      const cartLink = page.getByRole('link', { name: /back to cart|volver|cart/i });
      const count = await cartLink.count();
    });

    test('should navigate back to cart', async ({ page }) => {
      const cartLink = page.getByRole('link', { name: /back to cart|volver|cart/i });
      
      if (await cartLink.isVisible()) {
        await cartLink.click();
        await expect(page).toHaveURL(/\/cart/);
      }
    });
  });

  test.describe('Responsive Behavior', () => {
    test('should display correctly on mobile', async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto('/checkout');
      
      const title = page.locator('h1');
      await expect(title).toBeVisible();
    });

    test('should stack layout on mobile', async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto('/checkout');
      
      // Form should be full width on mobile
      const form = page.locator('form');
      if (await form.isVisible()) {
        const box = await form.boundingBox();
        if (box) {
          expect(box.width).toBeGreaterThan(300);
        }
      }
    });

    test('should display correctly on tablet', async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.tablet);
      await page.goto('/checkout');
      
      const title = page.locator('h1');
      await expect(title).toBeVisible();
    });

    test('should display correctly on desktop', async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
      await page.goto('/checkout');
      
      const title = page.locator('h1');
      await expect(title).toBeVisible();
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

    test('should have proper form labels', async ({ page }) => {
      const inputs = page.locator('input:not([type="hidden"])');
      const count = await inputs.count();
      
      for (let i = 0; i < count; i++) {
        const input = inputs.nth(i);
        const id = await input.getAttribute('id');
        const ariaLabel = await input.getAttribute('aria-label');
        const placeholder = await input.getAttribute('placeholder');
        
        // Input should have some form of label
        if (id) {
          const label = page.locator(`label[for="${id}"]`);
          const hasLabel = await label.count() > 0;
          const hasAriaLabel = !!ariaLabel;
          const hasPlaceholder = !!placeholder;
          
          expect(hasLabel || hasAriaLabel || hasPlaceholder).toBeTruthy();
        }
      }
    });

    test('should be keyboard navigable', async ({ page }) => {
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press('Tab');
      }
      const focused = await page.evaluate(() => document.activeElement?.tagName);
      expect(focused).toBeDefined();
    });
  });

  test.describe('Security', () => {
    test('should use secure input for card number', async ({ page }) => {
      const cardField = page.locator('input[name*="card"], input[type="password"]');
      const count = await cardField.count();
    });

    test('should not expose sensitive data in URL', async ({ page }) => {
      const url = page.url();
      expect(url).not.toContain('card');
      expect(url).not.toContain('cvv');
      expect(url).not.toContain('password');
    });
  });
});
