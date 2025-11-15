/**
 * File overview: src/hooks/useAbout.ts
 *
 * Custom React hook `useAbout` encapsulating reusable view logic.
 * Inputs:
 * - Parameters passed to the hook and ambient browser/app state.
 * Outputs:
 * - A stable API of state and callbacks for components to consume.
 * Side effects:
 * - Uses React effects where needed and is responsible for its own cleanup.
 * Performance:
 * - Designed so calling components can avoid duplicating logic and re-renders.
 */
import { useMemo } from 'react';
import { VALUE_CARDS, ABOUT_CONTENT } from '@/data/about.data';
import { LocalizedValueCard } from '@/types/about.types';

// Hook: derives localized About page content from static data modules.
// Inputs: current language code.
// Output: memoized value cards and structured copy for hero and story sections.
// Performance: memoizes all derived structures so recomputation only occurs when the language changes.
export const useAbout = (lang: 'en' | 'es') => {
  const localizedValueCards = useMemo<LocalizedValueCard[]>(
    () =>
      VALUE_CARDS.map((card) => ({
        ...card,
        title: card.title[lang],
        description: card.description[lang],
      })),
    [lang]
  );

  const localizedContent = useMemo(
    () => ({
      hero: {
        title: ABOUT_CONTENT.hero.title[lang],
        subtitle: ABOUT_CONTENT.hero.subtitle[lang],
        description: ABOUT_CONTENT.hero.description[lang],
      },
      story: {
        title: ABOUT_CONTENT.story.title[lang],
        paragraphs: ABOUT_CONTENT.story.paragraphs.map((p) => p[lang]),
      },
    }),
    [lang]
  );

  return {
    valueCards: localizedValueCards,
    content: localizedContent,
  };
};
