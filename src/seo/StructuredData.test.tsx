import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter } from 'react-router-dom';

// Unmock StructuredData for these tests
vi.unmock('@/seo/StructuredData');

import StructuredData from '@/seo/StructuredData';
import { 
  generateLocalBusinessSchema, 
  generateOrganizationSchema, 
  generateFAQPageSchema 
} from '@/seo/seo';
import { faqs } from '@/data/pricing.data';

describe('StructuredData', () => {
  it('should render without errors on home page', () => {
    const { container } = render(
      <HelmetProvider>
        <MemoryRouter initialEntries={['/']}>
          <StructuredData />
        </MemoryRouter>
      </HelmetProvider>
    );

    expect(container).toBeTruthy();
  });

  it('should render without errors on pricing page', () => {
    const { container } = render(
      <HelmetProvider>
        <MemoryRouter initialEntries={['/pricing']}>
          <StructuredData />
        </MemoryRouter>
      </HelmetProvider>
    );

    expect(container).toBeTruthy();
  });

  it('should generate valid LocalBusiness schema', () => {
    const schema = generateLocalBusinessSchema();
    
    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('LocalBusiness');
    expect(schema.name).toBe('Brashline');
    expect(schema.telephone).toBeDefined();
    expect(schema.address).toBeDefined();
    expect(schema.geo).toBeDefined();
  });

  it('should generate valid Organization schema', () => {
    const schema = generateOrganizationSchema();
    
    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('Organization');
    expect(schema.name).toBe('Brashline');
    expect(schema.url).toBeDefined();
    expect(schema.contactPoint).toBeDefined();
  });

  it('should generate valid FAQPage schema with data', () => {
    const schema = generateFAQPageSchema(faqs);
    
    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('FAQPage');
    expect(schema.mainEntity).toBeDefined();
    expect(Array.isArray(schema.mainEntity)).toBe(true);
    expect(schema.mainEntity.length).toBeGreaterThan(0);
    expect(schema.mainEntity[0]['@type']).toBe('Question');
  });
});
