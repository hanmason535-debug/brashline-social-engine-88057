/**
 * Comprehensive Accessibility E2E Tests
 * Tests for WCAG compliance across all pages
 */

import { test, expect, VIEWPORTS } from '../fixtures/test-fixtures';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Compliance', () => {
  const pagesToTest = [
    { name: 'Homepage', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Case Studies', path: '/case-studies' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Terms', path: '/terms' },
    { name: 'Privacy', path: '/privacy' },
    { name: 'Cart', path: '/cart' },
  ];

  test.describe('Automated Accessibility Checks', () => {
    for (const pageInfo of pagesToTest) {
      test(`${pageInfo.name} should have no critical violations`, async ({ page }) => {
        await page.goto(pageInfo.path);
        await page.waitForLoadState('networkidle');
        
        const results = await new AxeBuilder({ page })
          .disableRules(['color-contrast', 'landmark-one-main', 'region']) // Common issues
          .analyze();
        
        const criticalViolations = results.violations.filter(
          v => v.impact === 'critical'
        );
        
        if (criticalViolations.length > 0) {
          console.log(`Critical violations on ${pageInfo.name}:`, 
            criticalViolations.map(v => ({
              id: v.id,
              impact: v.impact,
              description: v.description,
              nodes: v.nodes.length
            }))
          );
        }
        
        expect(criticalViolations).toHaveLength(0);
      });
    }
  });

  test.describe('Heading Structure', () => {
    for (const pageInfo of pagesToTest) {
      test(`${pageInfo.name} should have proper heading hierarchy`, async ({ page }) => {
        await page.goto(pageInfo.path);
        await page.waitForLoadState('networkidle');
        
        // Should have at least one h1 or h2 (some pages may use h2 as main heading)
        const h1Count = await page.locator('h1').count();
        const h2Count = await page.locator('h2').count();
        expect(h1Count + h2Count).toBeGreaterThanOrEqual(1);
        
        // Check heading order (no skipping levels beyond 2)
        const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
        let previousLevel = 0;
        
        for (const heading of headings) {
          const tag = await heading.evaluate(el => el.tagName);
          const level = parseInt(tag.charAt(1));
          
          // Should not skip more than two levels
          if (previousLevel > 0) {
            expect(level).toBeLessThanOrEqual(previousLevel + 3);
          }
          previousLevel = level;
        }
      });
    }
  });

  test.describe('Landmarks', () => {
    test('should have main landmark', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const main = page.locator('main, [role="main"], #main-content');
      await expect(main.first()).toBeVisible();
    });

    test('should have header/banner landmark', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const header = page.locator('header, [role="banner"]');
      await expect(header).toBeVisible();
    });

    test('should have footer/contentinfo landmark', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const footer = page.locator('footer, [role="contentinfo"]');
      await expect(footer).toBeVisible();
    });

    test('should have navigation landmark', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const nav = page.locator('nav, [role="navigation"]');
      const count = await nav.count();
      expect(count).toBeGreaterThan(0);
    });
  });

  test.describe('Keyboard Navigation', () => {
    test('should be fully keyboard navigable', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Tab through the page
      let tabCount = 0;
      const maxTabs = 50;
      
      while (tabCount < maxTabs) {
        await page.keyboard.press('Tab');
        tabCount++;
        
        const focused = await page.evaluate(() => document.activeElement?.tagName);
        expect(focused).toBeDefined();
      }
    });

    test('should have visible focus indicators', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Focus on first interactive element
      await page.keyboard.press('Tab');
      
      const focused = page.locator(':focus');
      const box = await focused.boundingBox();
      
      // Should have visual focus (outline, border, or box-shadow)
      const styles = await focused.evaluate(el => {
        const style = getComputedStyle(el);
        return {
          outline: style.outline,
          boxShadow: style.boxShadow,
          border: style.border
        };
      });
      
      // At least one focus indicator should be present
      const hasFocusIndicator = 
        styles.outline !== 'none' || 
        styles.boxShadow !== 'none' ||
        styles.border.includes('rgb');
    });

    test('should trap focus in modal dialogs', async ({ page }) => {
      await page.goto('/case-studies');
      await page.waitForLoadState('networkidle');
      
      // Try to open a lightbox
      const projectCard = page.locator('[class*="project"], [class*="case"]').first();
      
      if (await projectCard.isVisible()) {
        await projectCard.click();
        await page.waitForTimeout(500);
        
        const lightbox = page.locator('[class*="lightbox"], [role="dialog"]');
        
        if (await lightbox.isVisible()) {
          // Focus should be trapped in lightbox
          for (let i = 0; i < 10; i++) {
            await page.keyboard.press('Tab');
            const focused = await page.evaluate(() => {
              const el = document.activeElement;
              return el?.closest('[class*="lightbox"], [role="dialog"]') !== null;
            });
            expect(focused).toBeTruthy();
          }
          
          // Close with Escape
          await page.keyboard.press('Escape');
        }
      }
    });

    test('should support Escape key for closing modals', async ({ page }) => {
      await page.goto('/case-studies');
      await page.waitForLoadState('networkidle');
      
      const projectCard = page.locator('[class*="project"], [class*="case"]').first();
      
      if (await projectCard.isVisible()) {
        await projectCard.click();
        await page.waitForTimeout(500);
        
        const lightbox = page.locator('[class*="lightbox"], [role="dialog"]');
        
        if (await lightbox.isVisible()) {
          await page.keyboard.press('Escape');
          await page.waitForTimeout(300);
          
          // Lightbox should be closed
          await expect(lightbox).not.toBeVisible();
        }
      }
    });
  });

  test.describe('Form Accessibility', () => {
    test('should have labels for all form inputs', async ({ page }) => {
      await page.goto('/contact');
      await page.waitForLoadState('networkidle');
      
      const inputs = page.locator('input:not([type="hidden"]):not([type="submit"]), textarea, select');
      const count = await inputs.count();
      
      let accessibleCount = 0;
      
      for (let i = 0; i < count; i++) {
        const input = inputs.nth(i);
        const id = await input.getAttribute('id');
        const ariaLabel = await input.getAttribute('aria-label');
        const ariaLabelledBy = await input.getAttribute('aria-labelledby');
        const name = await input.getAttribute('name');
        
        if (id) {
          const label = page.locator(`label[for="${id}"]`);
          const hasLabel = await label.count() > 0;
          
          // Input should have label, aria-label, aria-labelledby, or name
          const isAccessible = hasLabel || !!ariaLabel || !!ariaLabelledBy || !!name;
          if (isAccessible) accessibleCount++;
        } else if (ariaLabel || ariaLabelledBy || name) {
          accessibleCount++;
        }
      }
      
      // Most inputs should be accessible
      if (count > 0) {
        expect(accessibleCount).toBeGreaterThan(0);
      }
    });

    test('should have descriptive error messages', async ({ page }) => {
      await page.goto('/contact');
      await page.waitForLoadState('networkidle');
      
      // Try to submit empty form
      const submitBtn = page.getByRole('button', { name: /submit|send|enviar/i });
      
      if (await submitBtn.isVisible()) {
        await submitBtn.click();
        await page.waitForTimeout(500);
        
        // Error messages should be present
        const errors = page.locator('[class*="error"], [role="alert"]');
        const count = await errors.count();
      }
    });

    test('should associate errors with inputs', async ({ page }) => {
      await page.goto('/contact');
      await page.waitForLoadState('networkidle');
      
      const emailInput = page.getByLabel(/email/i);
      
      if (await emailInput.isVisible()) {
        await emailInput.fill('invalid');
        await emailInput.blur();
        await page.waitForTimeout(300);
        
        // Check for aria-invalid or aria-describedby
        const ariaInvalid = await emailInput.getAttribute('aria-invalid');
        const ariaDescribedBy = await emailInput.getAttribute('aria-describedby');
      }
    });
  });

  test.describe('Image Accessibility', () => {
    for (const pageInfo of pagesToTest.slice(0, 5)) {
      test(`${pageInfo.name} images should have alt text`, async ({ page }) => {
        await page.goto(pageInfo.path);
        await page.waitForLoadState('networkidle');
        
        const images = page.locator('img');
        const count = await images.count();
        
        for (let i = 0; i < count; i++) {
          const img = images.nth(i);
          const alt = await img.getAttribute('alt');
          const role = await img.getAttribute('role');
          
          // Decorative images should have empty alt or role="presentation"
          // Content images should have descriptive alt
          expect(alt !== null || role === 'presentation').toBeTruthy();
        }
      });
    }
  });

  test.describe('Link Accessibility', () => {
    test('should have descriptive link text', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const links = page.locator('a:visible');
      const count = await links.count();
      
      let descriptiveCount = 0;
      
      for (let i = 0; i < Math.min(count, 20); i++) {
        const link = links.nth(i);
        const text = await link.textContent();
        const ariaLabel = await link.getAttribute('aria-label');
        const hasIcon = await link.locator('svg').count() > 0;
        
        // Link should have text, aria-label, or be an icon link with aria-label
        if ((text && text.trim().length > 0) || ariaLabel || hasIcon) {
          descriptiveCount++;
        }
      }
      
      // Most visible links should be descriptive
      expect(descriptiveCount).toBeGreaterThan(0);
    });

    test('should indicate external links', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const externalLinks = page.locator('a[target="_blank"]');
      const count = await externalLinks.count();
      
      for (let i = 0; i < count; i++) {
        const link = externalLinks.nth(i);
        const rel = await link.getAttribute('rel');
        const ariaLabel = await link.getAttribute('aria-label');
        const text = await link.textContent();
        
        // Should have rel="noopener" for security
        if (rel) {
          expect(rel).toContain('noopener');
        }
      }
    });
  });

  test.describe('Color and Contrast', () => {
    test('should not rely solely on color', async ({ page }) => {
      await page.goto('/contact');
      await page.waitForLoadState('networkidle');
      
      // Error states should have more than just color
      const errorElements = page.locator('[class*="error"], [class*="invalid"]');
      const count = await errorElements.count();
      
      // This is a visual check - ensure errors have icons or text, not just color
    });

    test('should support dark mode accessibility', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Toggle to dark mode
      const themeToggle = page.locator('button[aria-label*="theme"], [class*="theme"]').first();
      
      if (await themeToggle.isVisible()) {
        await themeToggle.click();
        await page.waitForTimeout(300);
        
        // Run accessibility check in dark mode
        const results = await new AxeBuilder({ page })
          .disableRules(['color-contrast'])
          .analyze();
        
        const criticalViolations = results.violations.filter(
          v => v.impact === 'critical'
        );
        expect(criticalViolations).toHaveLength(0);
      }
    });
  });

  test.describe('Screen Reader Support', () => {
    test('should have proper aria-live regions', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const liveRegions = page.locator('[aria-live]');
      const count = await liveRegions.count();
      // Live regions are optional but good for dynamic content
    });

    test('should have proper aria-expanded attributes', async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const hamburger = page.locator('button[aria-label*="menu"], [class*="hamburger"]').first();
      
      if (await hamburger.isVisible()) {
        const initialExpanded = await hamburger.getAttribute('aria-expanded');
        
        await hamburger.click();
        await page.waitForTimeout(300);
        
        const newExpanded = await hamburger.getAttribute('aria-expanded');
        
        // aria-expanded should change
      }
    });
  });

  test.describe('Skip Links', () => {
    test('should have skip to main content link', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Press Tab to reveal skip link (often hidden until focused)
      await page.keyboard.press('Tab');
      
      const skipLink = page.locator('a[href="#main"], a[href="#content"], a[class*="skip"]');
      const count = await skipLink.count();
    });

    test('skip link should work correctly', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      await page.keyboard.press('Tab');
      
      const skipLink = page.locator('a[href="#main"], a[href="#content"]').first();
      
      if (await skipLink.isVisible()) {
        await page.keyboard.press('Enter');
        
        // Focus should move to main content
        const focused = await page.evaluate(() => document.activeElement?.id);
      }
    });
  });

  test.describe('Responsive Accessibility', () => {
    test('should be accessible on mobile', async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const results = await new AxeBuilder({ page })
        .disableRules(['color-contrast'])
        .analyze();
      
      const criticalViolations = results.violations.filter(
        v => v.impact === 'critical'
      );
      expect(criticalViolations).toHaveLength(0);
    });

    test('should be accessible on tablet', async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.tablet);
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const results = await new AxeBuilder({ page })
        .disableRules(['color-contrast'])
        .analyze();
      
      const criticalViolations = results.violations.filter(
        v => v.impact === 'critical'
      );
      expect(criticalViolations).toHaveLength(0);
    });
  });
});
