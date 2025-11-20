/**
 * File overview: src/types/about.types.ts
 *
 * Shared TypeScript type definitions for this feature area.
 * Behavior:
 * - Documents the shape of domain data and narrows allowable values at compile time.
 * Assumptions:
 * - Runtime data is normalized to match these shapes before reaching UI components.
 */
import { LocalizedContent } from "./service.types";
import { LucideIcon } from "lucide-react";

export interface ValueCard {
  icon: LucideIcon;
  title: LocalizedContent;
  description: LocalizedContent;
}

export interface LocalizedValueCard extends Omit<ValueCard, "title" | "description"> {
  title: string;
  description: string;
}
