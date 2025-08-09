// responsive-images.ts
import type { ImageMetadata } from "astro";
import { getImage } from "astro:assets";

/**
 * Responsive Image Generation System
 *
 * Generates optimized image variants by combining:
 * 1) BREAKPOINTS → actual output file widths (px)
 * 2) SIZE_PRESETS → the <img sizes="..."> rule that tells the browser how wide
 *    the image will render at different viewport widths
 *
 * Notes:
 * - BREAKPOINTS control which *files* we create (e.g. 420w.webp, 720w.webp, 1200w.webp)
 * - SIZE_PRESETS control how large the image *appears* in layout (e.g. 100vw, 50vw, 20vw)
 * - The browser picks the tightest srcset candidate based on `sizes` + device DPR
 */

// Simple, fixed breakpoints that cover most use cases
export const BREAKPOINTS = [420, 720, 1200] as const;

// Cache for memoization
const imageCache = new Map<string, ResponsiveImageData>();

export interface ResponsiveImageData {
  src: string; // Fallback image URL (largest variant)
  srcSet: string; // e.g. "img-420.webp 420w, img-720.webp 720w, img-1200.webp 1200w"
  sizes: string; // e.g. "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw, 100vw"
}

export type SizePreset = "grid" | "container" | "lightbox";

// Build a gap-aware sizes string
const GRID_SIZES = [
  "(max-width: 640px) 100vw", // phones
  "(max-width: 1024px) 50vw", // tablets
  "(min-width: 1025px) 20vw", // desktop
  "100vw", // fallback
].join(", ");

export const SIZE_PRESETS: Record<SizePreset, string> = {
  grid: GRID_SIZES,
  container: "100vw", // full-bleed content images
  lightbox: "100vw", // expanded/modal images
};

/**
 * Creates a cache key based on image metadata and preset
 */
function createCacheKey(image: ImageMetadata, preset: SizePreset): string {
  // Use the image source path and preset to create a unique key
  const imagePath = (image as any).src || String(image);
  return `${imagePath}:${preset}`;
}

/**
 * Generate responsive image data for an Astro ImageMetadata input and a size preset.
 *
 * - Uses BREAKPOINTS, capped to the original image width
 * - Produces WebP variants at quality 80
 * - Returns { src, srcSet, sizes } ready to spread onto <img>
 */
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

  // Only use breakpoints smaller than or equal to original image width
  const widths = BREAKPOINTS.filter((w) => w <= image.width);

  // If no valid widths, use the original width
  const candidateWidths = widths.length > 0 ? widths : [image.width];

  // Generate all variants
  const variants = await Promise.all(
    candidateWidths.map(async (width) => {
      const optimized = await getImage({
        src: image,
        width,
        format: "webp",
        quality: 80,
      });
      return { url: optimized.src, width };
    }),
  );

  // Largest variant (last in array) → sensible fallback `src`
  const largest = variants[variants.length - 1];

  const result: ResponsiveImageData = {
    src: largest.url, // URL only (not "url 1200w")
    srcSet: variants.map((v) => `${v.url} ${v.width}w`).join(", "),
    sizes,
  };

  // Cache the result
  imageCache.set(cacheKey, result);

  return result;
}
