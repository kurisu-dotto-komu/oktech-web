import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
// @ts-ignore
import osmStaticMaps from "osm-static-maps";
import { getMapProviderConfig, type ProviderKey } from "./map-providers";

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
  const { lat, lng, width = 1024, height = 1024, zoom = 16, overwrite = false } = options;

  // Check if map already exists and overwrite is not enabled
  if (existsSync(outputPath) && !overwrite) {
    return false; // Map already generated
  }

  try {
    // Get provider configuration with validation
    const provider = getMapProviderConfig(CHOSEN_PROVIDER);

    // Create map options for osm-static-maps
    const mapOptions = {
      geojson: {
        type: "Feature" as const,
        geometry: {
          type: "Point" as const,
          coordinates: [lng, lat],
        },
        properties: {},
      },
      center: `${lng},${lat}`,
      zoom,
      width,
      height,
      tileserverUrl: provider.url,
      attribution: provider.attribution,
      type: "png" as const,
      quality: 100,
      markerIconOptions: {
        iconUrl:
          "data:image/svg+xml;base64," +
          Buffer.from(
            `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="40" viewBox="-2 -2 28 40">
              <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 24 12 24s12-15 12-24C24 5.373 18.627 0 12 0z" 
                    fill="#ff6b6b" stroke="#ffffff" stroke-width="2"/>
              <circle cx="12" cy="12" r="6" fill="#ffffff"/>
            </svg>`,
          ).toString("base64"),
        iconSize: [28, 40].map((v) => v * 3),
        iconAnchor: [14, 40].map((v) => v * 3),
      },
    };

    // Generate the map
    const imageBuffer = await osmStaticMaps(mapOptions);

    // Ensure directory exists
    await fs.mkdir(path.dirname(outputPath), { recursive: true });

    // Write the image
    await fs.writeFile(outputPath, imageBuffer);

    console.log(`Generated map → ${outputPath}`);
    return true;
  } catch (error) {
    console.error(`Failed to generate map for ${outputPath}:`, error);
    return false;
  }
}
