/**
 * useServices Hook
 * Returns localized service data
 */

import { useMemo } from 'react';
import { SERVICES_DATA } from '@/data/services.data';
import type { LocalizedService } from '@/types/service.types';

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
