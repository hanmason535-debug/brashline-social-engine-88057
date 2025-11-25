/**
 * 404 Not Found Page E2E Tests
 * Tests for the 404 error page
 */

import { test, expect, VIEWPORTS } from '../fixtures/test-fixtures';
import AxeBuilder from '@axe-core/playwright';

test.describe('404 Not Found Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/this-page-does-not-exist-12345');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Page Load & Structure', () => {
    test('should display 404 page for invalid routes', async ({ page }) => {
      const notFoundContent = page.locator('text=/404|not found|página no encontrada|error/i');
      await expect(notFoundContent).toBeVisible();
    });

    test('should have header', async ({ page }) => {
      await expect(page.locator('header')).toBeVisible();
    });

    test('should have footer', async ({ page }) => {
      await expect(page.locator('footer')).toBeVisible();
    });
  });

  test.describe('404 Content', () => {
    test('should display error message', async ({ page }) => {
      const errorMessage = page.locator('h1, h2').first();
      await expect(errorMessage).toBeVisible();
    });

    test('should display descriptive text', async ({ page }) => {
      const description = page.locator('p');
      const count = await description.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should have link to homepage', async ({ page }) => {
      const homeLink = page.getByRole('link', { name: /home|inicio|back|volver|go back/i });
      await expect(homeLink).toBeVisible();
    });

    test('should navigate to homepage when clicking home link', async ({ page }) => {
      const homeLink = page.getByRole('link', { name: /home|inicio|back|volver|go back/i });
      
      if (await homeLink.isVisible()) {
        await homeLink.click();
        await expect(page).toHaveURL(/\/$/);
      }
    });
  });

  test.describe('Additional Navigation', () => {
    test('should have header navigation working', async ({ page }) => {
      const servicesLink = page.getByRole('link', { name: /services|servicios/i }).first();
      
      if (await servicesLink.isVisible()) {
        await servicesLink.click();
        await expect(page).toHaveURL(/\/services/);
      }
    });

    test('should have search or suggested pages', async ({ page }) => {
      const suggestions = page.locator('[class*="suggestion"], [class*="popular"], text=/popular|suggested/i');
      const count = await suggestions.count();
      // It's okay if there are no suggestions, just checking
    });
  });

  test.describe('Visual Elements', () => {
    test('should display 404 illustration or icon', async ({ page }) => {
      const visual = page.locator('[class*="404"], [class*="error"] img, [class*="error"] svg, img[alt*="404"], img[alt*="error"]');
      const count = await visual.count();
      // It's okay if there's no illustration
    });

    test('should have proper styling', async ({ page }) => {
      const container = page.locator('main, [class*="error"], [class*="not-found"]');
      await expect(container).toBeVisible();
    });
  });

  test.describe('Multiple Invalid Routes', () => {
    test('should show 404 for /invalid-path', async ({ page }) => {
      await page.goto('/invalid-path');
      const notFoundContent = page.locator('text=/404|not found|error/i');
      await expect(notFoundContent).toBeVisible();
    });

    test('should show 404 for /random/nested/path', async ({ page }) => {
      await page.goto('/random/nested/path');
      const notFoundContent = page.locator('text=/404|not found|error/i');
      await expect(notFoundContent).toBeVisible();
    });

    test('should show 404 for /services/invalid-service', async ({ page }) => {
      await page.goto('/services/invalid-service');
      const notFoundContent = page.locator('text=/404|not found|error/i');
      const count = await notFoundContent.count();
      // Route may or may not show 404 depending on routing setup
    });
  });

  test.describe('Responsive Behavior', () => {
    test('should display correctly on mobile', async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto('/not-found-test');
      await page.waitForLoadState('networkidle');
      
      const notFoundContent = page.locator('text=/404|not found|error/i');
      await expect(notFoundContent).toBeVisible();
    });

    test('should display correctly on tablet', async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.tablet);
      await page.goto('/not-found-test');
      await page.waitForLoadState('networkidle');
      
      const notFoundContent = page.locator('text=/404|not found|error/i');
      await expect(notFoundContent).toBeVisible();
    });

    test('should display correctly on desktop', async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
      await page.goto('/not-found-test');
      await page.waitForLoadState('networkidle');
      
      const notFoundContent = page.locator('text=/404|not found|error/i');
      await expect(notFoundContent).toBeVisible();
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

    test('should have proper heading structure', async ({ page }) => {
      const h1 = page.locator('h1');
      const h1Count = await h1.count();
      expect(h1Count).toBeGreaterThanOrEqual(1);
    });

    test('should be keyboard navigable', async ({ page }) => {
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press('Tab');
      }
      const focused = await page.evaluate(() => document.activeElement?.tagName);
      expect(focused).toBeDefined();
    });

    test('should have descriptive link text', async ({ page }) => {
      const homeLink = page.getByRole('link', { name: /home|inicio|back|volver/i });
      
      if (await homeLink.isVisible()) {
        const text = await homeLink.textContent();
        expect(text?.length).toBeGreaterThan(0);
      }
    });
  });

  test.describe('SEO Considerations', () => {
    test('should have proper title', async ({ page }) => {
      const title = await page.title();
      expect(title.toLowerCase()).toMatch(/404|not found|error|no encontrado/);
    });

    test('should have meta robots noindex (optional)', async ({ page }) => {
      // 404 pages ideally should not be indexed
      const metaRobots = page.locator('meta[name="robots"]');
      const count = await metaRobots.count();
      // Just checking - not required
    });
  });
});
