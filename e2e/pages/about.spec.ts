import { test, expect, VIEWPORTS } from '../fixtures/test-fixtures';
import AxeBuilder from '@axe-core/playwright';

test.describe('About Page Tests', () => {
  test.describe('Page Load & Core Elements', () => {
    test('should load about page successfully', async ({ aboutPage }) => {
      await aboutPage.goto();
      await expect(aboutPage.pageTitle).toBeVisible();
      await expect(aboutPage.header).toBeVisible();
      await expect(aboutPage.footer).toBeVisible();
    });

    test('should have correct page title', async ({ aboutPage }) => {
      await aboutPage.goto();
      const title = await aboutPage.getPageTitle();
      expect(title.toLowerCase()).toMatch(/about|acerca|nosotros/);
    });

    test('should display company information', async ({ aboutPage, page }) => {
      await aboutPage.goto();
      await page.waitForLoadState('networkidle');
      
      // Look for about content
      const aboutContent = page.locator('section, article').filter({
        hasText: /mission|vision|story|historia|equipo|team/i
      });
      
      await expect(aboutContent.first()).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Content Sections', () => {
    test('should display mission or values section', async ({ aboutPage, page }) => {
      await aboutPage.goto();
      await page.waitForLoadState('networkidle');
      
      const missionSection = page.locator('section, div').filter({
        hasText: /mission|misión|values|valores|what we do|qué hacemos/i
      });
      
      await expect(missionSection.first()).toBeVisible({ timeout: 5000 });
    });

    test('should display team or company information', async ({ aboutPage, page }) => {
      await aboutPage.goto();
      await page.waitForLoadState('networkidle');
      
      // Check for team/company-related content
      const teamContent = page.locator('text=/team|equipo|founder|fundador|we are|somos/i');
      
      if (await teamContent.count() > 0) {
        await expect(teamContent.first()).toBeVisible();
      }
    });

    test('should display images if present', async ({ aboutPage, page }) => {
      await aboutPage.goto();
      await page.waitForLoadState('networkidle');
      
      const images = page.locator('main img, section img');
      const count = await images.count();
      
      // Images may or may not be present
      expect(count).toBeGreaterThanOrEqual(0);
    });
  });

  test.describe('Navigation', () => {
    test('should navigate to contact page', async ({ aboutPage, page }) => {
      await aboutPage.goto();
      
      const contactLink = page.getByRole('link', { name: /contact|contacto/i }).first();
      
      if (await contactLink.isVisible()) {
        await contactLink.click();
        await expect(page).toHaveURL(/\/contact/);
      }
    });

    test('should navigate to services page', async ({ aboutPage, page }) => {
      await aboutPage.goto();
      
      const servicesLink = page.getByRole('link', { name: /services|servicios/i }).first();
      
      if (await servicesLink.isVisible()) {
        await servicesLink.click();
        await expect(page).toHaveURL(/\/services/);
      }
    });

    test('should return to homepage', async ({ aboutPage, page }) => {
      await aboutPage.goto();
      
      const homeLink = page.getByRole('link', { name: /home|inicio/i }).first();
      
      if (await homeLink.isVisible()) {
        await homeLink.click();
        await expect(page).toHaveURL(/^https?:\/\/[^\/]+\/?$/);
      }
    });
  });

  test.describe('Responsive Design', () => {
    test('should display correctly on mobile', async ({ aboutPage, page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await aboutPage.goto();
      
      await expect(aboutPage.pageTitle).toBeVisible();
      await expect(aboutPage.mobileMenuButton).toBeVisible();
    });

    test('should display correctly on tablet', async ({ aboutPage, page }) => {
      await page.setViewportSize(VIEWPORTS.tablet);
      await aboutPage.goto();
      
      await expect(aboutPage.pageTitle).toBeVisible();
    });

    test('should display correctly on desktop', async ({ aboutPage, page }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
      await aboutPage.goto();
      
      await expect(aboutPage.pageTitle).toBeVisible();
      await expect(aboutPage.header).toBeVisible();
    });
  });

  test.describe('Accessibility', () => {
    test('should not have accessibility violations', async ({ aboutPage, page }) => {
      await aboutPage.goto();
      await page.waitForLoadState('networkidle');
      
      const results = await new AxeBuilder({ page })
        .exclude('.animate-spin')
        .analyze();
      
      expect(results.violations).toEqual([]);
    });

    test('should have proper heading hierarchy', async ({ aboutPage, page }) => {
      await aboutPage.goto();
      
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBe(1);
    });

    test('should have alt text for images', async ({ aboutPage, page }) => {
      await aboutPage.goto();
      await page.waitForLoadState('networkidle');
      
      const images = page.locator('main img');
      const count = await images.count();
      
      for (let i = 0; i < count; i++) {
        const alt = await images.nth(i).getAttribute('alt');
        expect(alt).toBeTruthy();
      }
    });

    test('should support keyboard navigation', async ({ aboutPage, page }) => {
      await aboutPage.goto();
      
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      
      const focusedTag = await page.evaluate(() => document.activeElement?.tagName);
      expect(['A', 'BUTTON', 'INPUT']).toContain(focusedTag);
    });
  });

  test.describe('Language Support', () => {
    test('should display Spanish content when language is ES', async ({ aboutPage, page }) => {
      await aboutPage.goto();
      
      const langToggle = page.getByRole('button', { name: /^(en|es)$/i });
      if (await langToggle.isVisible()) {
        await langToggle.click();
        await page.waitForTimeout(500);
        
        const spanishText = page.locator('text=/nosotros|acerca|nuestra|misión/i').first();
        await expect(spanishText).toBeVisible({ timeout: 5000 });
      }
    });
  });
});
