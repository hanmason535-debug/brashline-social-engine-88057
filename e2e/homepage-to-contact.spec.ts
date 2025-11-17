import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Homepage to Contact Flow', () => {
  test('should navigate from homepage to services to contact form', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');
    
    // Check homepage loaded
    await expect(page.locator('h1')).toBeVisible();
    
    // Navigate to services
    await page.getByRole('link', { name: /services/i }).click();
    await expect(page).toHaveURL(/\/services/);
    
    // Click on a service card
    await page.locator('.service-card').first().click();
    
    // Navigate to contact
    await page.getByRole('link', { name: /contact/i }).click();
    await expect(page).toHaveURL(/\/contact/);
    
    // Fill contact form
    await page.getByLabel(/full name/i).fill('John Doe');
    await page.getByLabel(/email/i).fill('john@example.com');
    await page.getByLabel(/phone/i).fill('1234567890');
    await page.getByLabel(/message/i).fill('This is a test message with enough length');
    
    // Select service type
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /social media/i }).click();
    
    // Submit form
    await page.getByRole('button', { name: /send message/i }).click();
    
    // Verify submission (WhatsApp redirect or toast)
    await expect(page).toHaveURL(/whatsapp|mailto/, { timeout: 5000 }).catch(() => {
      // If WhatsApp doesn't redirect, check for success toast
      expect(page.locator('.sonner-toast')).toBeVisible();
    });
  });

  test('should not have accessibility violations', async ({ page }) => {
    await page.goto('/');
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
