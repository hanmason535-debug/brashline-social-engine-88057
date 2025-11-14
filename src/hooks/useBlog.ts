import { useMemo } from 'react';
import { BLOG_POSTS } from '@/data/blog.data';
import { LocalizedBlogPost } from '@/types/blog.types';

export const useBlog = (lang: 'en' | 'es') => {
  const localizedBlogPosts = useMemo<LocalizedBlogPost[]>(
    () =>
      BLOG_POSTS.map((post) => ({
        ...post,
        title: post.title[lang],
        summary: post.summary[lang],
      })),
    [lang]
  );

  return {
    blogPosts: localizedBlogPosts,
  };
};
