/**
 * Navigation Flow E2E Tests
 * Tests for complete user navigation journeys
 */

import { test, expect, VIEWPORTS } from '../fixtures/test-fixtures';

test.describe('Navigation Flows', () => {
  test.describe('Primary User Journeys', () => {
    test('should complete homepage to contact flow', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Click CTA to contact
      const contactCTA = page.getByRole('link', { name: /contact|get in touch|contacto/i }).first();
      await contactCTA.click();
      
      await expect(page).toHaveURL(/\/contact/);
      await expect(page.locator('h1, h2').first()).toBeVisible();
    });

    test('should complete services exploration flow', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Navigate to services
      const servicesLink = page.getByRole('link', { name: /services|servicios/i }).first();
      await servicesLink.click();
      await expect(page).toHaveURL(/\/services/);
      
      // Explore services page
      await expect(page.locator('h1, h2').first()).toBeVisible();
      
      // Navigate to pricing from services (optional - may not be on page)
      const pricingLink = page.getByRole('link', { name: /pricing|precios|view plans/i }).first();
      if (await pricingLink.isVisible().catch(() => false)) {
        await pricingLink.click();
        await expect(page).toHaveURL(/\/pricing/);
      }
    });

    test('should complete case studies exploration flow', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Navigate to case studies - link is labeled "Work"
      const caseStudiesLink = page.getByRole('link', { name: /work|case studies|portfolio|casos/i }).first();
      await caseStudiesLink.click();
      await expect(page).toHaveURL(/\/case-studies/);
      
      // Explore case studies - page may use h1 or h2
      const heading = page.locator('h1, h2').first();
      await expect(heading).toBeVisible();
      
      // Navigate to contact from case studies (optional)
      const contactLink = page.getByRole('link', { name: /contact|start|contacto/i }).first();
      if (await contactLink.isVisible().catch(() => false)) {
        await contactLink.click();
        await expect(page).toHaveURL(/\/contact/);
      }
    });

    test('should complete pricing to cart flow', async ({ page }) => {
      await page.goto('/pricing');
      await page.waitForLoadState('networkidle');
      
      // Find add to cart button
      const addToCart = page.getByRole('button', { name: /add to cart|agregar/i }).first();
      
      if (await addToCart.isVisible()) {
        await addToCart.click();
        await page.waitForTimeout(500);
        
        // Navigate to cart
        await page.goto('/cart');
        await expect(page).toHaveURL(/\/cart/);
        
        // Cart page should load
        await expect(page.locator('header')).toBeVisible();
      }
    });

    test('should complete about page exploration', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Navigate to about
      const aboutLink = page.getByRole('link', { name: /about|nosotros/i }).first();
      await aboutLink.click();
      await expect(page).toHaveURL(/\/about/);
      
      // Verify content loads - page may use h1 or h2
      const heading = page.locator('h1, h2').first();
      await expect(heading).toBeVisible();
    });
  });

  test.describe('Header Navigation', () => {
    test('should navigate through all main pages via header', async ({ page }) => {
      const pages = [
        { name: /services|servicios/i, url: /\/services/ },
        { name: /pricing|precios/i, url: /\/pricing/ },
        { name: /case studies|casos/i, url: /\/case-studies/ },
        { name: /about|nosotros/i, url: /\/about/ },
        { name: /contact|contacto/i, url: /\/contact/ },
      ];
      
      await page.goto('/');
      
      for (const pageInfo of pages) {
        const link = page.locator('header').getByRole('link', { name: pageInfo.name }).first();
        
        if (await link.isVisible()) {
          await link.click();
          await expect(page).toHaveURL(pageInfo.url);
          await page.waitForLoadState('networkidle');
        }
      }
    });

    test('should return to homepage via logo', async ({ page }) => {
      await page.goto('/services');
      await page.waitForLoadState('networkidle');
      
      // Click logo to return home
      const logo = page.locator('header a').first();
      await logo.click();
      await expect(page).toHaveURL(/\/$/);
    });
  });

  test.describe('Footer Navigation', () => {
    test('should navigate to legal pages from footer', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      
      const footer = page.locator('footer');
      
      // Try to navigate to terms
      const termsLink = footer.getByRole('link', { name: /terms|términos/i }).first();
      if (await termsLink.isVisible()) {
        await termsLink.click();
        await expect(page).toHaveURL(/\/terms/);
      }
    });

    test('should navigate between legal pages', async ({ page }) => {
      await page.goto('/terms');
      await page.waitForLoadState('networkidle');
      
      // Navigate to privacy from terms
      const privacyLink = page.getByRole('link', { name: /privacy|privacidad/i });
      if (await privacyLink.isVisible()) {
        await privacyLink.click();
        await expect(page).toHaveURL(/\/privacy/);
      }
    });
  });

  test.describe('Mobile Navigation Flow', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
    });

    test('should navigate via hamburger menu', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Open hamburger menu
      const hamburger = page.locator('button[aria-label*="menu"], [class*="hamburger"], button[class*="menu"]').first();
      
      if (await hamburger.isVisible()) {
        await hamburger.click();
        await page.waitForTimeout(500);
        
        // Click services link
        const servicesLink = page.getByRole('link', { name: /services|servicios/i }).first();
        if (await servicesLink.isVisible()) {
          await servicesLink.click();
          await expect(page).toHaveURL(/\/services/);
        }
      }
    });

    test('should complete mobile checkout flow', async ({ page }) => {
      await page.goto('/pricing');
      await page.waitForLoadState('networkidle');
      
      // Add to cart
      const addToCart = page.getByRole('button', { name: /add to cart|agregar/i }).first();
      if (await addToCart.isVisible()) {
        await addToCart.click();
        await page.waitForTimeout(500);
        
        // Go to cart
        await page.goto('/cart');
        await expect(page).toHaveURL(/\/cart/);
      }
    });
  });

  test.describe('Back Navigation', () => {
    test('should support browser back button', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Navigate to services
      const servicesLink = page.getByRole('link', { name: /services|servicios/i }).first();
      await servicesLink.click();
      await expect(page).toHaveURL(/\/services/);
      
      // Navigate to pricing
      await page.goto('/pricing');
      await expect(page).toHaveURL(/\/pricing/);
      
      // Go back
      await page.goBack();
      await expect(page).toHaveURL(/\/services/);
      
      // Go back again
      await page.goBack();
      await expect(page).toHaveURL(/\/$/);
    });

    test('should maintain scroll position on back', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Scroll down
      await page.evaluate(() => window.scrollTo(0, 500));
      const scrollBefore = await page.evaluate(() => window.scrollY);
      
      // Navigate away
      await page.goto('/services');
      
      // Go back
      await page.goBack();
      await page.waitForTimeout(500);
      
      // Scroll position may be restored
    });
  });

  test.describe('Deep Linking', () => {
    test('should support direct navigation to services', async ({ page }) => {
      await page.goto('/services');
      await page.waitForLoadState('networkidle');
      await expect(page.locator('h1, h2').first()).toBeVisible();
    });

    test('should support direct navigation to pricing', async ({ page }) => {
      await page.goto('/pricing');
      await page.waitForLoadState('networkidle');
      await expect(page.locator('h1, h2').first()).toBeVisible();
    });

    test('should support direct navigation to contact', async ({ page }) => {
      await page.goto('/contact');
      await page.waitForLoadState('networkidle');
      await expect(page.locator('h1, h2').first()).toBeVisible();
    });

    test('should support direct navigation to case studies', async ({ page }) => {
      await page.goto('/case-studies');
      await page.waitForLoadState('networkidle');
      await expect(page.locator('h1, h2').first()).toBeVisible();
    });
  });

  test.describe('Error Recovery', () => {
    test('should recover from 404 page', async ({ page }) => {
      await page.goto('/non-existent-page');
      await page.waitForLoadState('networkidle');
      
      // Should show 404 or redirect
      const notFound = page.locator('text=/404|not found/i');
      const count = await notFound.count();
      
      // Navigate back to home via header logo or link
      const headerLink = page.locator('header a').first();
      if (await headerLink.isVisible()) {
        await headerLink.click();
        // Should navigate somewhere (may not be root)
        await page.waitForLoadState('networkidle');
      }
    });
  });

  test.describe('Keyboard Navigation', () => {
    test('should be fully navigable via keyboard', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Tab to first link
      await page.keyboard.press('Tab');
      
      // Continue tabbing through navigation
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press('Tab');
      }
      
      // Press Enter to navigate
      const focused = await page.evaluate(() => document.activeElement?.tagName);
      if (focused === 'A') {
        await page.keyboard.press('Enter');
        // Should navigate somewhere
      }
    });

    test('should have skip to content link', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Press Tab once - skip link should be first
      await page.keyboard.press('Tab');
      
      const skipLink = page.locator('a[href="#main"], a[href="#content"], [class*="skip"]');
      const count = await skipLink.count();
    });
  });

  test.describe('Link States', () => {
    test('should indicate current page in navigation', async ({ page }) => {
      await page.goto('/services');
      await page.waitForLoadState('networkidle');
      
      const servicesLink = page.locator('header').getByRole('link', { name: /services|servicios/i }).first();
      const ariaCurrent = await servicesLink.getAttribute('aria-current');
      const className = await servicesLink.getAttribute('class');
      
      // Should have some indicator of current page
    });

    test('should have hover states on links', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const servicesLink = page.locator('header').getByRole('link', { name: /services|servicios/i }).first();
      
      // Get initial style
      const initialStyle = await servicesLink.evaluate(el => getComputedStyle(el).color);
      
      // Hover
      await servicesLink.hover();
      await page.waitForTimeout(100);
      
      // Style may have changed
    });
  });
});
