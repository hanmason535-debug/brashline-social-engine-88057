import { useEffect } from 'react';
import type { EmblaCarouselType } from 'embla-carousel';

/**
 * Custom hook to enhance Embla Carousel with touch-friendly interactions
 */
export const useEnhancedCarousel = (emblaApi: EmblaCarouselType | undefined) => {
  useEffect(() => {
    if (!emblaApi) return;

    // Add smooth scroll behavior
    emblaApi.on('init', () => {
      const viewport = emblaApi.rootNode();
      if (viewport) {
        viewport.style.cursor = 'grab';
      }
    });

    // Change cursor on drag
    emblaApi.on('pointerDown', () => {
      const viewport = emblaApi.rootNode();
      if (viewport) {
        viewport.style.cursor = 'grabbing';
      }
    });

    emblaApi.on('pointerUp', () => {
      const viewport = emblaApi.rootNode();
      if (viewport) {
        viewport.style.cursor = 'grab';
      }
    });

    // Haptic feedback for mobile (if supported)
    emblaApi.on('select', () => {
      if ('vibrate' in navigator) {
        navigator.vibrate(10);
      }
    });
  }, [emblaApi]);

  return emblaApi;
};
