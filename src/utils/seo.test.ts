/**
 * File overview: src/utils/seo.test.ts
 *
 * Test suite validating the public behavior of the associated module.
 * Behavior:
 * - Focuses on observable outputs and edge cases, not implementation details.
 * Assumptions:
 * - Serves as executable documentation for how callers are expected to use the API.
 */
import { describe, it, expect, vi } from "vitest";
import {
  SEO_CONFIG,
  getPageSEO,
  formatTitle,
  generateLocalBusinessSchema,
  generateOrganizationSchema,
  generateServicesSchemaList,
  generateBlogItemListSchema,
  logSEOAudit,
} from "./seo";

describe("SEO Utils", () => {
  describe("getPageSEO", () => {
    it("should return the correct SEO data for a known page", () => {
      const homeSEO = getPageSEO("home");
      expect(homeSEO.title).toBe("Brashline | Social Media Management for Florida Businesses");
      expect(homeSEO.canonical).toBe(SEO_CONFIG.siteUrl);
    });

    it("should return default SEO data for an unknown page", () => {
      const unknownSEO = getPageSEO("non-existent-page");
      expect(unknownSEO.title).toBe(SEO_CONFIG.defaultTitle);
      expect(unknownSEO.description).toBe(SEO_CONFIG.defaultDescription);
    });

    it("should return the correct canonical URL for a known page", () => {
      const servicesSEO = getPageSEO("services");
      expect(servicesSEO.canonical).toBe(`${SEO_CONFIG.siteUrl}/services`);
    });

    it("should handle noindex pages correctly", () => {
      const privacySEO = getPageSEO("privacy");
      expect(privacySEO.noindex).toBe(true);
    });
  });

  describe("formatTitle", () => {
    it("should return the default title if no title is provided", () => {
      expect(formatTitle()).toBe(SEO_CONFIG.defaultTitle);
    });

    it("should append the site name to the title", () => {
      expect(formatTitle("About Us")).toBe(`About Us | ${SEO_CONFIG.siteName}`);
    });

    it("should not append the site name if it is already present (case-insensitive)", () => {
      const title = `Our Blog | ${SEO_CONFIG.siteName}`;
      expect(formatTitle(title)).toBe(title);
      expect(formatTitle(`Our Blog | ${SEO_CONFIG.siteName.toLowerCase()}`)).toBe(
        `Our Blog | ${SEO_CONFIG.siteName.toLowerCase()}`
      );
    });
  });

  describe("generateLocalBusinessSchema", () => {
    it("should return the correct LocalBusiness JSON-LD schema", () => {
      const schema = generateLocalBusinessSchema();
      expect(schema["@type"]).toBe("LocalBusiness");
      expect(schema.name).toBe(SEO_CONFIG.business.name);
      expect(schema.address["@type"]).toBe("PostalAddress");
      expect(schema.sameAs).toContain(SEO_CONFIG.social.facebook);
    });
  });

  describe("generateOrganizationSchema", () => {
    it("should return the correct Organization JSON-LD schema", () => {
      const schema = generateOrganizationSchema();
      expect(schema["@type"]).toBe("Organization");
      expect(schema.name).toBe(SEO_CONFIG.business.name);
      expect(schema.url).toBe(SEO_CONFIG.siteUrl);
      expect(schema.logo).toBe(`${SEO_CONFIG.siteUrl}/logo.png`);
    });
  });

  describe("generateServicesSchemaList", () => {
    it("should map services to an ItemList with Service items", () => {
      const services = [
        { id: "s1", title: { en: "A", es: "A" }, description: { en: "Ae", es: "Ae" } },
        { id: "s2", title: { en: "B", es: "B" }, description: { en: "Be", es: "Be" } },
      ];
      const schema = generateServicesSchemaList(services);
      expect(schema["@type"]).toBe("ItemList");
      expect(schema.itemListElement).toHaveLength(2);
      expect(schema.itemListElement[0].position).toBe(1);
      expect(schema.itemListElement[0].item["@type"]).toBe("Service");
      expect(schema.itemListElement[0].item.name).toBe("A");
    });
  });

  describe("generateBlogItemListSchema", () => {
    it("should map posts to an ItemList of BlogPosting", () => {
      const posts = [
        {
          title: { en: "T1", es: "T1" },
          summary: { en: "S1", es: "S1" },
          image: "/img.jpg",
          date: "2024-01-01",
        },
      ];
      const schema = generateBlogItemListSchema(posts);
      expect(schema["@type"]).toBe("ItemList");
      expect(schema.itemListElement[0].item["@type"]).toBe("BlogPosting");
      expect(schema.itemListElement[0].item.headline).toBe("T1");
    });
  });

  describe("logSEOAudit", () => {
    it("should log audit checklist in dev", () => {
      const group = vi.spyOn(console, "group").mockImplementation(() => undefined);
      const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
      const groupEnd = vi.spyOn(console, "groupEnd").mockImplementation(() => undefined);
      logSEOAudit();
      expect(group).toHaveBeenCalled();
      expect(log).toHaveBeenCalled();
      expect(groupEnd).toHaveBeenCalled();
      group.mockRestore();
      log.mockRestore();
      groupEnd.mockRestore();
    });
  });
});
