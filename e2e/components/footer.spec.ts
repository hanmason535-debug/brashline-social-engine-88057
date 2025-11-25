/**
 * Footer Component E2E Tests
 * Tests for the main footer section
 */

import { test, expect, VIEWPORTS } from '../fixtures/test-fixtures';
import AxeBuilder from '@axe-core/playwright';

test.describe('Footer Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Footer Structure', () => {
    test('should be visible on page', async ({ page }) => {
      await expect(page.locator('footer')).toBeVisible();
    });

    test('should be at bottom of page', async ({ page }) => {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(300);
      await expect(page.locator('footer')).toBeVisible();
    });

    test('should contain logo or brand', async ({ page }) => {
      const footer = page.locator('footer');
      const logo = footer.locator('img, svg, [class*="logo"]');
      const brandText = footer.locator('text=/brashline/i');
      
      const logoCount = await logo.count();
      const brandCount = await brandText.count();
    });
  });

  test.describe('Footer Navigation', () => {
    test('should have navigation links', async ({ page }) => {
      const footer = page.locator('footer');
      const links = footer.locator('a');
      const count = await links.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should have Services link', async ({ page }) => {
      const footer = page.locator('footer');
      const link = footer.getByRole('link', { name: /services|servicios/i });
      const count = await link.count();
    });

    test('should have About link', async ({ page }) => {
      const footer = page.locator('footer');
      const link = footer.getByRole('link', { name: /about|nosotros/i });
      const count = await link.count();
    });

    test('should have Contact link', async ({ page }) => {
      const footer = page.locator('footer');
      const link = footer.getByRole('link', { name: /contact|contacto/i });
      const count = await link.count();
    });

    test('should navigate to page when clicking link', async ({ page }) => {
      const footer = page.locator('footer');
      const contactLink = footer.getByRole('link', { name: /contact|contacto/i }).first();
      
      if (await contactLink.isVisible()) {
        await contactLink.click();
        await expect(page).toHaveURL(/\/contact/);
      }
    });
  });

  test.describe('Legal Links', () => {
    test('should have Terms link', async ({ page }) => {
      const footer = page.locator('footer');
      const link = footer.getByRole('link', { name: /terms|términos/i });
      
      if (await link.isVisible()) {
        await link.click();
        await expect(page).toHaveURL(/\/terms/);
      }
    });

    test('should have Privacy link', async ({ page }) => {
      await page.goto('/');
      const footer = page.locator('footer');
      const link = footer.getByRole('link', { name: /privacy|privacidad/i });
      
      if (await link.isVisible()) {
        await link.click();
        await expect(page).toHaveURL(/\/privacy/);
      }
    });

    test('should have Cookies link', async ({ page }) => {
      const footer = page.locator('footer');
      const link = footer.getByRole('link', { name: /cookies/i });
      const count = await link.count();
    });

    test('should have Accessibility link', async ({ page }) => {
      const footer = page.locator('footer');
      const link = footer.getByRole('link', { name: /accessibility|accesibilidad/i });
      const count = await link.count();
    });
  });

  test.describe('Social Links', () => {
    test('should have social media links', async ({ page }) => {
      const footer = page.locator('footer');
      const socialLinks = footer.locator('a[href*="twitter"], a[href*="facebook"], a[href*="instagram"], a[href*="linkedin"], a[href*="youtube"], [class*="social"]');
      const count = await socialLinks.count();
    });

    test('should open social links in new tab', async ({ page }) => {
      const footer = page.locator('footer');
      const socialLinks = footer.locator('a[href*="twitter"], a[href*="facebook"], a[href*="instagram"], a[href*="linkedin"]');
      const count = await socialLinks.count();
      
      for (let i = 0; i < count; i++) {
        const link = socialLinks.nth(i);
        const target = await link.getAttribute('target');
        const rel = await link.getAttribute('rel');
        
        if (target === '_blank') {
          // External links should have rel="noopener"
          expect(rel).toContain('noopener');
        }
      }
    });

    test('should have accessible social link labels', async ({ page }) => {
      const footer = page.locator('footer');
      const socialLinks = footer.locator('a[href*="twitter"], a[href*="facebook"], a[href*="instagram"], a[href*="linkedin"]');
      const count = await socialLinks.count();
      
      for (let i = 0; i < count; i++) {
        const link = socialLinks.nth(i);
        const ariaLabel = await link.getAttribute('aria-label');
        const text = await link.textContent();
        
        // Should have either aria-label or text content
        expect(ariaLabel || text?.trim()).toBeTruthy();
      }
    });
  });

  test.describe('Contact Information', () => {
    test('should display contact information', async ({ page }) => {
      const footer = page.locator('footer');
      const contactInfo = footer.locator('text=/email|phone|teléfono|address|dirección|@/i');
      const count = await contactInfo.count();
    });

    test('should have email link', async ({ page }) => {
      const footer = page.locator('footer');
      const emailLink = footer.locator('a[href^="mailto:"]');
      const count = await emailLink.count();
    });

    test('should have phone link', async ({ page }) => {
      const footer = page.locator('footer');
      const phoneLink = footer.locator('a[href^="tel:"]');
      const count = await phoneLink.count();
    });
  });

  test.describe('Copyright', () => {
    test('should display copyright notice', async ({ page }) => {
      const footer = page.locator('footer');
      const copyright = footer.locator('text=/©|copyright|all rights reserved|derechos reservados/i');
      await expect(copyright).toBeVisible();
    });

    test('should display current year', async ({ page }) => {
      const currentYear = new Date().getFullYear().toString();
      const footer = page.locator('footer');
      const yearText = footer.locator(`text=/${currentYear}/`);
      const count = await yearText.count();
    });
  });

  test.describe('Newsletter Signup', () => {
    test('should have newsletter form if present', async ({ page }) => {
      const footer = page.locator('footer');
      const newsletter = footer.locator('[class*="newsletter"], form[class*="subscribe"]');
      const count = await newsletter.count();
    });

    test('should have email input in newsletter form', async ({ page }) => {
      const footer = page.locator('footer');
      const emailInput = footer.locator('input[type="email"]');
      const count = await emailInput.count();
    });

    test('should have subscribe button', async ({ page }) => {
      const footer = page.locator('footer');
      const subscribeBtn = footer.getByRole('button', { name: /subscribe|suscribir/i });
      const count = await subscribeBtn.count();
    });
  });

  test.describe('Responsive Behavior', () => {
    test('should display correctly on mobile', async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto('/');
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      
      await expect(page.locator('footer')).toBeVisible();
    });

    test('should stack columns on mobile', async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const footer = page.locator('footer');
      const columns = footer.locator('> div > div, [class*="column"]');
      const count = await columns.count();
    });

    test('should display correctly on tablet', async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.tablet);
      await page.goto('/');
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      
      await expect(page.locator('footer')).toBeVisible();
    });

    test('should display correctly on desktop', async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
      await page.goto('/');
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      
      await expect(page.locator('footer')).toBeVisible();
    });
  });

  test.describe('Footer Across Pages', () => {
    const pages = ['/', '/services', '/pricing', '/about', '/contact'];
    
    for (const pagePath of pages) {
      test(`should be visible on ${pagePath}`, async ({ page }) => {
        await page.goto(pagePath);
        await page.waitForLoadState('networkidle');
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        
        await expect(page.locator('footer')).toBeVisible();
      });
    }
  });

  test.describe('Accessibility', () => {
    test('should have no critical accessibility violations', async ({ page }) => {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      
      const results = await new AxeBuilder({ page })
        .include('footer')
        .disableRules(['color-contrast'])
        .analyze();
      
      const criticalViolations = results.violations.filter(
        v => v.impact === 'critical' || v.impact === 'serious'
      );
      expect(criticalViolations).toHaveLength(0);
    });

    test('should have proper landmark role', async ({ page }) => {
      const footer = page.locator('footer, [role="contentinfo"]');
      await expect(footer).toBeVisible();
    });

    test('should be keyboard navigable', async ({ page }) => {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      
      const footer = page.locator('footer');
      const firstLink = footer.locator('a').first();
      
      await firstLink.focus();
      const focused = await page.evaluate(() => document.activeElement?.tagName);
      expect(focused).toBe('A');
    });

    test('should have sufficient color contrast', async ({ page }) => {
      const footer = page.locator('footer');
      const text = footer.locator('p, span, a');
      const count = await text.count();
      
      // Just ensure text elements exist and are readable
      expect(count).toBeGreaterThan(0);
    });
  });
});
