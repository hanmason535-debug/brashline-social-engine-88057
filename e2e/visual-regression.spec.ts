import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
  test('homepage screenshot - desktop', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('homepage-desktop.png', {
      fullPage: true,
    });
  });

  test('homepage screenshot - mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('homepage-mobile.png', {
      fullPage: true,
    });
  });

  test('services page screenshot', async ({ page }) => {
    await page.goto('/services');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('services-page.png', {
      fullPage: true,
    });
  });

  test('case studies page screenshot', async ({ page }) => {
    await page.goto('/case-studies');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('case-studies-page.png', {
      fullPage: true,
    });
  });

  test('contact page screenshot', async ({ page }) => {
    await page.goto('/contact');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('contact-page.png', {
      fullPage: true,
    });
  });

  test('dark theme screenshot', async ({ page }) => {
    await page.goto('/');
    
    // Toggle to dark theme
    await page.getByRole('button', { name: /theme/i }).click();
    await page.waitForTimeout(300);
    
    await expect(page).toHaveScreenshot('homepage-dark.png', {
      fullPage: true,
    });
  });

  test('lightbox screenshot', async ({ page }) => {
    await page.goto('/case-studies');
    await page.locator('.website-card').first().click();
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('lightbox-open.png');
  });
});
