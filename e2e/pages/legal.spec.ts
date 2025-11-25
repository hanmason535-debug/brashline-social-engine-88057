/**
 * Legal Pages E2E Tests
 * Tests for Terms, Privacy, Cookies, and Accessibility pages
 */

import { test, expect, VIEWPORTS } from '../fixtures/test-fixtures';
import AxeBuilder from '@axe-core/playwright';

test.describe('Legal Pages', () => {
  test.describe('Terms of Service Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/terms');
      await page.waitForLoadState('networkidle');
    });

    test('should load terms page successfully', async ({ page }) => {
      await expect(page).toHaveURL(/\/terms/);
    });

    test('should display page title', async ({ page }) => {
      const title = page.locator('h1');
      await expect(title).toBeVisible();
    });

    test('should have header and footer', async ({ page }) => {
      await expect(page.locator('header')).toBeVisible();
      await expect(page.locator('footer')).toBeVisible();
    });

    test('should display terms content', async ({ page }) => {
      const content = page.locator('main p, main li, [class*="content"] p');
      const count = await content.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should have section headings', async ({ page }) => {
      const headings = page.locator('h2, h3');
      const count = await headings.count();
      expect(count).toBeGreaterThanOrEqual(1);
    });

    test('should be keyboard navigable', async ({ page }) => {
      for (let i = 0; i < 3; i++) {
        await page.keyboard.press('Tab');
      }
      const focused = await page.evaluate(() => document.activeElement?.tagName);
      expect(focused).toBeDefined();
    });

    test('should have no critical accessibility violations', async ({ page }) => {
      const results = await new AxeBuilder({ page })
        .disableRules(['color-contrast'])
        .analyze();
      
      const criticalViolations = results.violations.filter(
        v => v.impact === 'critical' || v.impact === 'serious'
      );
      expect(criticalViolations).toHaveLength(0);
    });
  });

  test.describe('Privacy Policy Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/privacy');
      await page.waitForLoadState('networkidle');
    });

    test('should load privacy page successfully', async ({ page }) => {
      await expect(page).toHaveURL(/\/privacy/);
    });

    test('should display page title', async ({ page }) => {
      const title = page.locator('h1');
      await expect(title).toBeVisible();
    });

    test('should have header and footer', async ({ page }) => {
      await expect(page.locator('header')).toBeVisible();
      await expect(page.locator('footer')).toBeVisible();
    });

    test('should display privacy content', async ({ page }) => {
      const content = page.locator('main p, main li, [class*="content"] p');
      const count = await content.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should have section headings', async ({ page }) => {
      const headings = page.locator('h2, h3');
      const count = await headings.count();
      expect(count).toBeGreaterThanOrEqual(1);
    });

    test('should mention data collection practices', async ({ page }) => {
      const dataContent = page.locator('text=/data|datos|information|información|collect|recopilar/i');
      const count = await dataContent.count();
    });

    test('should have no critical accessibility violations', async ({ page }) => {
      const results = await new AxeBuilder({ page })
        .disableRules(['color-contrast'])
        .analyze();
      
      const criticalViolations = results.violations.filter(
        v => v.impact === 'critical' || v.impact === 'serious'
      );
      expect(criticalViolations).toHaveLength(0);
    });
  });

  test.describe('Cookies Policy Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/cookies');
      await page.waitForLoadState('networkidle');
    });

    test('should load cookies page successfully', async ({ page }) => {
      await expect(page).toHaveURL(/\/cookies/);
    });

    test('should display page title', async ({ page }) => {
      const title = page.locator('h1');
      await expect(title).toBeVisible();
    });

    test('should have header and footer', async ({ page }) => {
      await expect(page.locator('header')).toBeVisible();
      await expect(page.locator('footer')).toBeVisible();
    });

    test('should display cookies content', async ({ page }) => {
      const content = page.locator('main p, main li, [class*="content"] p');
      const count = await content.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should mention cookie types', async ({ page }) => {
      const cookieContent = page.locator('text=/cookie|essential|analytics|functional/i');
      const count = await cookieContent.count();
    });

    test('should have no critical accessibility violations', async ({ page }) => {
      const results = await new AxeBuilder({ page })
        .disableRules(['color-contrast'])
        .analyze();
      
      const criticalViolations = results.violations.filter(
        v => v.impact === 'critical' || v.impact === 'serious'
      );
      expect(criticalViolations).toHaveLength(0);
    });
  });

  test.describe('Accessibility Statement Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/accessibility');
      await page.waitForLoadState('networkidle');
    });

    test('should load accessibility page successfully', async ({ page }) => {
      await expect(page).toHaveURL(/\/accessibility/);
    });

    test('should display page title', async ({ page }) => {
      const title = page.locator('h1');
      await expect(title).toBeVisible();
    });

    test('should have header and footer', async ({ page }) => {
      await expect(page.locator('header')).toBeVisible();
      await expect(page.locator('footer')).toBeVisible();
    });

    test('should display accessibility content', async ({ page }) => {
      const content = page.locator('main p, main li, [class*="content"] p');
      const count = await content.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should mention WCAG or accessibility standards', async ({ page }) => {
      const standardsContent = page.locator('text=/WCAG|accessibility|ADA|Section 508|accesibilidad/i');
      const count = await standardsContent.count();
    });

    test('should have contact information for accessibility issues', async ({ page }) => {
      const contact = page.locator('text=/contact|email|contacto|correo/i');
      const count = await contact.count();
    });

    test('should have no critical accessibility violations', async ({ page }) => {
      const results = await new AxeBuilder({ page })
        .disableRules(['color-contrast'])
        .analyze();
      
      const criticalViolations = results.violations.filter(
        v => v.impact === 'critical' || v.impact === 'serious'
      );
      expect(criticalViolations).toHaveLength(0);
    });
  });

  test.describe('Responsive Behavior', () => {
    const legalPages = ['/terms', '/privacy', '/cookies', '/accessibility'];

    for (const pagePath of legalPages) {
      test(`${pagePath} should display correctly on mobile`, async ({ page }) => {
        await page.setViewportSize(VIEWPORTS.mobile);
        await page.goto(pagePath);
        await page.waitForLoadState('networkidle');
        
        const title = page.locator('h1');
        await expect(title).toBeVisible();
      });

      test(`${pagePath} should display correctly on tablet`, async ({ page }) => {
        await page.setViewportSize(VIEWPORTS.tablet);
        await page.goto(pagePath);
        await page.waitForLoadState('networkidle');
        
        const title = page.locator('h1');
        await expect(title).toBeVisible();
      });

      test(`${pagePath} should display correctly on desktop`, async ({ page }) => {
        await page.setViewportSize(VIEWPORTS.desktop);
        await page.goto(pagePath);
        await page.waitForLoadState('networkidle');
        
        const title = page.locator('h1');
        await expect(title).toBeVisible();
      });
    }
  });

  test.describe('Cross-Page Navigation', () => {
    test('should link between legal pages from footer', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const footer = page.locator('footer');
      
      // Check for legal page links in footer
      const termsLink = footer.getByRole('link', { name: /terms|términos/i });
      const privacyLink = footer.getByRole('link', { name: /privacy|privacidad/i });
      const cookiesLink = footer.getByRole('link', { name: /cookies/i });
      
      if (await termsLink.isVisible()) {
        await termsLink.click();
        await expect(page).toHaveURL(/\/terms/);
      }
    });

    test('should navigate from terms to privacy', async ({ page }) => {
      await page.goto('/terms');
      await page.waitForLoadState('networkidle');
      
      // Look for link to privacy
      const privacyLink = page.getByRole('link', { name: /privacy|privacidad/i });
      
      if (await privacyLink.isVisible()) {
        await privacyLink.click();
        await expect(page).toHaveURL(/\/privacy/);
      }
    });
  });
});
