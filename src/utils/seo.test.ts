import { describe, it, expect } from 'vitest';
import {
  SEO_CONFIG,
  getPageSEO,
  formatTitle,
  generateLocalBusinessSchema,
  generateOrganizationSchema,
} from './seo';

describe('SEO Utils', () => {
  describe('getPageSEO', () => {
    it('should return the correct SEO data for a known page', () => {
      const homeSEO = getPageSEO('home');
      expect(homeSEO.title).toBe('Brashline | Social Media Management for Florida Businesses');
      expect(homeSEO.canonical).toBe(SEO_CONFIG.siteUrl);
    });

    it('should return default SEO data for an unknown page', () => {
      const unknownSEO = getPageSEO('non-existent-page');
      expect(unknownSEO.title).toBe(SEO_CONFIG.defaultTitle);
      expect(unknownSEO.description).toBe(SEO_CONFIG.defaultDescription);
    });

    it('should return the correct canonical URL for a known page', () => {
      const servicesSEO = getPageSEO('services');
      expect(servicesSEO.canonical).toBe(`${SEO_CONFIG.siteUrl}/services`);
    });

    it('should handle noindex pages correctly', () => {
      const privacySEO = getPageSEO('privacy');
      expect(privacySEO.noindex).toBe(true);
    });
  });

  describe('formatTitle', () => {
    it('should return the default title if no title is provided', () => {
      expect(formatTitle()).toBe(SEO_CONFIG.defaultTitle);
    });

    it('should append the site name to the title', () => {
      expect(formatTitle('About Us')).toBe(`About Us | ${SEO_CONFIG.siteName}`);
    });

    it('should not append the site name if it is already present (case-insensitive)', () => {
      const title = `Our Blog | ${SEO_CONFIG.siteName}`;
      expect(formatTitle(title)).toBe(title);
      expect(formatTitle(`Our Blog | ${SEO_CONFIG.siteName.toLowerCase()}`)).toBe(`Our Blog | ${SEO_CONFIG.siteName.toLowerCase()}`);
    });
  });

  describe('generateLocalBusinessSchema', () => {
    it('should return the correct LocalBusiness JSON-LD schema', () => {
      const schema = generateLocalBusinessSchema();
      expect(schema['@type']).toBe('LocalBusiness');
      expect(schema.name).toBe(SEO_CONFIG.business.name);
      expect(schema.address['@type']).toBe('PostalAddress');
      expect(schema.sameAs).toContain(SEO_CONFIG.social.facebook);
    });
  });

  describe('generateOrganizationSchema', () => {
    it('should return the correct Organization JSON-LD schema', () => {
      const schema = generateOrganizationSchema();
      expect(schema['@type']).toBe('Organization');
      expect(schema.name).toBe(SEO_CONFIG.business.name);
      expect(schema.url).toBe(SEO_CONFIG.siteUrl);
      expect(schema.logo).toBe(`${SEO_CONFIG.siteUrl}/logo.png`);
    });
  });
});
