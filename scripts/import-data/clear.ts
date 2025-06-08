import path from "node:path";
import { EVENTS_BASE_DIR, VENUES_BASE_DIR } from "./constants";

import { glob, rm, readdir, rmdir } from "node:fs/promises";
import { existsSync } from "node:fs";

async function removeEmptyDirectories(dir: string): Promise<void> {
  if (!existsSync(dir)) return;

  try {
    const entries = await readdir(dir, { withFileTypes: true });

    // Recursively process subdirectories first
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const fullPath = path.join(dir, entry.name);
        await removeEmptyDirectories(fullPath);
      }
    }

    // Check if directory is now empty and remove it
    const remainingEntries = await readdir(dir);
    if (remainingEntries.length === 0) {
      await rmdir(dir);
      console.log(`Removed empty directory → ${dir}`);
    }
  } catch (error) {
    // Silently ignore errors (directory might not exist or permission issues)
  }
}

export async function clearMarkdown() {
  const eventsFiles = await glob("**/*.md", { cwd: EVENTS_BASE_DIR });
  for await (const file of eventsFiles) {
    await rm(path.join(EVENTS_BASE_DIR, file), { force: true });
  }

  const venuesFiles = await glob("**/*.md", { cwd: VENUES_BASE_DIR });
  for await (const file of venuesFiles) {
    await rm(path.join(VENUES_BASE_DIR, file), { force: true });
  }

  // Remove empty directories
  await removeEmptyDirectories(EVENTS_BASE_DIR);
  await removeEmptyDirectories(VENUES_BASE_DIR);
}

export async function clearEventMarkdown() {
  const files = await glob("**/*.md", { cwd: EVENTS_BASE_DIR });
  for await (const file of files) {
    await rm(path.join(EVENTS_BASE_DIR, file), { force: true });
  }

  // Remove empty directories
  await removeEmptyDirectories(EVENTS_BASE_DIR);
}

export async function clearVenueMarkdown() {
  const files = await glob("**/*.md", { cwd: VENUES_BASE_DIR });
  for await (const file of files) {
    await rm(path.join(VENUES_BASE_DIR, file), { force: true });
  }

  // Remove empty directories
  await removeEmptyDirectories(VENUES_BASE_DIR);
}

export async function clearImageFiles() {
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
  const patterns = imageExtensions.map((ext) => `**/*.${ext}`);
  for (const pattern of patterns) {
    const files = await glob(pattern, { cwd: EVENTS_BASE_DIR });
    for await (const file of files) {
      await rm(path.join(EVENTS_BASE_DIR, file), { force: true });
    }
  }
}

export async function clearImageMetadat() {
  const files = await glob("**/*.json", { cwd: EVENTS_BASE_DIR });
  for await (const file of files) {
    await rm(path.join(EVENTS_BASE_DIR, file), { force: true });
  }
}

export async function clearImages() {
  await clearImageFiles();
  await clearImageMetadat();

  // Remove empty directories
  await removeEmptyDirectories(EVENTS_BASE_DIR);
}

export async function clearAll() {
  await clearMarkdown();
  await clearImages();

  // Final cleanup of any remaining empty directories
  await removeEmptyDirectories(EVENTS_BASE_DIR);
  await removeEmptyDirectories(VENUES_BASE_DIR);
}

export async function clearEmptyDirectories() {
  await removeEmptyDirectories(EVENTS_BASE_DIR);
  await removeEmptyDirectories(VENUES_BASE_DIR);
}

async function main() {
  const command = process.argv[2];

  console.log({ command });

  switch (command) {
    case "markdown":
      console.log("Clearing all markdown files...");
      await clearMarkdown();
      console.log("All markdown files cleared.");
      break;
    case "events":
      console.log("Clearing event markdown files...");
      await clearEventMarkdown();
      console.log("Event markdown files cleared.");
      break;
    case "venues":
      console.log("Clearing venue markdown files...");
      await clearVenueMarkdown();
      console.log("Venue markdown files cleared.");
      break;
    case "image-files":
      console.log("Clearing image files...");
      await clearImageFiles();
      console.log("Image files cleared.");
      break;
    case "image-metadata":
      console.log("Clearing image metadata files...");
      await clearImageMetadat();
      console.log("Image metadata files cleared.");
      break;
    case "images":
      console.log("Clearing images (files and metadata)...");
      await clearImages();
      console.log("Images cleared.");
      break;
    case "all":
      console.log("Clearing all data...");
      await clearAll();
      console.log("All data cleared.");
      break;
    case "empty-dirs":
      console.log("Clearing empty directories...");
      await clearEmptyDirectories();
      console.log("Empty directories cleared.");
      break;
    default:
      console.log(
        "Usage: npm run clear -- [markdown|events|venues|image-files|image-metadata|images|empty-dirs|all]",
      );
      process.exit(1);
  }
}

main().catch(console.error);
