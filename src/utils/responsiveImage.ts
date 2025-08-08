import type { ImageMetadata } from "astro";
import { getImage } from "astro:assets";

/**
 * Responsive Image Generation System
 *
 * This system generates optimized image variants by combining:
 * 1. BREAKPOINTS: Fixed widths (420px, 720px, 1200px) for which we generate actual image files
 * 2. SIZE_PRESETS: Responsive sizing rules that tell the browser which image to use at different viewport sizes
 *
 * How it works:
 * - For each image, we generate up to 3 variants at the BREAKPOINT widths (if image is large enough)
 * - The SIZE_PRESET determines the "sizes" attribute, telling the browser how much space the image will occupy
 * - The browser then selects the most appropriate variant based on viewport width and display density
 *
 * Example for "grid" preset with a 1600px wide image:
 * - Generated files: 420w, 720w, 1200w variants
 * - Sizes rule: "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
 * - Result: On mobile (<640px), image takes 50% viewport width, browser picks 420w variant
 *           On tablet (<1024px), image takes 33% viewport width, browser picks 420w or 720w
 *           On desktop, image takes 25% viewport width, browser picks 420w, 720w, or 1200w
 */

// Simple, fixed breakpoints that cover most use cases
const BREAKPOINTS = [420, 720, 1200];

// Cache for memoization
const imageCache = new Map<string, ResponsiveImageData>();

export interface ResponsiveImageData {
  src: string; // Fallback image
  srcSet: string; // All size variants
  sizes: string; // Responsive sizes
}

// Preset size configurations
export type SizePreset = "grid" | "container" | "lightbox";

const SIZE_PRESETS: Record<SizePreset, string> = {
  grid: "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw", // For thumbnails in grid layouts
  container: "(max-width: 768px) 100vw, 50vw", // For full-width content images
  lightbox: "100vw", // For expanded/modal gallery images
};

/**
 * Creates a cache key based on image metadata and preset
 */
function createCacheKey(image: ImageMetadata, preset: SizePreset): string {
  // Use the image source path and preset to create a unique key
  const imagePath = image.src || String(image);
  return `${imagePath}:${preset}`;
}

export async function generateResponsiveImage(
  image: ImageMetadata,
  preset: SizePreset = "lightbox",
): Promise<ResponsiveImageData> {
  // Check cache first
  const cacheKey = createCacheKey(image, preset);
  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey)!;
  }

  // Get the sizes string from the preset
  const sizes = SIZE_PRESETS[preset];

  // Only use breakpoints smaller than or equal to original image
  const widths = BREAKPOINTS.filter((w) => w <= image.width);

  // If no valid widths, use the original width
  if (widths.length === 0) {
    widths.push(image.width);
  }

  // Generate all variants
  const variants = await Promise.all(
    widths.map(async (width) => {
      const optimized = await getImage({
        src: image,
        width,
        format: "webp",
        quality: 80,
      });
      // Use the width we requested, not from the response
      return `${optimized.src} ${width}w`;
    }),
  );

  const result = {
    src: variants[variants.length - 1], // fallback for old browsers
    srcSet: variants.join(", "),
    sizes,
  };

  // Cache the result
  imageCache.set(cacheKey, result);

  return result;
}
