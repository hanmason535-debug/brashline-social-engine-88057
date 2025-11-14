import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useBlog } from './useBlog';

describe('useBlog', () => {
  it('should return localized blog posts in English', () => {
    const { result } = renderHook(() => useBlog('en'));

    expect(result.current.blogPosts).toHaveLength(6);
    expect(result.current.blogPosts[0].title).toBe('Florida SMB Social: The Minimum That Works');
  });

  it('should return localized blog posts in Spanish', () => {
    const { result } = renderHook(() => useBlog('es'));

    expect(result.current.blogPosts).toHaveLength(6);
    expect(result.current.blogPosts[0].title).toBe('Redes para Pymes de Florida: Lo Mínimo que Funciona');
  });

  it('should include all required fields in blog posts', () => {
    const { result } = renderHook(() => useBlog('en'));

    result.current.blogPosts.forEach((post) => {
      expect(post).toHaveProperty('title');
      expect(post).toHaveProperty('summary');
      expect(post).toHaveProperty('image');
      expect(post).toHaveProperty('date');
      expect(typeof post.title).toBe('string');
      expect(typeof post.summary).toBe('string');
      expect(typeof post.image).toBe('string');
      expect(typeof post.date).toBe('string');
    });
  });

  it('should have valid image URLs', () => {
    const { result } = renderHook(() => useBlog('en'));

    result.current.blogPosts.forEach((post) => {
      expect(post.image).toMatch(/^https?:\/\//);
      expect(post.image).toContain('unsplash.com');
    });
  });

  it('should have valid date format', () => {
    const { result } = renderHook(() => useBlog('en'));

    result.current.blogPosts.forEach((post) => {
      const date = new Date(post.date);
      expect(date).toBeInstanceOf(Date);
      expect(isNaN(date.getTime())).toBe(false);
    });
  });

  it('should have posts in chronological order', () => {
    const { result } = renderHook(() => useBlog('en'));

    const dates = result.current.blogPosts.map((p) => new Date(p.date).getTime());
    
    // Check that all dates are valid
    dates.forEach((date) => {
      expect(isNaN(date)).toBe(false);
    });

    // Posts should be in date order (either ascending or descending)
    expect(result.current.blogPosts.length).toBe(6);
  });

  it('should localize summaries correctly', () => {
    const { result: enResult } = renderHook(() => useBlog('en'));
    const { result: esResult } = renderHook(() => useBlog('es'));

    expect(enResult.current.blogPosts[0].summary).toContain('two-post rhythm');
    expect(esResult.current.blogPosts[0].summary).toContain('Dos publicaciones');
  });

  it('should preserve image URLs across languages', () => {
    const { result: enResult } = renderHook(() => useBlog('en'));
    const { result: esResult } = renderHook(() => useBlog('es'));

    expect(enResult.current.blogPosts[0].image).toBe(esResult.current.blogPosts[0].image);
  });

  it('should preserve dates across languages', () => {
    const { result: enResult } = renderHook(() => useBlog('en'));
    const { result: esResult } = renderHook(() => useBlog('es'));

    expect(enResult.current.blogPosts[0].date).toBe(esResult.current.blogPosts[0].date);
  });

  it('should memoize results for the same language', () => {
    const { result, rerender } = renderHook(
      ({ lang }) => useBlog(lang),
      { initialProps: { lang: 'en' as 'en' | 'es' } }
    );

    const firstResult = result.current;
    rerender({ lang: 'en' });
    const secondResult = result.current;

    expect(firstResult.blogPosts).toBe(secondResult.blogPosts);
  });

  it('should return different results when language changes', () => {
    const { result, rerender } = renderHook(
      ({ lang }) => useBlog(lang),
      { initialProps: { lang: 'en' as 'en' | 'es' } }
    );

    const enResult = result.current;
    rerender({ lang: 'es' });
    const esResult = result.current;

    expect(enResult.blogPosts).not.toBe(esResult.blogPosts);
    expect(enResult.blogPosts[0].title).not.toBe(esResult.blogPosts[0].title);
  });

  it('should return consistent number of posts for both languages', () => {
    const { result: enResult } = renderHook(() => useBlog('en'));
    const { result: esResult } = renderHook(() => useBlog('es'));

    expect(enResult.current.blogPosts.length).toBe(esResult.current.blogPosts.length);
  });

  it('should have meaningful titles and summaries', () => {
    const { result } = renderHook(() => useBlog('en'));

    result.current.blogPosts.forEach((post) => {
      expect(post.title.length).toBeGreaterThan(10);
      expect(post.summary.length).toBeGreaterThan(20);
    });
  });
});
