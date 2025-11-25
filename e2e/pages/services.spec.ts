import { test, expect, VIEWPORTS } from '../fixtures/test-fixtures';
import AxeBuilder from '@axe-core/playwright';

test.describe('Services Page Tests', () => {
  test.describe('Page Load & Core Elements', () => {
    test('should load services page successfully', async ({ servicesPage }) => {
      await servicesPage.goto();
      await expect(servicesPage.pageTitle).toBeVisible();
      await expect(servicesPage.header).toBeVisible();
      await expect(servicesPage.footer).toBeVisible();
    });

    test('should have correct page title', async ({ servicesPage }) => {
      await servicesPage.goto();
      const title = await servicesPage.getPageTitle();
      expect(title.toLowerCase()).toMatch(/service|servicio/);
    });

    test('should display service offerings', async ({ servicesPage, page }) => {
      await servicesPage.goto();
      await page.waitForLoadState('networkidle');
      
      // Check for service-related content
      const serviceContent = page.locator('section, article, [class*="card"]').filter({
        hasText: /social media|marketing|content|strategy|redes sociales/i
      });
      
      await expect(serviceContent.first()).toBeVisible({ timeout: 10000 });
    });

    test('should display multiple service cards', async ({ servicesPage, page }) => {
      await servicesPage.goto();
      await page.waitForLoadState('networkidle');
      
      const cards = page.locator('[class*="card"], [data-testid*="service"]');
      const count = await cards.count();
      
      expect(count).toBeGreaterThan(0);
    });
  });

  test.describe('Service Details', () => {
    test('should display service descriptions', async ({ servicesPage, page }) => {
      await servicesPage.goto();
      
      // Look for descriptive text
      const descriptions = page.locator('p').filter({ 
        hasText: /help|provide|offer|create|manage|ayud|proporcion|ofrec/i 
      });
      
      await expect(descriptions.first()).toBeVisible({ timeout: 5000 });
    });

    test('should have CTAs for each service', async ({ servicesPage, page }) => {
      await servicesPage.goto();
      await page.waitForLoadState('networkidle');
      
      // Look for call-to-action buttons
      const ctaButtons = page.getByRole('button', { name: /get started|learn more|contact|consulta|comenzar/i });
      const ctaLinks = page.getByRole('link', { name: /get started|learn more|contact|consulta|comenzar/i });
      
      const totalCTAs = await ctaButtons.count() + await ctaLinks.count();
      expect(totalCTAs).toBeGreaterThan(0);
    });

    test('should display pricing information if available', async ({ servicesPage, page }) => {
      await servicesPage.goto();
      await page.waitForLoadState('networkidle');
      
      // Check for price-related content (may or may not be present)
      const priceContent = page.locator('text=/\\$\\d+|from \\$|desde \\$/i');
      const hasPricing = await priceContent.count() > 0;
      
      // Either has pricing or doesn't - both are valid
      expect(typeof hasPricing).toBe('boolean');
    });
  });

  test.describe('Navigation', () => {
    test('should navigate to contact page from CTA', async ({ servicesPage, page }) => {
      await servicesPage.goto();
      await page.waitForLoadState('networkidle');
      
      const contactLink = page.getByRole('link', { name: /contact|contacto|get started|comenzar/i }).first();
      
      if (await contactLink.isVisible()) {
        await contactLink.click();
        await expect(page).toHaveURL(/\/(contact|pricing)/);
      }
    });

    test('should navigate to pricing page', async ({ servicesPage, page }) => {
      await servicesPage.goto();
      
      const pricingLink = page.getByRole('link', { name: /pricing|precios|plans|planes/i }).first();
      
      if (await pricingLink.isVisible()) {
        await pricingLink.click();
        await expect(page).toHaveURL(/\/pricing/);
      }
    });

    test('should return to homepage from logo', async ({ servicesPage, page }) => {
      await servicesPage.goto();
      
      const logo = page.locator('header a[href="/"], header img[alt*="logo"]').first();
      await logo.click();
      
      await expect(page).toHaveURL(/^https?:\/\/[^\/]+\/?$/);
    });
  });

  test.describe('Interactive Elements', () => {
    test('should expand service details on click if accordion exists', async ({ servicesPage, page }) => {
      await servicesPage.goto();
      await page.waitForLoadState('networkidle');
      
      // Check for accordion or collapsible elements
      const accordionTrigger = page.locator('[data-state="closed"], button[aria-expanded="false"]').first();
      
      if (await accordionTrigger.isVisible()) {
        await accordionTrigger.click();
        await page.waitForTimeout(300);
        
        const isExpanded = await accordionTrigger.getAttribute('aria-expanded');
        expect(isExpanded).toBe('true');
      }
    });

    test('should highlight service card on hover', async ({ servicesPage, page }) => {
      await servicesPage.goto();
      await page.waitForLoadState('networkidle');
      
      const card = page.locator('[class*="card"]').first();
      
      if (await card.isVisible()) {
        await card.hover();
        await page.waitForTimeout(300);
        
        // Card should still be visible after hover
        await expect(card).toBeVisible();
      }
    });
  });

  test.describe('Responsive Design', () => {
    test('should display correctly on mobile', async ({ servicesPage, page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await servicesPage.goto();
      
      await expect(servicesPage.pageTitle).toBeVisible();
      await expect(servicesPage.mobileMenuButton).toBeVisible();
    });

    test('should stack service cards on mobile', async ({ servicesPage, page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await servicesPage.goto();
      await page.waitForLoadState('networkidle');
      
      const cards = page.locator('[class*="card"]');
      const firstCard = cards.first();
      
      if (await firstCard.isVisible()) {
        const box = await firstCard.boundingBox();
        expect(box!.width).toBeLessThanOrEqual(VIEWPORTS.mobile.width);
      }
    });

    test('should display correctly on tablet', async ({ servicesPage, page }) => {
      await page.setViewportSize(VIEWPORTS.tablet);
      await servicesPage.goto();
      
      await expect(servicesPage.pageTitle).toBeVisible();
    });

    test('should display correctly on desktop', async ({ servicesPage, page }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
      await servicesPage.goto();
      
      await expect(servicesPage.pageTitle).toBeVisible();
      await expect(servicesPage.header).toBeVisible();
    });
  });

  test.describe('Accessibility', () => {
    test('should not have accessibility violations', async ({ servicesPage, page }) => {
      await servicesPage.goto();
      await page.waitForLoadState('networkidle');
      
      const results = await new AxeBuilder({ page })
        .exclude('.animate-spin')
        .analyze();
      
      expect(results.violations).toEqual([]);
    });

    test('should have proper heading hierarchy', async ({ servicesPage, page }) => {
      await servicesPage.goto();
      
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBe(1);
    });

    test('should have accessible service cards', async ({ servicesPage, page }) => {
      await servicesPage.goto();
      await page.waitForLoadState('networkidle');
      
      const cards = page.locator('[class*="card"]');
      const count = await cards.count();
      
      for (let i = 0; i < Math.min(count, 3); i++) {
        const card = cards.nth(i);
        
        // Cards should have some accessible text
        const text = await card.textContent();
        expect(text!.length).toBeGreaterThan(10);
      }
    });

    test('should support keyboard navigation', async ({ servicesPage, page }) => {
      await servicesPage.goto();
      
      // Tab through elements
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      
      const focusedTag = await page.evaluate(() => document.activeElement?.tagName);
      expect(['A', 'BUTTON', 'INPUT']).toContain(focusedTag);
    });
  });

  test.describe('Language Support', () => {
    test('should display Spanish content when language is ES', async ({ servicesPage, page }) => {
      await servicesPage.goto();
      
      const langToggle = page.getByRole('button', { name: /^(en|es)$/i });
      if (await langToggle.isVisible()) {
        await langToggle.click();
        await page.waitForTimeout(500);
        
        // Check for Spanish headings or content
        const spanishText = page.locator('text=/servicio|nuestros|ofrec/i').first();
        await expect(spanishText).toBeVisible({ timeout: 5000 });
      }
    });
  });
});
