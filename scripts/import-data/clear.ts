import path from "node:path";
import { EVENTS_BASE_DIR } from "./constants";

import { glob, rm } from "node:fs/promises";

export async function clearMarkdown() {
  const files = await glob("**/*.md", { cwd: EVENTS_BASE_DIR });
  for await (const file of files) {
    await rm(path.join(EVENTS_BASE_DIR, file), { force: true });
  }
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
}

export async function clearAll() {
  await clearMarkdown();
  await clearImages();
}

async function main() {
  const command = process.argv[2];

  console.log({ command });

  switch (command) {
    case "markdown":
      console.log("Clearing markdown files...");
      await clearMarkdown();
      console.log("Markdown files cleared.");
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
    default:
      console.log("Usage: npm run clear -- [markdown|image-files|image-metadata|images|all]");
      process.exit(1);
  }
}

main().catch(console.error);
