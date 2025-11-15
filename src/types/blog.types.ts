/**
 * File overview: src/types/blog.types.ts
 *
 * Shared TypeScript type definitions for this feature area.
 * Behavior:
 * - Documents the shape of domain data and narrows allowable values at compile time.
 * Assumptions:
 * - Runtime data is normalized to match these shapes before reaching UI components.
 */
import { LocalizedContent } from './service.types';

export interface BlogPost {
  title: LocalizedContent;
  summary: LocalizedContent;
  image: string;
  date: string;
}

export interface LocalizedBlogPost extends Omit<BlogPost, 'title' | 'summary'> {
  title: string;
  summary: string;
}
