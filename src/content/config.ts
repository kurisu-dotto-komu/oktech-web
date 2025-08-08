import { defineCollection, z } from "astro:content";
import { eventsCollection, eventGalleryImageCollection } from "./events";
import { venuesCollection } from "./venues";

// Define markdown collections for event and venue descriptions
const eventsMarkdownCollection = defineCollection({
  type: "content",
  schema: z.object({
    // Markdown content, no frontmatter expected
  }),
});

const venuesMarkdownCollection = defineCollection({
  type: "content",
  schema: z.object({
    // Markdown content, no frontmatter expected
  }),
});

export const collections = {
  events: eventsCollection,
  eventGalleryImage: eventGalleryImageCollection,
  venues: venuesCollection,
  eventsMarkdown: eventsMarkdownCollection,
  venuesMarkdown: venuesMarkdownCollection,
};