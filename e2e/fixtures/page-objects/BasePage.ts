import { Page, Locator, expect } from '@playwright/test';

/**
 * Base Page Object Model
 * Contains common methods and selectors used across all pages
 */
export class BasePage {
  readonly page: Page;
  readonly header: Locator;
  readonly footer: Locator;
  readonly mainContent: Locator;
  readonly themeToggle: Locator;
  readonly languageToggle: Locator;
  readonly mobileMenuButton: Locator;
  readonly mobileMenu: Locator;
  readonly skipLink: Locator;
  readonly loadingSpinner: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = page.locator('header').first();
    this.footer = page.locator('footer').first();
    this.mainContent = page.locator('main#main-content');
    this.themeToggle = page.getByRole('button', { name: /theme|toggle theme|switch theme/i });
    this.languageToggle = page.getByRole('button', { name: /^(en|es)$/i });
    this.mobileMenuButton = page.getByRole('button', { name: /menu|open menu|toggle menu/i });
    this.mobileMenu = page.locator('[data-testid="mobile-menu"], .mobile-menu, nav[aria-label="Mobile navigation"]');
    this.skipLink = page.locator('a[href="#main-content"]');
    this.loadingSpinner = page.locator('.animate-spin');
  }

  async goto(path: string = '/') {
    await this.page.goto(path);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  async getMetaDescription(): Promise<string | null> {
    return await this.page.locator('meta[name="description"]').first().getAttribute('content');
  }

  async getCurrentLanguage(): Promise<string | null> {
    return await this.page.locator('html').getAttribute('lang');
  }

  async getCurrentTheme(): Promise<string | null> {
    return await this.page.locator('html').getAttribute('class');
  }

  async toggleTheme() {
    await this.themeToggle.click();
    await this.page.waitForTimeout(300);
  }

  async toggleLanguage() {
    await this.languageToggle.click();
    await this.page.waitForTimeout(300);
  }

  async navigateTo(linkText: string) {
    await this.page.getByRole('link', { name: new RegExp(linkText, 'i') }).first().click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async openMobileMenu() {
    if (await this.mobileMenuButton.isVisible()) {
      await this.mobileMenuButton.click();
      await this.page.waitForTimeout(200);
    }
  }

  async closeMobileMenu() {
    const closeButton = this.page.getByRole('button', { name: /close|x/i });
    if (await closeButton.isVisible()) {
      await closeButton.click();
      await this.page.waitForTimeout(200);
    }
  }

  async checkAccessibility() {
    // Basic accessibility checks
    await expect(this.header).toBeVisible();
    await expect(this.mainContent).toBeVisible();
    await expect(this.footer).toBeVisible();
  }

  async setViewport(width: number, height: number) {
    await this.page.setViewportSize({ width, height });
  }

  async takeScreenshot(name: string) {
    return await this.page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
  }

  async scrollToElement(selector: string) {
    await this.page.locator(selector).scrollIntoViewIfNeeded();
  }

  async pressKey(key: string) {
    await this.page.keyboard.press(key);
  }

  async tabToElement(selector: string) {
    let attempts = 0;
    while (attempts < 20) {
      await this.page.keyboard.press('Tab');
      const focused = await this.page.evaluate(() => document.activeElement?.matches(arguments[0]));
      if (focused) return;
      attempts++;
    }
  }
}
