/**
 * File overview: src/hooks/useServices.ts
 *
 * Custom React hook `useServices` encapsulating reusable view logic.
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
import { SERVICES_DATA } from '@/data/services.data';
import type { LocalizedService } from '@/types/service.types';

// Hook: returns localized service definitions derived from static data.
// Inputs: current language code.
// Output: memoized list of view-ready services, including original labels for debugging and analytics.
// Performance: memoizes mapping so service sections re-render only when the language changes.
export const useServices = (lang: 'en' | 'es'): LocalizedService[] => {
  return useMemo(
    () =>
      SERVICES_DATA.map((service) => ({
        ...service,
        title: service.title[lang],
        description: service.description[lang],
        originalTitle: service.title,
        originalDescription: service.description,
      })),
    [lang]
  );
};
