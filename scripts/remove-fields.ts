import fs from "node:fs/promises";
import { glob } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { logger } from "./import-data/logger";

// Base directories for different content types
const CONTENT_DIRS = {
  venues: "./content/venues",
  events: "./content/events",
  people: "./content/people", // Note: people are stored in the people directory
};

// Default fields to remove for each content type
const DEFAULT_FIELDS = {
  venues: ["country", "postalCode", "crossStreet"],
  events: [], // Add default fields for events if needed
  people: [], // Add default fields for people if needed
};

// File patterns for each content type
const FILE_PATTERNS = {
  venues: "**/venue.md",
  events: "**/event.md",
  people: "**/person.md",
};

type ContentType = keyof typeof CONTENT_DIRS;

async function removeFields(contentType: ContentType, fieldsToRemove: string[]): Promise<void> {
  const baseDir = CONTENT_DIRS[contentType];
  const filePattern = FILE_PATTERNS[contentType];

  logger.section(`Removing fields from ${contentType}`);
  logger.info(`Fields to remove: ${fieldsToRemove.join(", ")}`);

  let filesProcessed = 0;
  let filesModified = 0;

  // Find all matching files
  const files = glob(filePattern, { cwd: baseDir });

  for await (const file of files) {
    const filePath = path.join(baseDir, file);
    filesProcessed++;

    try {
      // Read the file
      const content = await fs.readFile(filePath, "utf-8");
      const parsed = matter(content);

      // Track which fields were removed
      const removedFields: string[] = [];

      // Check and remove specified fields
      for (const field of fieldsToRemove) {
        if (field in parsed.data) {
          delete parsed.data[field];
          removedFields.push(field);
        }
      }

      if (removedFields.length > 0) {
        // Write back the file
        const newContent = matter.stringify(parsed.content, parsed.data);
        await fs.writeFile(filePath, newContent);

        filesModified++;
        logger.success(`Updated: ${file}`);
        removedFields.forEach((field) => {
          logger.info(`  - Removed ${field} field`);
        });
      }
    } catch (error) {
      logger.error(`Error processing ${file}:`, error);
    }
  }

  logger.separator();
  logger.info("Summary:");
  logger.info(`- Files processed: ${filesProcessed}`);
  logger.info(`- Files modified: ${filesModified}`);
  logger.info(`- Files unchanged: ${filesProcessed - filesModified}`);
}

function showHelp(): void {
  console.log(`
Usage: npm run remove-fields -- <content-type> [options]

Content Types:
  venues    Remove fields from venue files
  events    Remove fields from event files
  people    Remove fields from people files

Options:
  --fields <field1,field2,...>  Comma-separated list of fields to remove
  --help                        Show this help message

Examples:
  npm run remove-fields -- venues                          # Remove default venue fields
  npm run remove-fields -- venues --fields city,state      # Remove specific venue fields
  npm run remove-fields -- events --fields meetupId        # Remove meetupId from events
  npm run remove-fields -- people --fields skills          # Remove skills from people

Default fields:
  - venues: ${DEFAULT_FIELDS.venues.join(", ") || "none"}
  - events: ${DEFAULT_FIELDS.events.join(", ") || "none"}
  - people: ${DEFAULT_FIELDS.people.join(", ") || "none"}
`);
}

// Parse command line arguments
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes("--help")) {
    showHelp();
    process.exit(0);
  }

  const contentType = args[0] as ContentType;

  // Validate content type
  if (!CONTENT_DIRS[contentType]) {
    logger.error(`Invalid content type: ${contentType}`);
    logger.info("Valid types are: venues, events, people");
    process.exit(1);
  }

  // Parse fields to remove
  let fieldsToRemove = DEFAULT_FIELDS[contentType] || [];

  for (let i = 1; i < args.length; i++) {
    if (args[i] === "--fields" && args[i + 1]) {
      fieldsToRemove = args[i + 1].split(",").map((field) => field.trim());
      break;
    }
  }

  // Check if fields were provided without --fields flag
  if (args[1] && !args[1].startsWith("--")) {
    fieldsToRemove = args[1].split(",").map((field) => field.trim());
  }

  if (fieldsToRemove.length === 0) {
    logger.warn("No fields specified to remove.");
    logger.info("Use --fields option or provide fields as second argument.");
    process.exit(0);
  }

  try {
    await removeFields(contentType, fieldsToRemove);
  } catch (error) {
    logger.error("Script failed:", error);
    process.exit(1);
  }
}

main();
