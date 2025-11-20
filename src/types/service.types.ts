/**
 * Service Types
 * Type definitions for service offerings
 */
/**
 * File overview: src/types/service.types.ts
 *
 * Shared TypeScript type definitions for this feature area.
 * Behavior:
 * - Documents the shape of domain data and narrows allowable values at compile time.
 * Assumptions:
 * - Runtime data is normalized to match these shapes before reaching UI components.
 */

import type { LucideIcon } from "lucide-react";

export interface LocalizedContent {
  en: string;
  es: string;
}

export interface Service {
  id: string;
  icon: LucideIcon;
  title: LocalizedContent;
  description: LocalizedContent;
  category?: "marketing" | "development" | "design" | "analytics";
  features?: string[];
}

export interface LocalizedService extends Omit<Service, "title" | "description"> {
  title: string;
  description: string;
  originalTitle: Service["title"];
  originalDescription: Service["description"];
}

export interface ServiceCardProps {
  service: LocalizedService;
  index: number;
  isVisible: boolean;
}
