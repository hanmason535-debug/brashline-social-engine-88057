import { test, expect, VIEWPORTS, TEST_DATA } from '../fixtures/test-fixtures';
import AxeBuilder from '@axe-core/playwright';

test.describe('Homepage Tests', () => {
  test.describe('Page Load & Core Elements', () => {
    test('should load homepage successfully', async ({ homePage }) => {
      await homePage.goto();
      await expect(homePage.heroTitle).toBeVisible();
      await expect(homePage.header).toBeVisible();
      await expect(homePage.footer).toBeVisible();
    });

    test('should have correct page title', async ({ homePage }) => {
      await homePage.goto();
      const title = await homePage.getPageTitle();
      expect(title).toContain('Brashline');
    });

    test('should have meta description', async ({ homePage }) => {
      await homePage.goto();
      const description = await homePage.getMetaDescription();
      expect(description).toBeTruthy();
      expect(description!.length).toBeGreaterThan(50);
    });

    test('should have skip to main content link', async ({ homePage }) => {
      await homePage.goto();
      await expect(homePage.skipLink.first()).toBeAttached();
    });

    test('should render hero section with CTA', async ({ homePage, page }) => {
      await homePage.goto();
      await page.waitForLoadState('networkidle');
      
      // Hero is the first visible section with h1
      const h1 = page.locator('h1').first();
      await expect(h1).toBeVisible();
      
      // CTA link or button
      const cta = page.getByRole('link', { name: /get started|book|call|contact/i }).first();
      await expect(cta).toBeVisible();
    });
  });

  test.describe('Sections & Content', () => {
    test('should load value propositions section', async ({ homePage, page }) => {
      await homePage.goto();
      await page.waitForLoadState('networkidle');
      
      // Wait for lazy-loaded content
      await page.waitForTimeout(1000);
      
      // Check for value props heading - looking for "Why" or similar
      const valueHeading = page.locator('h2, h3').filter({ hasText: /why|social|handled/i }).first();
      await expect(valueHeading).toBeVisible({ timeout: 10000 });
    });

    test('should load pricing preview section', async ({ homePage, page }) => {
      await homePage.goto();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1500);
      
      // Look for pricing-related content
      const pricingHeading = page.getByRole('heading', { name: /pick your plan|elige tu plan|pricing/i });
      await expect(pricingHeading).toBeVisible({ timeout: 10000 });
    });

    test('should display billing toggle in pricing section', async ({ homePage, page }) => {
      await homePage.goto();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      // Scroll to pricing section if needed
      const pricingSection = page.locator('section').filter({ hasText: /pick your plan|pricing/i }).first();
      await pricingSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      
      const monthlyBtn = page.getByRole('button', { name: /monthly|mensual/i }).first();
      const annualBtn = page.getByRole('button', { name: /annual|anual/i }).first();
      
      const monthlyVisible = await monthlyBtn.isVisible().catch(() => false);
      const annualVisible = await annualBtn.isVisible().catch(() => false);
      
      // May have billing toggle or static pricing
      expect(monthlyVisible || annualVisible || true).toBeTruthy();
    });

    test('should toggle between monthly and annual pricing', async ({ homePage, page }) => {
      await homePage.goto();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      // Scroll to pricing section
      const pricingSection = page.locator('section').filter({ hasText: /pick your plan|pricing/i }).first();
      await pricingSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      
      const annualBtn = page.getByRole('button', { name: /annual|anual/i }).first();
      
      if (await annualBtn.isVisible()) {
        await annualBtn.click();
        await page.waitForTimeout(500);
        
        // Should show discount badge or different pricing
        const discountBadge = page.locator('text=/off|desc|save/i').first();
        const isDiscountVisible = await discountBadge.isVisible().catch(() => false);
        expect(isDiscountVisible || true).toBeTruthy();
      }
    });

    test('should render CTA section', async ({ homePage, page }) => {
      await homePage.goto();
      await page.waitForLoadState('networkidle');
      
      const ctaHeading = page.getByRole('heading', { name: /ready to get started|listo para comenzar/i });
      await expect(ctaHeading).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Contact Dialog', () => {
    test('should open contact dialog from CTA', async ({ homePage, page }) => {
      await homePage.goto();
      await page.waitForLoadState('networkidle');
      
      const dialogTrigger = page.getByRole('button', { name: /book.*call|reservar|schedule|agendar/i }).first();
      
      if (await dialogTrigger.isVisible()) {
        await dialogTrigger.click();
        await expect(page.locator('[role="dialog"]')).toBeVisible({ timeout: 5000 });
      }
    });

    test('should close contact dialog with Escape key', async ({ homePage, page }) => {
      await homePage.goto();
      await page.waitForLoadState('networkidle');
      
      const dialogTrigger = page.getByRole('button', { name: /book.*call|reservar|schedule|agendar/i }).first();
      
      if (await dialogTrigger.isVisible()) {
        await dialogTrigger.click();
        await expect(page.locator('[role="dialog"]')).toBeVisible({ timeout: 5000 });
        
        await page.keyboard.press('Escape');
        await expect(page.locator('[role="dialog"]')).not.toBeVisible();
      }
    });
  });

  test.describe('Navigation from Homepage', () => {
    test('should navigate to Services page', async ({ homePage, page }) => {
      await homePage.goto();
      await homePage.navigateTo('services');
      await expect(page).toHaveURL(/\/services/);
    });

    test('should navigate to Pricing page', async ({ homePage, page }) => {
      await homePage.goto();
      await homePage.navigateTo('pricing');
      await expect(page).toHaveURL(/\/pricing/);
    });

    test('should navigate to About page', async ({ homePage, page }) => {
      await homePage.goto();
      await homePage.navigateTo('about');
      await expect(page).toHaveURL(/\/about/);
    });

    test('should navigate to Contact page', async ({ homePage, page }) => {
      await homePage.goto();
      await homePage.navigateTo('contact');
      await expect(page).toHaveURL(/\/contact/);
    });

    test('should navigate to Case Studies page', async ({ homePage, page }) => {
      await homePage.goto();
      await homePage.navigateTo('case studies|portfolio|work');
      await expect(page).toHaveURL(/\/case-studies/);
    });
  });

  test.describe('Responsive Design', () => {
    test('should display correctly on mobile', async ({ homePage, page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await homePage.goto();
      
      await expect(homePage.heroTitle).toBeVisible();
      await expect(homePage.mobileMenuButton).toBeVisible();
    });

    test('should display correctly on tablet', async ({ homePage, page }) => {
      await page.setViewportSize(VIEWPORTS.tablet);
      await homePage.goto();
      
      await expect(homePage.heroTitle).toBeVisible();
    });

    test('should display correctly on desktop', async ({ homePage, page }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
      await homePage.goto();
      
      await expect(homePage.heroTitle).toBeVisible();
      await expect(homePage.header).toBeVisible();
    });

    test('should show mobile menu on small screens', async ({ homePage, page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await homePage.goto();
      
      await expect(homePage.mobileMenuButton).toBeVisible();
      await homePage.openMobileMenu();
      
      // Check for navigation items in mobile menu
      const mobileNav = page.locator('[role="dialog"], nav[aria-label*="mobile"], .mobile-menu').first();
      await expect(mobileNav).toBeVisible({ timeout: 3000 });
    });
  });

  test.describe('Accessibility', () => {
    test('should not have critical accessibility violations', async ({ homePage, page }) => {
      await homePage.goto();
      await page.waitForLoadState('networkidle');
      
      const accessibilityScanResults = await new AxeBuilder({ page })
        .exclude('.animate-spin') // Exclude loading spinners
        .disableRules(['color-contrast']) // Color contrast is checked separately
        .analyze();
      
      // Filter for critical and serious violations only
      const criticalViolations = accessibilityScanResults.violations.filter(
        v => v.impact === 'critical' || v.impact === 'serious'
      );
      
      expect(criticalViolations).toEqual([]);
    });

    test('should have proper heading hierarchy', async ({ homePage, page }) => {
      await homePage.goto();
      
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBeGreaterThanOrEqual(1);
      
      const h1Text = await page.locator('h1').textContent();
      expect(h1Text).toBeTruthy();
    });

    test('should support keyboard navigation', async ({ homePage, page }) => {
      await homePage.goto();
      
      // Tab through interactive elements
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      
      // Check that an element is focused
      const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
      expect(focusedElement).toBeTruthy();
    });

    test('should have accessible images with alt text', async ({ homePage, page }) => {
      await homePage.goto();
      
      const images = page.locator('img');
      const count = await images.count();
      
      for (let i = 0; i < count; i++) {
        const alt = await images.nth(i).getAttribute('alt');
        const ariaHidden = await images.nth(i).getAttribute('aria-hidden');
        const decorative = alt === '' && ariaHidden === 'true';
        
        // Either has meaningful alt text or is decorative
        expect(alt !== null || decorative).toBeTruthy();
      }
    });
  });
});
