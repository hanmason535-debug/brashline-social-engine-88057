import { LocalizedContent } from './service.types';
import { LucideIcon } from 'lucide-react';

export interface ValueCard {
  icon: LucideIcon;
  title: LocalizedContent;
  description: LocalizedContent;
}

export interface LocalizedValueCard extends Omit<ValueCard, 'title' | 'description'> {
  title: string;
  description: string;
}
