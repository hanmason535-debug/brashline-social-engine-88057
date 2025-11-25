import { test as base, expect } from '@playwright/test';
import { 
  BasePage, 
  HomePage, 
  AboutPage, 
  ServicesPage, 
  CaseStudiesPage, 
  ContactPage, 
  PricingPage,
  CartPage 
} from './page-objects/PageObjects';

/**
 * Custom test fixtures for Brashline E2E tests
 * Provides pre-initialized page objects and common test utilities
 */
type PageFixtures = {
  basePage: BasePage;
  homePage: HomePage;
  aboutPage: AboutPage;
  servicesPage: ServicesPage;
  caseStudiesPage: CaseStudiesPage;
  contactPage: ContactPage;
  pricingPage: PricingPage;
  cartPage: CartPage;
};

export const test = base.extend<PageFixtures>({
  basePage: async ({ page }, use) => {
    const basePage = new BasePage(page);
    await use(basePage);
  },
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },
  aboutPage: async ({ page }, use) => {
    const aboutPage = new AboutPage(page);
    await use(aboutPage);
  },
  servicesPage: async ({ page }, use) => {
    const servicesPage = new ServicesPage(page);
    await use(servicesPage);
  },
  caseStudiesPage: async ({ page }, use) => {
    const caseStudiesPage = new CaseStudiesPage(page);
    await use(caseStudiesPage);
  },
  contactPage: async ({ page }, use) => {
    const contactPage = new ContactPage(page);
    await use(contactPage);
  },
  pricingPage: async ({ page }, use) => {
    const pricingPage = new PricingPage(page);
    await use(pricingPage);
  },
  cartPage: async ({ page }, use) => {
    const cartPage = new CartPage(page);
    await use(cartPage);
  },
});

// Common viewport sizes for responsive testing
export const VIEWPORTS = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1280, height: 800 },
  largeDesktop: { width: 1920, height: 1080 },
};

// Common test data
export const TEST_DATA = {
  validContact: {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '1234567890',
    message: 'This is a test message with sufficient length for validation requirements.',
    service: 'Social Media',
  },
  invalidContact: {
    name: '',
    email: 'invalid-email',
    phone: '123',
    message: 'Short',
  },
  spanishContact: {
    name: 'Juan García',
    email: 'juan.garcia@ejemplo.com',
    phone: '5551234567',
    message: 'Este es un mensaje de prueba con longitud suficiente para los requisitos de validación.',
    service: 'Redes Sociales',
  },
};

// Test tags for categorization
export const TAGS = {
  smoke: '@smoke',
  regression: '@regression',
  accessibility: '@a11y',
  visual: '@visual',
  mobile: '@mobile',
  slow: '@slow',
};

export { expect };
