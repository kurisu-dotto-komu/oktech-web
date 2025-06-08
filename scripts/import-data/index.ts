import fs from "node:fs/promises";
import path from "node:path";
import { existsSync } from "node:fs";
import slugify from "slugify";
import matter from "gray-matter";
import { stringify as yamlStringify } from "yaml";

import type { Event, EventJSON, Photo, PhotoJSON, Venue, EventsWithVenuesJSON } from "./types";
import {
  PUBLIC_BASE,
  EVENTS_BASE_DIR,
  VENUES_BASE_DIR,
  EVENTS_URL,
  PHOTOS_URL,
  INFER_EVENTS,
} from "./constants";
import { generateStaticMap } from "./maps";

// Global statistics object that will be mutated by helper functions throughout the import run
const stats = {
  markdownCreated: 0,
  markdownUpdated: 0,
  markdownUnchanged: 0,
  galleryImagesDownloaded: 0,
  galleryImagesUnchanged: 0,
  galleryImagesDeleted: 0,
  metadataCreated: 0,
  metadataUnchanged: 0,
  metadataNotApplicable: 0,
  totalEvents: 0,
  totalVenues: 0,
  venuesCreated: 0,
  venuesUpdated: 0,
  venuesUnchanged: 0,
  mapsGenerated: 0,
  mapsUnchanged: 0,
  mapsFailed: 0,
};

// Track unmatched cities for reporting
const unmatchedCities: Array<{ city: string; venueId: string; venueName: string }> = [];

async function downloadImage(remotePath: string, localPath: string): Promise<boolean> {
  if (existsSync(localPath)) {
    stats.galleryImagesUnchanged++;
    return false; // already downloaded
  }

  const res = await fetch(`${PUBLIC_BASE}${remotePath}`);
  if (!res.ok) throw new Error(`Failed to fetch ${remotePath}: ${res.status}`);
  const arrayBuf = await res.arrayBuffer();
  await fs.mkdir(path.dirname(localPath), { recursive: true });
  await fs.writeFile(localPath, new Uint8Array(arrayBuf));
  console.log(`Downloaded image → ${localPath}`);
  stats.galleryImagesDownloaded++;
  return true; // newly downloaded
}

async function processGallery(eventDir: string, photos: Photo[]) {
  const galleryDir = path.join(eventDir, "gallery");

  if (photos.length > 0) {
    await fs.mkdir(galleryDir, { recursive: true });

    for (const photo of photos) {
      const galleryImageFileName = path.basename(photo.file);
      const galleryImageLocalPath = path.join(galleryDir, galleryImageFileName);
      await downloadImage(photo.file, galleryImageLocalPath);
      if (photo.caption) {
        const yamlPath = `${galleryImageLocalPath}.yaml`;
        const yamlContent = yamlStringify(
          { caption: photo.caption },
          { lineWidth: 0, defaultKeyType: "PLAIN", defaultStringType: "QUOTE_DOUBLE" },
        );

        if (!existsSync(yamlPath)) {
          await fs.writeFile(yamlPath, yamlContent);
          stats.metadataCreated++;
        } else {
          const existingYaml = await fs.readFile(yamlPath, "utf-8");
          if (existingYaml !== yamlContent) {
            await fs.writeFile(yamlPath, yamlContent);
            stats.metadataCreated++; // Count as created even if overwriting, for simplicity in stats
          } else {
            stats.metadataUnchanged++;
          }
        }
      } else {
        stats.metadataNotApplicable++;
      }
    }
  }

  // Clean up any local files that are no longer part of the gallery for this event
  if (existsSync(galleryDir)) {
    // Build a set of filenames that should exist after this import
    const expectedFiles = new Set<string>();
    for (const photo of photos) {
      const base = path.basename(photo.file);
      expectedFiles.add(base);
      if (photo.caption) {
        expectedFiles.add(`${base}.yaml`);
      }
    }

    const currentFiles = await fs.readdir(galleryDir);
    for (const fileName of currentFiles) {
      if (!expectedFiles.has(fileName)) {
        await fs.unlink(path.join(galleryDir, fileName));
        stats.galleryImagesDeleted++;
        console.log(`Removed stale gallery file → ${path.join(galleryDir, fileName)}`);
      }
    }

    // If the directory is empty after cleanup, remove it to keep things tidy
    const remainingFiles = await fs.readdir(galleryDir);
    if (remainingFiles.length === 0) {
      try {
        await fs.rmdir(galleryDir);
      } catch (err) {
        console.error(`Failed to remove empty gallery ${galleryDir}:`, err);
      }
    }
  }

  // No further action needed here – directory removal is handled above.
}

async function processEvent(event: Event, group: string, photos: Photo[]): Promise<void> {
  const slug = slugify(`${event.id}-${event.title}`, { lower: true, strict: true });
  const eventDir = path.join(EVENTS_BASE_DIR, slug);
  await fs.mkdir(eventDir, { recursive: true });
  const mdPath = path.join(EVENTS_BASE_DIR, slug, "event.md");

  const date = new Date(event.time).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Tokyo",
  });
  const time = new Date(event.time).toLocaleTimeString("en-CA", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Tokyo",
  });
  const dateTime = `${date} ${time}`;
  // convert the date to Japan timezone for easier editing
  const newFrontmatter: Record<string, unknown> = {
    title: event.title,
    dateTime,
  };

  if (event.duration) {
    newFrontmatter.duration = Math.round(event.duration / 60000);
  }

  if (event.image && event.image.file) {
    const coverBasename = path.basename(event.image.file);
    newFrontmatter.cover = `./${coverBasename}`;
    const coverLocalPath = path.join(eventDir, coverBasename);
    await downloadImage(event.image.file, coverLocalPath);
  }

  if (event.topics && event.topics.length > 0) {
    newFrontmatter.topics = event.topics;
  }

  newFrontmatter.meetupId = parseInt(event.id);
  newFrontmatter.group = parseInt(group);
  newFrontmatter.venue = parseInt(event.venue);

  if (existsSync(mdPath)) {
    const existing = matter.read(mdPath);
    const { description, ...existingWithoutDescription } = existing.data;
    const currentDescription = event.description ?? description ?? "";
    const merged = { ...existingWithoutDescription, ...newFrontmatter };

    const content = matter.stringify(`\n${currentDescription}`, merged);
    const existingContent = await fs.readFile(mdPath, "utf-8");
    if (content !== existingContent) {
      await fs.writeFile(mdPath, content);
      console.log(`Updated markdown → ${mdPath}`);
      stats.markdownUpdated++;
    }
  } else {
    const content = matter.stringify(`\n${event.description}`, newFrontmatter);
    await fs.writeFile(mdPath, content);
    console.log(`Created markdown → ${mdPath}`);
    stats.markdownCreated++;
  }

  await processGallery(eventDir, photos);

  return;
}

async function processVenue(venue: Venue, overwriteMaps: boolean = false): Promise<void> {
  // Try to slugify the name first, fall back to address if name produces empty slug
  const nameSlug = slugify(venue.name, { lower: true, strict: true });
  const slugSuffix = nameSlug || slugify(venue.address, { lower: true, strict: true }) || "venue";
  const slug = slugify(`${venue.id}-${slugSuffix}`, { lower: true, strict: true });

  const venueDir = path.join(VENUES_BASE_DIR, slug);
  await fs.mkdir(venueDir, { recursive: true });
  const mdPath = path.join(venueDir, "venue.md");

  // City normalization map (keys should be lowercase)
  const cityMap: Record<string, string> = {
    osaka: "osaka",
    大阪市: "osaka",
    大阪府: "osaka",
    大阪: "osaka",
    kyoto: "kyoto",
    京都市: "kyoto",
    京都府: "kyoto",
    京都: "kyoto",
    kobe: "kobe",
    神戸市: "kobe",
    神戸: "kobe",
    滋賀県: "kyoto",
    shiga: "kyoto",
    奈良県: "osaka",
    nara: "osaka",
    nishinomiya: "kobe",
    hyogo: "kobe",
  };

  const newFrontmatter: Record<string, unknown> = {
    title: venue.name,
  };

  // Add non-empty fields to frontmatter
  if (venue.city) {
    // Normalize city name: lowercase first, then apply mapping
    const lowercaseCity = venue.city.toLowerCase();
    const normalizedCity = cityMap[lowercaseCity];

    if (normalizedCity) {
      newFrontmatter.city = normalizedCity;
    } else {
      // City not found in map - track it and use lowercase version
      newFrontmatter.city = lowercaseCity;
      unmatchedCities.push({
        city: venue.city,
        venueId: venue.id,
        venueName: venue.name,
      });
    }
  }

  if (venue.country) {
    newFrontmatter.country = venue.country;
  }

  if (venue.address) {
    newFrontmatter.address = venue.address;
  }

  if (venue.crossStreet) {
    newFrontmatter.crossStreet = venue.crossStreet;
  }

  if (venue.postalCode) {
    newFrontmatter.postalCode = venue.postalCode;
  }

  if (venue.state) {
    newFrontmatter.state = venue.state;
  }

  if (venue.gmaps) {
    newFrontmatter.gmaps = venue.gmaps;
  }

  if (venue.lat && venue.lng) {
    newFrontmatter.coordinates = {
      lat: venue.lat,
      lng: venue.lng,
    };
  }

  newFrontmatter.meetupId = parseInt(venue.id);

  if (existsSync(mdPath)) {
    const existing = matter.read(mdPath);
    const { description, ...existingWithoutDescription } = existing.data;
    const currentDescription = description ?? "";
    const merged = { ...existingWithoutDescription, ...newFrontmatter };

    const content = matter.stringify(`\n${currentDescription}`, merged);
    const existingContent = await fs.readFile(mdPath, "utf-8");
    if (content !== existingContent) {
      await fs.writeFile(mdPath, content);
      console.log(`Updated venue markdown → ${mdPath}`);
      stats.venuesUpdated++;
    } else {
      stats.venuesUnchanged++;
    }
  } else {
    const content = matter.stringify(`\n`, newFrontmatter);
    await fs.writeFile(mdPath, content);
    console.log(`Created venue markdown → ${mdPath}`);
    stats.venuesCreated++;
  }

  // Generate static map if coordinates are available
  if (venue.lat && venue.lng) {
    const mapPath = path.join(venueDir, "map.png");
    const mapGenerated = await generateStaticMap(mapPath, {
      lat: venue.lat,
      lng: venue.lng,
      overwrite: overwriteMaps,
    });

    if (mapGenerated) {
      stats.mapsGenerated++;
    } else if (existsSync(mapPath)) {
      stats.mapsUnchanged++;
    } else {
      stats.mapsFailed++;
    }
  }

  return;
}

// Attempt to infer the most likely event for a set of photos based on the upload timestamp.
// Strategy: choose the event whose start time is the closest *before* the photo timestamp.
// Returns the matching event and its parent group id, or null if no plausible match is found.
function inferEventByTimestamp(
  timestamp: number,
  eventsJSON: EventJSON,
): { event: Event; groupId: string } | null {
  let closestMatch: { event: Event; groupId: string } | null = null;
  let smallestPositiveDiff = Number.POSITIVE_INFINITY;

  for (const [groupId, groupData] of Object.entries(eventsJSON.groups)) {
    for (const ev of groupData.events) {
      const diff = timestamp - ev.time;
      if (diff >= 0 && diff < smallestPositiveDiff) {
        smallestPositiveDiff = diff;
        closestMatch = { event: ev, groupId };
      }
    }
  }

  return closestMatch;
}

async function main() {
  // Parse command line arguments
  const args = process.argv.slice(2);
  const overwriteMaps = args.includes("--overwrite-maps");
  
  if (overwriteMaps) {
    console.log("Map overwrite mode enabled - existing maps will be regenerated");
  }

  const [eventsWithVenuesJSON, photosJSON] = await Promise.all([
    fetch(EVENTS_URL).then((r) => r.json()) as Promise<EventsWithVenuesJSON>,
    fetch(PHOTOS_URL).then((r) => r.json()) as Promise<PhotoJSON>,
  ]);

  const photosByEvent: Record<string, Photo[]> = {};

  Object.values(photosJSON.groups).forEach((grp) => {
    if (grp.event) {
      // Event id explicitly provided – straightforward grouping
      const list = photosByEvent[grp.event] ?? [];
      list.push(...grp.photos);
      photosByEvent[grp.event] = list;
    } else if (INFER_EVENTS) {
      // Attempt to infer the event based on timestamp
      const inferred = inferEventByTimestamp(grp.timestamp, eventsWithVenuesJSON);
      if (inferred) {
        console.log(
          `Inferred photos batch (timestamp: ${grp.timestamp}) → event ${inferred.event.id} (${inferred.event.title})`,
        );
        // Merge photos into the correct event entry
        const list = photosByEvent[inferred.event.id] ?? [];
        list.push(...grp.photos);
        photosByEvent[inferred.event.id] = list;
      } else {
        console.warn(`Could not infer event for photos batch with timestamp ${grp.timestamp}`);
      }
    } else {
      console.log(
        `Skipping photos batch (timestamp: ${grp.timestamp}) because INFER_EVENTS is disabled and no event id present.`,
      );
    }
  });

  // Process events
  for (const [group, groupData] of Object.entries(eventsWithVenuesJSON.groups)) {
    for (const event of groupData.events) {
      stats.totalEvents++;
      const photos = photosByEvent[event.id] ?? [];

      await processEvent(event, group, photos);
    }
  }

  // Process venues
  if (eventsWithVenuesJSON.venues) {
    for (const venue of eventsWithVenuesJSON.venues) {
      stats.totalVenues++;
      await processVenue(venue, overwriteMaps);
    }
  }

  console.log("\nImport Summary:");
  console.log(stats);

  if (unmatchedCities.length > 0) {
    console.log("\nUnmatched Cities (not found in cityMap):");
    unmatchedCities.forEach(({ city, venueId, venueName }) => {
      console.log(`  - "${city}" (Venue ID: ${venueId}, Name: "${venueName}")`);
    });
    console.log(`\nTotal unmatched cities: ${unmatchedCities.length}`);
  } else {
    console.log("\nAll cities were successfully mapped!");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
