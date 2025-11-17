import { test, expect } from '@playwright/test';

test.describe('Case Studies Lightbox Navigation', () => {
  test('should open lightbox and navigate through items', async ({ page }) => {
    await page.goto('/case-studies');
    
    // Click on first website project card
    await page.locator('.website-card').first().click();
    
    // Verify lightbox opened
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    
    // Check navigation buttons exist
    const prevButton = page.getByRole('button', { name: /previous|prev/i });
    const nextButton = page.getByRole('button', { name: /next/i });
    
    await expect(nextButton).toBeVisible();
    
    // Navigate to next item
    await nextButton.click();
    await page.waitForTimeout(300);
    
    // Check that content changed (counter should update)
    await expect(page.locator('text=/\\d+ \\/ \\d+/')).toBeVisible();
    
    // Navigate back
    await prevButton.click();
    await page.waitForTimeout(300);
  });

  test('should support keyboard navigation in lightbox', async ({ page }) => {
    await page.goto('/case-studies');
    
    // Open lightbox
    await page.locator('.website-card').first().click();
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    
    // Test arrow key navigation
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(300);
    
    await page.keyboard.press('ArrowLeft');
    await page.waitForTimeout(300);
    
    // Test escape to close
    await page.keyboard.press('Escape');
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
  });

  test('should support swipe gestures on mobile', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'This test is only for mobile devices');
    
    await page.goto('/case-studies');
    
    // Open lightbox
    await page.locator('.website-card').first().click();
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    
    // Get lightbox element
    const lightbox = page.locator('[role="dialog"]');
    const box = await lightbox.boundingBox();
    
    if (box) {
      // Swipe left (next)
      await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
      await page.touchscreen.swipe(
        { x: box.x + box.width * 0.8, y: box.y + box.height / 2 },
        { x: box.x + box.width * 0.2, y: box.y + box.height / 2 }
      );
      
      await page.waitForTimeout(300);
      
      // Swipe right (previous)
      await page.touchscreen.swipe(
        { x: box.x + box.width * 0.2, y: box.y + box.height / 2 },
        { x: box.x + box.width * 0.8, y: box.y + box.height / 2 }
      );
    }
  });

  test('should trap focus within lightbox', async ({ page }) => {
    await page.goto('/case-studies');
    
    // Open lightbox
    await page.locator('.website-card').first().click();
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    
    // Tab through focusable elements
    await page.keyboard.press('Tab');
    const firstFocus = await page.evaluate(() => document.activeElement?.tagName);
    
    // Tab multiple times
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
    }
    
    // Focus should still be within lightbox
    const isInLightbox = await page.evaluate(() => {
      const activeEl = document.activeElement;
      const lightbox = document.querySelector('[role="dialog"]');
      return lightbox?.contains(activeEl);
    });
    
    expect(isInLightbox).toBe(true);
  });
});
