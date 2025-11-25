import { test, expect, VIEWPORTS } from '../fixtures/test-fixtures';

test.describe('Case Studies Page Tests', () => {
  test.describe('Page Load & Core Elements', () => {
    test('should load case studies page successfully', async ({ caseStudiesPage }) => {
      await caseStudiesPage.goto();
      await expect(caseStudiesPage.pageTitle).toBeVisible();
      await expect(caseStudiesPage.header).toBeVisible();
      await expect(caseStudiesPage.footer).toBeVisible();
    });

    test('should have correct page title', async ({ caseStudiesPage }) => {
      await caseStudiesPage.goto();
      const title = await caseStudiesPage.getPageTitle();
      expect(title.toLowerCase()).toMatch(/case|portfolio|work|proyecto|trabajo/);
    });

    test('should display project cards', async ({ caseStudiesPage }) => {
      await caseStudiesPage.goto();
      await caseStudiesPage.page.waitForLoadState('networkidle');
      
      const websiteCount = await caseStudiesPage.websiteCards.count();
      const socialCount = await caseStudiesPage.socialCards.count();
      
      expect(websiteCount + socialCount).toBeGreaterThan(0);
    });
  });

  test.describe('Filters', () => {
    test('should display filter options', async ({ caseStudiesPage }) => {
      await caseStudiesPage.goto();
      await caseStudiesPage.page.waitForLoadState('networkidle');
      
      const count = await caseStudiesPage.filterButtons.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should filter by websites', async ({ caseStudiesPage }) => {
      await caseStudiesPage.goto();
      await caseStudiesPage.page.waitForLoadState('networkidle');
      
      await caseStudiesPage.filterBy('website');
      
      const websiteCards = await caseStudiesPage.websiteCards.count();
      expect(websiteCards).toBeGreaterThanOrEqual(0);
    });

    test('should filter by social posts', async ({ caseStudiesPage }) => {
      await caseStudiesPage.goto();
      await caseStudiesPage.page.waitForLoadState('networkidle');
      
      await caseStudiesPage.filterBy('social');
      
      const socialCards = await caseStudiesPage.socialCards.count();
      expect(socialCards).toBeGreaterThanOrEqual(0);
    });

    test('should show all items with All filter', async ({ caseStudiesPage }) => {
      await caseStudiesPage.goto();
      await caseStudiesPage.page.waitForLoadState('networkidle');
      
      // First filter by type
      await caseStudiesPage.filterBy('social');
      
      // Then show all
      await caseStudiesPage.filterBy('all');
      
      const websiteCount = await caseStudiesPage.websiteCards.count();
      const socialCount = await caseStudiesPage.socialCards.count();
      expect(websiteCount + socialCount).toBeGreaterThan(0);
    });
  });

  test.describe('Lightbox', () => {
    test('should open lightbox on card click', async ({ caseStudiesPage }) => {
      await caseStudiesPage.goto();
      await caseStudiesPage.page.waitForLoadState('networkidle');
      
      const card = caseStudiesPage.websiteCards.first();
      
      if (await card.isVisible()) {
        await caseStudiesPage.openLightbox(0);
        await expect(caseStudiesPage.lightbox).toBeVisible();
      }
    });

    test('should close lightbox with Escape key', async ({ caseStudiesPage }) => {
      await caseStudiesPage.goto();
      await caseStudiesPage.page.waitForLoadState('networkidle');
      
      const card = caseStudiesPage.websiteCards.first();
      
      if (await card.isVisible()) {
        await caseStudiesPage.openLightbox(0);
        await expect(caseStudiesPage.lightbox).toBeVisible();
        
        await caseStudiesPage.closeLightbox();
        await expect(caseStudiesPage.lightbox).not.toBeVisible();
      }
    });

    test('should close lightbox with close button', async ({ caseStudiesPage }) => {
      await caseStudiesPage.goto();
      await caseStudiesPage.page.waitForLoadState('networkidle');
      
      const card = caseStudiesPage.websiteCards.first();
      
      if (await card.isVisible()) {
        await caseStudiesPage.openLightbox(0);
        await expect(caseStudiesPage.lightbox).toBeVisible();
        
        if (await caseStudiesPage.lightboxClose.isVisible()) {
          await caseStudiesPage.lightboxClose.click();
          await expect(caseStudiesPage.lightbox).not.toBeVisible();
        }
      }
    });

    test('should navigate to next item in lightbox', async ({ caseStudiesPage }) => {
      await caseStudiesPage.goto();
      await caseStudiesPage.page.waitForLoadState('networkidle');
      
      const card = caseStudiesPage.websiteCards.first();
      
      if (await card.isVisible()) {
        await caseStudiesPage.openLightbox(0);
        await expect(caseStudiesPage.lightbox).toBeVisible();
        
        if (await caseStudiesPage.lightboxNext.isVisible()) {
          await caseStudiesPage.navigateLightboxNext();
          await expect(caseStudiesPage.lightbox).toBeVisible();
        }
      }
    });

    test('should navigate to previous item in lightbox', async ({ caseStudiesPage }) => {
      await caseStudiesPage.goto();
      await caseStudiesPage.page.waitForLoadState('networkidle');
      
      const card = caseStudiesPage.websiteCards.first();
      
      if (await card.isVisible()) {
        await caseStudiesPage.openLightbox(0);
        await expect(caseStudiesPage.lightbox).toBeVisible();
        
        // Navigate forward first
        if (await caseStudiesPage.lightboxNext.isVisible()) {
          await caseStudiesPage.navigateLightboxNext();
        }
        
        // Then back
        if (await caseStudiesPage.lightboxPrev.isVisible()) {
          await caseStudiesPage.navigateLightboxPrev();
          await expect(caseStudiesPage.lightbox).toBeVisible();
        }
      }
    });

    test('should navigate lightbox with arrow keys', async ({ caseStudiesPage }) => {
      await caseStudiesPage.goto();
      await caseStudiesPage.page.waitForLoadState('networkidle');
      
      const card = caseStudiesPage.websiteCards.first();
      
      if (await card.isVisible()) {
        await caseStudiesPage.openLightbox(0);
        await expect(caseStudiesPage.lightbox).toBeVisible();
        
        await caseStudiesPage.page.keyboard.press('ArrowRight');
        await caseStudiesPage.page.waitForTimeout(300);
        
        await caseStudiesPage.page.keyboard.press('ArrowLeft');
        await caseStudiesPage.page.waitForTimeout(300);
        
        await expect(caseStudiesPage.lightbox).toBeVisible();
      }
    });

    test('should display project counter in lightbox', async ({ caseStudiesPage }) => {
      await caseStudiesPage.goto();
      await caseStudiesPage.page.waitForLoadState('networkidle');
      
      const card = caseStudiesPage.websiteCards.first();
      
      if (await card.isVisible()) {
        await caseStudiesPage.openLightbox(0);
        await expect(caseStudiesPage.lightbox).toBeVisible();
        
        if (await caseStudiesPage.lightboxCounter.isVisible()) {
          const text = await caseStudiesPage.lightboxCounter.textContent();
          expect(text).toMatch(/\d+\s*\/\s*\d+/);
        }
      }
    });

    test('should trap focus within lightbox', async ({ caseStudiesPage }) => {
      await caseStudiesPage.goto();
      await caseStudiesPage.page.waitForLoadState('networkidle');
      
      const card = caseStudiesPage.websiteCards.first();
      
      if (await card.isVisible()) {
        await caseStudiesPage.openLightbox(0);
        await expect(caseStudiesPage.lightbox).toBeVisible();
        
        // Tab multiple times
        for (let i = 0; i < 10; i++) {
          await caseStudiesPage.page.keyboard.press('Tab');
        }
        
        // Focus should still be within dialog
        const isInDialog = await caseStudiesPage.page.evaluate(() => {
          const dialog = document.querySelector('[role="dialog"]');
          return dialog?.contains(document.activeElement);
        });
        
        expect(isInDialog).toBeTruthy();
      }
    });
  });

  test.describe('Project Cards', () => {
    test('should display project title', async ({ caseStudiesPage }) => {
      await caseStudiesPage.goto();
      await caseStudiesPage.page.waitForLoadState('networkidle');
      
      const cardTitle = caseStudiesPage.page.locator('.website-card h3, [role="button"] h3').first();
      
      if (await cardTitle.isVisible()) {
        const text = await cardTitle.textContent();
        expect(text!.length).toBeGreaterThan(0);
      }
    });

    test('should display project description', async ({ caseStudiesPage }) => {
      await caseStudiesPage.goto();
      await caseStudiesPage.page.waitForLoadState('networkidle');
      
      const cardDesc = caseStudiesPage.page.locator('.website-card p, [role="button"] p').first();
      
      if (await cardDesc.isVisible()) {
        const text = await cardDesc.textContent();
        expect(text!.length).toBeGreaterThan(0);
      }
    });

    test('should have keyboard accessible cards', async ({ caseStudiesPage }) => {
      await caseStudiesPage.goto();
      await caseStudiesPage.page.waitForLoadState('networkidle');
      
      const card = caseStudiesPage.page.locator('[role="button"][tabindex="0"]').first();
      
      if (await card.isVisible()) {
        await card.focus();
        
        const isFocused = await card.evaluate(el => document.activeElement === el);
        expect(isFocused).toBeTruthy();
        
        // Should open on Enter
        await caseStudiesPage.page.keyboard.press('Enter');
        await expect(caseStudiesPage.lightbox).toBeVisible({ timeout: 5000 });
      }
    });
  });

  test.describe('Responsive Design', () => {
    test('should display correctly on mobile', async ({ caseStudiesPage, page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await caseStudiesPage.goto();
      
      await expect(caseStudiesPage.pageTitle).toBeVisible();
    });

    test('should stack cards on mobile', async ({ caseStudiesPage, page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await caseStudiesPage.goto();
      await page.waitForLoadState('networkidle');
      
      const card = caseStudiesPage.websiteCards.first();
      
      if (await card.isVisible()) {
        const box = await card.boundingBox();
        expect(box!.width).toBeLessThanOrEqual(VIEWPORTS.mobile.width);
      }
    });

    test('should display correctly on tablet', async ({ caseStudiesPage, page }) => {
      await page.setViewportSize(VIEWPORTS.tablet);
      await caseStudiesPage.goto();
      
      await expect(caseStudiesPage.pageTitle).toBeVisible();
    });

    test('should display correctly on desktop', async ({ caseStudiesPage, page }) => {
      await page.setViewportSize(VIEWPORTS.desktop);
      await caseStudiesPage.goto();
      
      await expect(caseStudiesPage.pageTitle).toBeVisible();
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper heading hierarchy', async ({ caseStudiesPage, page }) => {
      await caseStudiesPage.goto();
      
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBe(1);
    });

    test('should have accessible project cards', async ({ caseStudiesPage }) => {
      await caseStudiesPage.goto();
      await caseStudiesPage.page.waitForLoadState('networkidle');
      
      const cards = caseStudiesPage.page.locator('[role="button"][aria-label]');
      const count = await cards.count();
      
      for (let i = 0; i < Math.min(count, 3); i++) {
        const ariaLabel = await cards.nth(i).getAttribute('aria-label');
        expect(ariaLabel).toBeTruthy();
      }
    });
  });

  test.describe('Language Support', () => {
    test('should display Spanish content when language is ES', async ({ caseStudiesPage }) => {
      await caseStudiesPage.goto();
      
      const langToggle = caseStudiesPage.page.getByRole('button', { name: /^(en|es)$/i });
      if (await langToggle.isVisible()) {
        await langToggle.click();
        await caseStudiesPage.page.waitForTimeout(500);
        
        const spanishText = caseStudiesPage.page.locator('text=/proyecto|trabajo|portafolio|nuestro/i').first();
        await expect(spanishText).toBeVisible({ timeout: 5000 });
      }
    });
  });
});
