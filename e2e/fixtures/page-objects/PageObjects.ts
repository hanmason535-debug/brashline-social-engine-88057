import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Home Page Object Model
 */
export class HomePage extends BasePage {
  readonly heroSection: Locator;
  readonly heroTitle: Locator;
  readonly heroCTA: Locator;
  readonly valuePropsSection: Locator;
  readonly statsSection: Locator;
  readonly pricingSection: Locator;
  readonly ctaSection: Locator;
  readonly contactDialog: Locator;
  readonly contactDialogTrigger: Locator;

  constructor(page: Page) {
    super(page);
    this.heroSection = page.locator('section').first();
    this.heroTitle = page.locator('h1').first();
    this.heroCTA = page.getByRole('link', { name: /get started|book|call|contact/i }).first();
    this.valuePropsSection = page.locator('section:has(h2:text-matches("why choose|por qué", "i"))');
    this.statsSection = page.locator('section:has(.stat-item), section:has([class*="stat"])');
    this.pricingSection = page.locator('section:has(h2:text-matches("pick your plan|elige tu plan", "i"))');
    this.ctaSection = page.locator('section:has(h2:text-matches("ready to get started|listo para comenzar", "i"))');
    this.contactDialog = page.locator('[role="dialog"]');
    this.contactDialogTrigger = page.getByRole('button', { name: /book.*call|reservar|schedule|agendar/i });
  }

  async goto() {
    await super.goto('/');
  }

  async clickHeroCTA() {
    await this.heroCTA.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async openContactDialog() {
    await this.contactDialogTrigger.click();
    await expect(this.contactDialog).toBeVisible();
  }

  async closeContactDialog() {
    await this.page.keyboard.press('Escape');
    await expect(this.contactDialog).not.toBeVisible();
  }

  async verifyAllSections() {
    await expect(this.heroSection).toBeVisible();
    await expect(this.heroTitle).toBeVisible();
    // Other sections may lazy load
    await this.page.waitForTimeout(1000);
  }

  async selectPricingPlan(planName: string) {
    const planCard = this.page.locator(`[class*="card"]:has-text("${planName}")`).first();
    const button = planCard.getByRole('button', { name: /add to cart|get started/i });
    await button.click();
  }

  async verifyBillingToggle() {
    const monthlyButton = this.page.getByRole('button', { name: /monthly|mensual/i });
    const annualButton = this.page.getByRole('button', { name: /annual|anual/i });
    return {
      monthly: await monthlyButton.isVisible(),
      annual: await annualButton.isVisible()
    };
  }
}

/**
 * About Page Object Model
 */
export class AboutPage extends BasePage {
  readonly pageTitle: Locator;
  readonly teamSection: Locator;
  readonly valuesSection: Locator;
  readonly missionSection: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('h1');
    this.teamSection = page.locator('section:has-text("team"), section:has-text("equipo")');
    this.valuesSection = page.locator('section:has-text("values"), section:has-text("valores")');
    this.missionSection = page.locator('section:has-text("mission"), section:has-text("misión")');
  }

  async goto() {
    await super.goto('/about');
  }
}

/**
 * Services Page Object Model
 */
export class ServicesPage extends BasePage {
  readonly pageTitle: Locator;
  readonly serviceCards: Locator;
  readonly ctaButton: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('h1');
    this.serviceCards = page.locator('[class*="card"], .service-card, [data-testid="service-card"]');
    this.ctaButton = page.getByRole('button', { name: /get started|contact|consulta/i }).first();
  }

  async goto() {
    await super.goto('/services');
  }

  async clickServiceCard(index: number) {
    await this.serviceCards.nth(index).click();
  }

  async getServiceCardCount(): Promise<number> {
    return await this.serviceCards.count();
  }
}

/**
 * Case Studies / Portfolio Page Object Model
 */
export class CaseStudiesPage extends BasePage {
  readonly pageTitle: Locator;
  readonly websiteCards: Locator;
  readonly socialCards: Locator;
  readonly filterButtons: Locator;
  readonly lightbox: Locator;
  readonly lightboxClose: Locator;
  readonly lightboxNext: Locator;
  readonly lightboxPrev: Locator;
  readonly lightboxCounter: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('h1');
    this.websiteCards = page.locator('[class*="website"], .website-card, [role="button"][aria-label*="View details"]');
    this.socialCards = page.locator('[class*="social"], .social-card, [role="button"][aria-label*="View"][aria-label*="post"]');
    this.filterButtons = page.locator('[role="button"]:has-text("All"), [role="button"]:has-text("Websites"), [role="button"]:has-text("Social")');
    this.lightbox = page.locator('[role="dialog"]');
    this.lightboxClose = page.getByRole('button', { name: /close|cerrar|x/i });
    this.lightboxNext = page.getByRole('button', { name: /next|siguiente/i });
    this.lightboxPrev = page.getByRole('button', { name: /prev|previous|anterior/i });
    this.lightboxCounter = page.locator('text=/\\d+\\s*\\/\\s*\\d+/');
  }

  async goto() {
    await super.goto('/case-studies');
  }

  async openLightbox(cardIndex: number = 0) {
    const card = this.websiteCards.nth(cardIndex);
    await card.click();
    await expect(this.lightbox).toBeVisible();
  }

  async closeLightbox() {
    await this.page.keyboard.press('Escape');
    await expect(this.lightbox).not.toBeVisible();
  }

  async navigateLightboxNext() {
    await this.lightboxNext.click();
    await this.page.waitForTimeout(300);
  }

  async navigateLightboxPrev() {
    await this.lightboxPrev.click();
    await this.page.waitForTimeout(300);
  }

  async filterBy(filterName: string) {
    await this.page.getByRole('button', { name: new RegExp(filterName, 'i') }).click();
    await this.page.waitForTimeout(300);
  }
}

/**
 * Contact Page Object Model
 */
export class ContactPage extends BasePage {
  readonly pageTitle: Locator;
  readonly contactForm: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly messageInput: Locator;
  readonly serviceSelect: Locator;
  readonly submitButton: Locator;
  readonly whatsappButton: Locator;
  readonly phoneCard: Locator;
  readonly emailCard: Locator;
  readonly hoursCard: Locator;
  readonly successToast: Locator;
  readonly errorMessages: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('h1');
    this.contactForm = page.locator('form');
    this.nameInput = page.getByLabel(/full name|nombre/i);
    this.emailInput = page.getByLabel(/email|correo/i);
    this.phoneInput = page.getByLabel(/phone|teléfono/i);
    this.messageInput = page.getByLabel(/message|mensaje/i);
    this.serviceSelect = page.getByRole('combobox');
    this.submitButton = page.getByRole('button', { name: /send|enviar/i });
    this.whatsappButton = page.getByRole('link', { name: /whatsapp/i });
    this.phoneCard = page.locator('[class*="card"]:has-text("+1")');
    this.emailCard = page.locator('[class*="card"]:has-text("@")');
    this.hoursCard = page.locator('[class*="card"]:has-text("Mon"), [class*="card"]:has-text("Lun")');
    this.successToast = page.locator('.sonner-toast, [role="status"]');
    this.errorMessages = page.locator('[class*="error"], [data-error], .text-destructive');
  }

  async goto() {
    await super.goto('/contact');
  }

  async fillForm(data: { name: string; email: string; phone?: string; message: string; service?: string }) {
    await this.nameInput.fill(data.name);
    await this.emailInput.fill(data.email);
    if (data.phone) await this.phoneInput.fill(data.phone);
    await this.messageInput.fill(data.message);
    
    if (data.service && await this.serviceSelect.isVisible()) {
      await this.serviceSelect.click();
      await this.page.getByRole('option', { name: new RegExp(data.service, 'i') }).click();
    }
  }

  async submitForm() {
    await this.submitButton.click();
  }

  async clearForm() {
    await this.nameInput.clear();
    await this.emailInput.clear();
    await this.phoneInput.clear();
    await this.messageInput.clear();
  }

  async verifyContactCards() {
    await expect(this.phoneCard).toBeVisible();
    await expect(this.emailCard).toBeVisible();
    await expect(this.hoursCard).toBeVisible();
  }
}

/**
 * Pricing Page Object Model
 */
export class PricingPage extends BasePage {
  readonly pageTitle: Locator;
  readonly mainPackageCard: Locator;
  readonly pricingCards: Locator;
  readonly addOnsSection: Locator;
  readonly addOnsCards: Locator;
  readonly addToCartButtons: Locator;

  constructor(page: Page) {
    super(page);
    // Page uses h2 for sections, not h1
    this.pageTitle = page.locator('h2').first();
    this.mainPackageCard = page.locator('[class*="card"]:has-text("Digital Launch Pro")');
    this.pricingCards = page.locator('[class*="card"]').filter({ hasText: /\$/ });
    this.addOnsSection = page.locator('section#addons');
    // Target cards within the add-ons section
    this.addOnsCards = page.locator('#addons [class*="card"]');
    this.addToCartButtons = page.getByRole('button', { name: /add to cart|agregar/i });
  }

  async goto() {
    await super.goto('/pricing');
  }

  async getPricingCardCount(): Promise<number> {
    return await this.pricingCards.count();
  }

  async getAddOnsCardCount(): Promise<number> {
    // Wait for animation to complete
    await this.page.waitForTimeout(500);
    return await this.addOnsCards.count();
  }

  async addMainPackageToCart() {
    const button = this.mainPackageCard.getByRole('button', { name: /add to cart|agregar/i });
    await button.click();
  }

  async addPackageToCart(packageName: string) {
    const card = this.page.locator(`[class*="card"]:has-text("${packageName}")`).first();
    const button = card.getByRole('button', { name: /add to cart|agregar/i });
    await button.click();
  }
}

/**
 * Cart Page Object Model
 */
export class CartPage extends BasePage {
  readonly pageTitle: Locator;
  readonly cartItems: Locator;
  readonly emptyCartMessage: Locator;
  readonly totalAmount: Locator;
  readonly checkoutButton: Locator;
  readonly removeButtons: Locator;
  readonly quantityInputs: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('h1');
    this.cartItems = page.locator('[class*="cart-item"], [data-testid="cart-item"]');
    this.emptyCartMessage = page.locator('text=/empty|vacío/i');
    this.totalAmount = page.locator('[class*="total"], text=/\\$\\d+/');
    this.checkoutButton = page.getByRole('button', { name: /checkout|proceder|proceed/i });
    this.removeButtons = page.getByRole('button', { name: /remove|eliminar|delete/i });
    this.quantityInputs = page.locator('input[type="number"], [class*="quantity"]');
  }

  async goto() {
    await super.goto('/cart');
  }

  async removeItem(index: number) {
    await this.removeButtons.nth(index).click();
    await this.page.waitForTimeout(200);
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }
}

export { BasePage };
