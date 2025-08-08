import type { ImageMetadata } from "astro";

import { safeGetImage } from "@/utils/imageOptimization";

// Simple, fixed breakpoints that cover most use cases
const BREAKPOINTS = [320, 640, 1080, 1600];

export interface ResponsiveImageData {
  src: string; // Fallback image
  srcSet: string; // All size variants
  sizes: string; // Responsive sizes
}

/**
 * Generate responsive image data at build time
 * Keep it simple - no placeholders, no complex logic
 */
export async function generateResponsiveImage(
  image: ImageMetadata,
  sizes: string = "100vw",
): Promise<ResponsiveImageData> {
  // Only use breakpoints smaller than or equal to original image
  const widths = BREAKPOINTS.filter((w) => w <= image.width);

  // If no valid widths, use the original width
  if (widths.length === 0) {
    widths.push(image.width);
  }

  // Generate all variants
  const variants = await Promise.all(
    widths.map(async (width) => {
      const optimized = await safeGetImage({
        src: image,
        width,
        format: "webp",
        quality: 80,
      });
      // Use the width we requested, not from the response
      return `${optimized.src} ${width}w`;
    }),
  );

  // Generate fallback at 1080px or original width
  const fallbackWidth = Math.min(1080, image.width);
  const fallback = await safeGetImage({
    src: image,
    width: fallbackWidth,
    format: "webp",
    quality: 80,
  });

  return {
    src: fallback.src,
    srcSet: variants.join(", "),
    sizes,
  };
}
