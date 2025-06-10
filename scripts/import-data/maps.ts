import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
// @ts-ignore
import osmStaticMaps from "osm-static-maps";
import { getMapProviderConfig, type ProviderKey } from "./map-providers";
import { logger } from "./logger";

// Set the chosen provider here
const CHOSEN_PROVIDER: ProviderKey = "stadiaWaterColor";

export interface MapOptions {
  lat: number;
  lng: number;
  width?: number;
  height?: number;
  zoom?: number;
  overwrite?: boolean;
}

export async function generateStaticMap(outputPath: string, options: MapOptions): Promise<boolean> {
  const { lat, lng, width = 1024, height = 1024, zoom = 15, overwrite = false } = options;

  // Check if map already exists and overwrite is not enabled
  if (existsSync(outputPath) && !overwrite) {
    return false; // Map already generated
  }

  try {
    // Get provider configuration with validation
    const provider = getMapProviderConfig(CHOSEN_PROVIDER);

    // Create map options for osm-static-maps
    const mapOptions = {
      // No geojson to avoid any default markers
      center: `${lng},${lat}`,
      zoom,
      width,
      height,
      tileserverUrl: provider.url,
      attribution: provider.attribution,
      type: "jpeg" as const,
      quality: 90,
      // Marker removed - will be added in DOM with Lucide icon
    };

    // Generate the map
    const imageBuffer = await osmStaticMaps(mapOptions);

    // Ensure directory exists
    await fs.mkdir(path.dirname(outputPath), { recursive: true });

    // Write the image
    await fs.writeFile(outputPath, imageBuffer);

    logger.success(`Generated map → ${outputPath}`);
    return true;
  } catch (error) {
    logger.error(`Failed to generate map for ${outputPath}:`, error);
    return false;
  }
}
