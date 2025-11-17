import { test, expect } from '@playwright/test';

test.describe('Language Switching', () => {
  test('should switch between English and Spanish', async ({ page }) => {
    await page.goto('/');
    
    // Check default language (English)
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    
    // Find and click language toggle
    const languageToggle = page.getByRole('button', { name: /en|es/i });
    await languageToggle.click();
    
    // Verify language changed to Spanish
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
    
    // Check Spanish content
    await expect(page.getByText(/servicios|inicio/i)).toBeVisible();
    
    // Switch back to English
    await languageToggle.click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    
    // Check English content
    await expect(page.getByText(/services|home/i)).toBeVisible();
  });

  test('should persist language across navigation', async ({ page }) => {
    await page.goto('/');
    
    // Switch to Spanish
    await page.getByRole('button', { name: /en|es/i }).click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
    
    // Navigate to another page
    await page.getByRole('link', { name: /servicios/i }).click();
    
    // Verify language persisted
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  });
});
