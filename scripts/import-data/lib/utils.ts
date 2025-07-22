import fs from "node:fs/promises";
import path from "node:path";
import { existsSync } from "node:fs";
import { PUBLIC_BASE } from "./constants";
import { logger } from "./logger";
import type { ImportStatistics } from "./statistics";

const IMAGE_CACHE = new Map<string, Buffer>();

export async function downloadImage(url: string, localPath: string): Promise<boolean> {
  const fullUrl = url.startsWith("http") ? url : `${PUBLIC_BASE}${url}`;

  try {
    // Check if image already exists locally
    if (existsSync(localPath)) {
      const stats = await fs.stat(localPath);
      if (stats.size > 0) {
        // Valid image already exists
        return false; // Image was unchanged
      }
    }

    // Check memory cache first
    let imageBuffer = IMAGE_CACHE.get(fullUrl);

    if (!imageBuffer) {
      // Download image
      const response = await fetch(fullUrl);
      if (!response.ok) {
        throw new Error(`Failed to download: ${response.status} ${response.statusText}`);
      }
      imageBuffer = Buffer.from(await response.arrayBuffer());

      // Cache for future use in this run
      IMAGE_CACHE.set(fullUrl, imageBuffer);
    }

    // Ensure directory exists
    await fs.mkdir(path.dirname(localPath), { recursive: true });

    // Write image to disk
    await fs.writeFile(localPath, imageBuffer);
    return true; // Image was downloaded
  } catch (err) {
    logger.error(`Failed to download image ${fullUrl} to ${localPath}:`, err);
    throw err;
  }
}

export function calculateImageStats(
  existingCount: number,
  downloadedCount: number,
  stats: ImportStatistics,
): void {
  if (existingCount > 0) {
    stats.galleryImagesUnchanged += existingCount;
  }
  if (downloadedCount > 0) {
    stats.galleryImagesDownloaded += downloadedCount;
  }
}
