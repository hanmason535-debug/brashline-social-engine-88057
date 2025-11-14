import { useMemo } from 'react';
import { VALUE_CARDS, ABOUT_CONTENT } from '@/data/about.data';
import { LocalizedValueCard } from '@/types/about.types';

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
