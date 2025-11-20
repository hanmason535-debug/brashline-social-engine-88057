/**
 * File overview: src/hooks/useEmblaCarousel.tsx
 *
 * Custom React hook `useEmblaCarousel` encapsulating reusable view logic.
 * Inputs:
 * - Parameters passed to the hook and ambient browser/app state.
 * Outputs:
 * - A stable API of state and callbacks for components to consume.
 * Side effects:
 * - Uses React effects where needed and is responsible for its own cleanup.
 * Performance:
 * - Designed so calling components can avoid duplicating logic and re-renders.
 */
import { useEffect } from "react";
import type { EmblaCarouselType } from "embla-carousel";

// Hook: decorates an Embla carousel instance with cursor and haptic feedback behavior.
// Inputs: an EmblaCarousel API instance created by the carousel component.
// Output: the same API instance, enhanced with event listeners for UX polish.
// Performance: attaches lightweight event handlers without adding extra React renders.
export const useEnhancedCarousel = (emblaApi: EmblaCarouselType | undefined) => {
  useEffect(() => {
    if (!emblaApi) return;

    // On init, set cursor styles so drag affordance feels explicit.
    emblaApi.on("init", () => {
      const viewport = emblaApi.rootNode();
      if (viewport) {
        viewport.style.cursor = "grab";
      }
    });

    // Toggle cursor while dragging to reinforce interactivity.
    emblaApi.on("pointerDown", () => {
      const viewport = emblaApi.rootNode();
      if (viewport) {
        viewport.style.cursor = "grabbing";
      }
    });

    emblaApi.on("pointerUp", () => {
      const viewport = emblaApi.rootNode();
      if (viewport) {
        viewport.style.cursor = "grab";
      }
    });

    // Provide a subtle haptic tick on slide change for capable devices.
    emblaApi.on("select", () => {
      if ("vibrate" in navigator) {
        navigator.vibrate(10);
      }
    });
  }, [emblaApi]);

  return emblaApi;
};
