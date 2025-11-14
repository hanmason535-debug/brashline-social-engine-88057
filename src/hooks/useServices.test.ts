import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useServices } from './useServices';

describe('useServices', () => {
  it('should return localized services in English', () => {
    const { result } = renderHook(() => useServices('en'));

    expect(result.current).toHaveLength(9);
    expect(result.current[0]).toHaveProperty('id', 'social-media');
    expect(result.current[0]).toHaveProperty('title');
    expect(result.current[0].title).toBe('Social Media Management');
  });

  it('should return localized services in Spanish', () => {
    const { result } = renderHook(() => useServices('es'));

    expect(result.current).toHaveLength(9);
    expect(result.current[0]).toHaveProperty('id', 'social-media');
    expect(result.current[0]).toHaveProperty('title');
    expect(result.current[0].title).toBe('Gestión de Redes Sociales');
  });

  it('should include all required fields in localized services', () => {
    const { result } = renderHook(() => useServices('en'));

    result.current.forEach((service) => {
      expect(service).toHaveProperty('id');
      expect(service).toHaveProperty('icon');
      expect(service).toHaveProperty('title');
      expect(service).toHaveProperty('description');
      expect(service).toHaveProperty('category');
      expect(typeof service.title).toBe('string');
      expect(typeof service.description).toBe('string');
    });
  });

  it('should return consistent number of services for both languages', () => {
    const { result: enResult } = renderHook(() => useServices('en'));
    const { result: esResult } = renderHook(() => useServices('es'));

    expect(enResult.current.length).toBe(esResult.current.length);
  });

  it('should memoize results for the same language', () => {
    const { result, rerender } = renderHook(
      ({ lang }) => useServices(lang),
      { initialProps: { lang: 'en' as const } }
    );

    const firstResult = result.current;
    rerender({ lang: 'en' });
    const secondResult = result.current;

    expect(firstResult).toBe(secondResult);
  });

  it('should return different results when language changes', () => {
    const { result, rerender } = renderHook(
      ({ lang }) => useServices(lang),
      { initialProps: { lang: 'en' as 'en' | 'es' } }
    );

    const enTitle = result.current[0].title;
    rerender({ lang: 'es' });
    const esTitle = result.current[0].title;

    expect(enTitle).not.toBe(esTitle);
    expect(enTitle).toBe('Social Media Management');
    expect(esTitle).toBe('Gestión de Redes Sociales');
  });

  it('should include correct service categories', () => {
    const { result } = renderHook(() => useServices('en'));

    const categories = result.current.map((s) => s.category);
    expect(categories).toContain('marketing');
    expect(categories).toContain('development');
    expect(categories).toContain('design');
    expect(categories).toContain('analytics');
  });
});
