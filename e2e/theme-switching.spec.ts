import { test, expect } from '@playwright/test';

test.describe('Theme Switching', () => {
  test('should switch between light and dark themes', async ({ page }) => {
    await page.goto('/');
    
    // Find theme toggle button
    const themeToggle = page.getByRole('button', { name: /theme|toggle theme/i });
    
    // Get initial theme
    const initialTheme = await page.locator('html').getAttribute('class');
    
    // Toggle theme
    await themeToggle.click();
    
    // Wait for theme to change
    await page.waitForTimeout(300);
    
    // Verify theme changed
    const newTheme = await page.locator('html').getAttribute('class');
    expect(initialTheme).not.toBe(newTheme);
    
    // Check if dark class is toggled
    if (initialTheme?.includes('dark')) {
      expect(newTheme).not.toContain('dark');
    } else {
      expect(newTheme).toContain('dark');
    }
  });

  test('should persist theme across page reloads', async ({ page }) => {
    await page.goto('/');
    
    // Set to dark theme
    const themeToggle = page.getByRole('button', { name: /theme|toggle theme/i });
    await themeToggle.click();
    await page.waitForTimeout(300);
    
    const themeAfterToggle = await page.locator('html').getAttribute('class');
    
    // Reload page
    await page.reload();
    
    // Verify theme persisted
    const themeAfterReload = await page.locator('html').getAttribute('class');
    expect(themeAfterReload).toBe(themeAfterToggle);
  });
});
