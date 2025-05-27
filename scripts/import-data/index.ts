import path from "node:path";
import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import slugify from "slugify";
import matter from "gray-matter";
import { stringify as yamlStringify } from "yaml";

import type { Event, EventJSON, Photo, PhotoJSON } from "./types";

const EVENTS_URL = "https://owddm.com/public/events.json";
const PHOTOS_URL = "https://owddm.com/public/photos.json";
const PUBLIC_BASE = "https://owddm.com/public/";

async function downloadImage(remotePath: string, localPath: string): Promise<boolean> {
  if (existsSync(localPath)) return false; // already downloaded

  const res = await fetch(`${PUBLIC_BASE}${remotePath}`);
  if (!res.ok) throw new Error(`Failed to fetch ${remotePath}: ${res.status}`);
  const arrayBuf = await res.arrayBuffer();
  await fs.mkdir(path.dirname(localPath), { recursive: true });
  await fs.writeFile(localPath, new Uint8Array(arrayBuf));
  console.log(`Downloaded image → ${localPath}`);
  return true; // newly downloaded
}

async function writeEventMarkdown(
  event: Event,
  groupKey: string,
  relatedPhotos: Photo[],
): Promise<{ markdownUpdated: boolean; imagesDownloaded: number; imagesUnchanged: number }> {
  const slug = slugify(`${event.id}-${event.title}`, { lower: true, strict: true });
  const eventDir = path.join("src", "content", "events", slug);
  await fs.mkdir(eventDir, { recursive: true });

  const mdPath = path.join(eventDir, "event.md");

  const headerImageName = event.image?.file
    ? `${path.parse(event.image.file).name}${path.extname(event.image.file)}`
    : undefined;

  // decorate the object, using a nice order.

  const newFrontmatter: Record<string, unknown> = {
    title: event.title,
    time: new Date(event.time).toISOString(),
  };

  // Add optional fields only if they have values
  if (event.duration) {
    newFrontmatter.duration = Math.round(event.duration / 60000);
  }
  if (headerImageName) {
    newFrontmatter.image = `./gallery/${headerImageName}`;
  }
  if (event.topics && event.topics.length > 0) {
    newFrontmatter.topics = event.topics;
  }

  newFrontmatter.id = parseInt(event.id);
  newFrontmatter.group = parseInt(groupKey);
  newFrontmatter.venue = parseInt(event.venue);

  let content = "";
  let markdownUpdated = false;

  if (existsSync(mdPath)) {
    const existing = matter.read(mdPath);
    const { description, ...existingWithoutDescription } = existing.data;
    const merged = { ...existingWithoutDescription, ...newFrontmatter };
    content = matter.stringify(`\n${event.description}`, merged);

    // Check if content has actually changed
    const existingContent = await fs.readFile(mdPath, "utf-8");
    markdownUpdated = content !== existingContent;
  } else {
    content = matter.stringify(`\n${event.description}`, newFrontmatter);
    markdownUpdated = true; // new file
  }

  if (markdownUpdated) {
    await fs.writeFile(mdPath, content);
    console.log(`Updated markdown → ${mdPath}`);
  }

  // Prepare list of images to download (header + gallery)
  const images: { remote: string; local: string; metadata?: Photo }[] = [];

  if (event.image?.file) {
    const localName = headerImageName as string;
    images.push({
      remote: event.image.file,
      local: path.join(eventDir, "gallery", localName),
    });
  }

  relatedPhotos.forEach((photo) => {
    const localName = `${path.parse(photo.file).name}${path.extname(photo.file)}`;
    images.push({
      remote: photo.file,
      local: path.join(eventDir, "gallery", localName),
      metadata: photo,
    });
  });

  let imagesDownloaded = 0;
  let imagesUnchanged = 0;
  for (const img of images) {
    const downloaded = await downloadImage(img.remote, img.local);
    if (downloaded) {
      imagesDownloaded++;
    } else {
      imagesUnchanged++;
    }

    // Write metadata YAML file for gallery images
    if (img.metadata?.caption) {
      const yamlPath = `${img.local}.yaml`;
      const yamlContent = yamlStringify({ caption: img.metadata.caption }, { lineWidth: 0 });

      if (!existsSync(yamlPath)) {
        await fs.writeFile(yamlPath, yamlContent);
        console.log(`Created metadata → ${yamlPath}`);
      }
    }
  }

  return { markdownUpdated, imagesDownloaded, imagesUnchanged };
}

async function main() {
  const [eventsJSON, photosJSON] = await Promise.all([
    fetch(EVENTS_URL).then((r) => r.json()) as Promise<EventJSON>,
    fetch(PHOTOS_URL).then((r) => r.json()) as Promise<PhotoJSON>,
  ]);

  // Build a quick lookup for photos by event id
  const photosByEvent: Record<string, Photo[]> = {};
  Object.values(photosJSON.groups).forEach((grp) => {
    const list = photosByEvent[grp.event] ?? [];
    list.push(...grp.photos);
    photosByEvent[grp.event] = list;
  });

  let stats = {
    markdownCreated: 0,
    markdownUpdated: 0,
    markdownUnchanged: 0,
    imagesDownloaded: 0,
    imagesUnchanged: 0,
    totalEvents: 0,
  };

  for (const [groupKey, groupData] of Object.entries(eventsJSON.groups)) {
    for (const event of groupData.events) {
      stats.totalEvents++;
      const relatedPhotos = photosByEvent[event.id] ?? [];
      const result = await writeEventMarkdown(event, groupKey, relatedPhotos);

      if (result.markdownUpdated) {
        const slug = slugify(`${event.id}-${event.title}`, { lower: true, strict: true });
        const mdPath = path.join("src", "content", "events", slug, "event.md");
        if (existsSync(mdPath)) {
          stats.markdownUpdated++;
        } else {
          stats.markdownCreated++;
        }
      } else {
        stats.markdownUnchanged++;
      }

      stats.imagesDownloaded += result.imagesDownloaded;
      stats.imagesUnchanged += result.imagesUnchanged;
    }
  }

  console.log("\n📊 Import Summary:");
  console.log(`Events processed: ${stats.totalEvents}`);
  console.log(`Markdown files created: ${stats.markdownCreated}`);
  console.log(`Markdown files updated: ${stats.markdownUpdated}`);
  console.log(`Markdown files unchanged: ${stats.markdownUnchanged}`);
  console.log(`Images downloaded: ${stats.imagesDownloaded}`);
  console.log(`Images unchanged: ${stats.imagesUnchanged}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
