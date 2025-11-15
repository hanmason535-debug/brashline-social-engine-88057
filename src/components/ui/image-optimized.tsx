/**
 * File overview: src/components/ui/image-optimized.tsx
 *
 * React component `image-optimized` rendering a focused piece of UI.
 * Behavior:
 * - Receives props from parents and may read from hooks or context.
 * - Renders presentational markup and wires callbacks for user interaction.
 * Data flow:
 * - Follows a one-way data flow: parents own data, this component focuses on display.
 * Performance:
 * - Avoid expensive work during render and prefer memoized helpers for heavy subtrees.
 */
import { ImgHTMLAttributes, useState } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'sizes'> {
  /**
   * Base image name (without extension). E.g., "logo" will generate:
   * - logo.webp (primary)
   * - logo.png (fallback)
   */
  imageName: string;
  /**
   * Size in pixels for which the image is optimized (used in srcset).
   * E.g., 80 will generate sizes for 80px, 160px (2x), etc.
   */
  baseSize?: number;
  /**
   * Additional responsive sizes (e.g., [40, 60, 80, 120] for multiple breakpoints).
   */
  responsiveSizes?: number[];
  /**
   * Fallback src if WebP and primary format fail (e.g., "/logo.svg").
   */
  fallbackSrc?: string;
}

/**
 * OptimizedImage component with WebP support, srcset, and automatic fallbacks.
 * 
 * Usage:
 * ```tsx
 * <OptimizedImage
 *   imageName="logo"
 *   baseSize={80}
 *   alt="Brashline Logo"
 *   className="h-20 w-auto"
 * />
 * ```
 */
export const OptimizedImage = ({
  imageName,
  baseSize = 80,
  responsiveSizes,
  fallbackSrc,
  alt = '',
  className,
  onError: onErrorProp,
  ...props
}: OptimizedImageProps) => {
  const [imageError, setImageError] = useState(false);
  const [isWebPSupported, setIsWebPSupported] = useState(true);

  const sizes = responsiveSizes || [baseSize, baseSize * 1.5, baseSize * 2];

  // Generate srcset for WebP
  const webpSrcSet = sizes
    .map((size) => `/images/${imageName}-${size}w.webp ${size}w`)
    .join(', ');

  // Generate srcset for PNG fallback
  const pngSrcSet = sizes
    .map((size) => `/images/${imageName}-${size}w.png ${size}w`)
    .join(', ');

  // Generate sizes attribute (CSS media query for responsive loading)
  const sizesAttr = `(max-width: 640px) ${Math.min(...sizes)}px, (max-width: 1024px) ${sizes[Math.floor(sizes.length / 2)]}px, ${sizes[sizes.length - 1]}px`;

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.currentTarget as HTMLImageElement;
    const src = img.src || img.currentSrc || '';

    // Attempt fallback hierarchy: WebP → PNG → SVG fallback
    if (isWebPSupported && src.includes('.webp')) {
      // Try PNG next
      setIsWebPSupported(false);
      img.srcset = pngSrcSet;
      img.src = `/images/${imageName}-${baseSize}w.png`;
    } else if (!src.includes('.svg') && fallbackSrc) {
      // Use provided SVG fallback
      img.src = fallbackSrc;
      setImageError(true);
    }

    onErrorProp?.(e);
  };

  // Start with WebP; browser will request appropriate size from srcset
  return (
    <img
      {...props}
      alt={alt}
      srcSet={isWebPSupported && !imageError ? webpSrcSet : pngSrcSet}
      src={
        isWebPSupported && !imageError
          ? `/images/${imageName}-${baseSize}w.webp`
          : imageError && fallbackSrc
            ? fallbackSrc
            : `/images/${imageName}-${baseSize}w.png`
      }
      sizes={sizesAttr}
      onError={handleError}
      className={cn('transition-opacity duration-300', className)}
      loading="lazy"
    />
  );
};

export default OptimizedImage;
