import fs from "node:fs/promises";
import path from "node:path";
import { existsSync } from "node:fs";
import slugify from "slugify";
import matter from "gray-matter";
import { stringify as yamlStringify } from "yaml";

import type { Event, EventJSON, Photo, PhotoJSON } from "./types";
import { PUBLIC_BASE, EVENTS_BASE_DIR, EVENTS_URL, PHOTOS_URL } from "./constants";

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
};

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
        const yamlContent = yamlStringify({ caption: photo.caption }, { lineWidth: 0 });

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

  // conver the date to Japan timezone
  const newFrontmatter: Record<string, unknown> = {
    title: event.title,
    date: new Date(event.time).toLocaleDateString("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: "Asia/Tokyo",
    }),
    time: new Date(event.time)
      .toLocaleTimeString("en-CA", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Asia/Tokyo",
      })
      .replace(":", ""),
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

  newFrontmatter.id = parseInt(event.id);
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

async function main() {
  const [eventsJSON, photosJSON] = await Promise.all([
    fetch(EVENTS_URL).then((r) => r.json()) as Promise<EventJSON>,
    fetch(PHOTOS_URL).then((r) => r.json()) as Promise<PhotoJSON>,
  ]);

  const photosByEvent: Record<string, Photo[]> = {};
  Object.values(photosJSON.groups).forEach((grp) => {
    const list = photosByEvent[grp.event] ?? [];
    list.push(...grp.photos);
    photosByEvent[grp.event] = list;
  });

  for (const [group, groupData] of Object.entries(eventsJSON.groups)) {
    for (const event of groupData.events) {
      stats.totalEvents++;
      const photos = photosByEvent[event.id] ?? [];
      await processEvent(event, group, photos);
    }
  }

  console.log("\nImport Summary:");
  console.log(stats);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
