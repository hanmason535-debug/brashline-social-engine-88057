/**
 * File overview: src/hooks/useBlog.ts
 *
 * Custom React hook `useBlog` encapsulating reusable view logic.
 * Inputs:
 * - Parameters passed to the hook and ambient browser/app state.
 * Outputs:
 * - A stable API of state and callbacks for components to consume.
 * Side effects:
 * - Uses React effects where needed and is responsible for its own cleanup.
 * Performance:
 * - Designed so calling components can avoid duplicating logic and re-renders.
 */
import { useMemo } from "react";
import { BLOG_POSTS } from "@/data/blog.data";
import { LocalizedBlogPost } from "@/types/blog.types";

// Hook: returns localized blog post metadata for the current language.
// Inputs: language code used to pick localized fields from static data.
// Output: memoized array of posts with translated titles and summaries.
// Performance: memoizes mapping over static data to avoid recomputing on every render.
export const useBlog = (lang: "en" | "es") => {
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
