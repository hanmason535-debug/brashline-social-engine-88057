/**
 * File overview: src/components/ui/card-skeleton.tsx
 *
 * React component `card-skeleton` rendering a focused piece of UI.
 * Behavior:
 * - Receives props from parents and may read from hooks or context.
 * - Renders presentational markup and wires callbacks for user interaction.
 * Data flow:
 * - Follows a one-way data flow: parents own data, this component focuses on display.
 * Performance:
 * - Avoid expensive work during render and prefer memoized helpers for heavy subtrees.
 */
import { Skeleton } from './skeleton';
import { Card, CardContent, CardFooter, CardHeader } from './card';

export const PricingCardSkeleton = () => (
  <Card className="flex flex-col">
    <CardHeader className="text-center pb-8">
      <Skeleton className="h-6 w-24 mx-auto mb-4" />
      <Skeleton className="h-8 w-32 mx-auto mb-2" />
      <Skeleton className="h-4 w-48 mx-auto mb-4" />
      <Skeleton className="h-10 w-28 mx-auto mb-2" />
      <Skeleton className="h-3 w-36 mx-auto" />
    </CardHeader>
    <CardContent className="space-y-3 flex-1">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-start gap-3">
          <Skeleton className="h-4 w-4 rounded-full flex-shrink-0 mt-0.5" />
          <Skeleton className="h-4 flex-1" />
        </div>
      ))}
    </CardContent>
    <CardFooter className="pt-6">
      <Skeleton className="h-10 w-full" />
    </CardFooter>
  </Card>
);

export const BlogCardSkeleton = () => (
  <Card className="overflow-hidden">
    <Skeleton className="h-48 w-full" />
    <CardContent className="p-6">
      <Skeleton className="h-4 w-24 mb-4" />
      <Skeleton className="h-6 w-full mb-3" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-3/4" />
    </CardContent>
  </Card>
);

export const ServiceCardSkeleton = () => (
  <Card>
    <CardContent className="p-8">
      <Skeleton className="h-14 w-14 rounded-full mb-6" />
      <Skeleton className="h-6 w-3/4 mb-4" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-5/6" />
    </CardContent>
  </Card>
);

export const ValuePropSkeleton = () => (
  <Card>
    <CardContent className="p-8 text-center">
      <Skeleton className="h-16 w-16 rounded-full mx-auto mb-6" />
      <Skeleton className="h-6 w-2/3 mx-auto mb-4" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-4/5 mx-auto" />
    </CardContent>
  </Card>
);
