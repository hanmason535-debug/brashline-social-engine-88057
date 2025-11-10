import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates a responsive srcset string for images.
 * @param imageName - Base image name (e.g., "logo")
 * @param sizes - Array of pixel widths (e.g., [40, 80, 120])
 * @param format - Image format extension (e.g., "webp" or "png")
 * @returns srcset string suitable for img srcSet attribute
 */
export function generateSrcSet(
  imageName: string,
  sizes: number[],
  format: 'webp' | 'png' = 'webp'
): string {
  return sizes
    .map((size) => `/images/${imageName}-${size}w.${format} ${size}w`)
    .join(', ');
}

/**
 * Generates a sizes attribute for responsive image loading.
 * @param sizes - Array of pixel widths in ascending order
 * @returns sizes string suitable for img sizes attribute
 */
export function generateSizesAttribute(sizes: number[]): string {
  if (sizes.length === 0) return '100vw';
  if (sizes.length === 1) return `${sizes[0]}px`;

  const sortedSizes = [...sizes].sort((a, b) => a - b);
  const queries = [
    `(max-width: 640px) ${sortedSizes[0]}px`,
    `(max-width: 1024px) ${sortedSizes[Math.floor(sortedSizes.length / 2)]}px`,
    `${sortedSizes[sortedSizes.length - 1]}px`,
  ];
  return queries.join(', ');
}
