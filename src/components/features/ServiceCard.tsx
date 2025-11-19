/**
 * ServiceCard Component
 * Reusable, memoized service card component
 */
/**
 * File overview: src/components/features/ServiceCard.tsx
 *
 * React component `ServiceCard` rendering a focused piece of UI.
 * Behavior:
 * - Receives props from parents and may read from hooks or context.
 * - Renders presentational markup and wires callbacks for user interaction.
 * Data flow:
 * - Follows a one-way data flow: parents own data, this component focuses on display.
 * Performance:
 * - Avoid expensive work during render and prefer memoized helpers for heavy subtrees.
 */

import { memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CARD_PADDING } from '@/config/design-tokens';
import { cn } from '@/lib/utils';
import type { ServiceCardProps } from '@/types/service.types';

export const ServiceCard = memo(({ service, index, isVisible }: ServiceCardProps) => {
  const Icon = service.icon;
  
  return (
    <Card
      className={cn(
        'shadow-soft hover:shadow-medium transition-all duration-700 hover:-translate-y-1',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      )}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <CardContent className={CARD_PADDING}>
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-muted mb-6">
          <Icon className="h-7 w-7 text-foreground" />
        </div>
        <h2 className="text-xl font-heading font-semibold mb-4">{service.title}</h2>
        <p className="text-muted-foreground leading-relaxed">{service.description}</p>
      </CardContent>
    </Card>
  );
}, (prevProps, nextProps) => {
  // Custom comparison - only re-render if these change
  return (
    prevProps.service.id === nextProps.service.id &&
    prevProps.isVisible === nextProps.isVisible &&
    prevProps.service.title === nextProps.service.title &&
    prevProps.service.description === nextProps.service.description
  );
});

ServiceCard.displayName = 'ServiceCard';
