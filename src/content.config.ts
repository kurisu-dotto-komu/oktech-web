import { defineCollection } from "astro:content";
import { eventsCollection, eventGalleryImageCollection } from "./content/events";
import { peopleCollection } from "./content/people";
import { venuesCollection } from "./content/venues";
import { glob } from "astro/loaders";

// we fetch markdown separately from the main collections

// parent folder is the id for markdown files
const getMarkdownId = ({ entry }: { entry: string }) => {
  const pathParts = entry.split("/");
  return pathParts[pathParts.length - 2];
};

const eventsMarkdown = defineCollection({
  loader: glob({
    pattern: "**/event.md",
    base: "./content/events",
    generateId: getMarkdownId,
  }),
});

const peopleMarkdown = defineCollection({
  loader: glob({
    pattern: "**/person.md",
    base: "./content/people",
    generateId: getMarkdownId,
  }),
});

const venuesMarkdown = defineCollection({
  loader: glob({
    pattern: "**/venue.md",
    base: "./content/venues",
    generateId: getMarkdownId,
  }),
});

export const collections = {
  eventsMarkdown,
  peopleMarkdown,
  venuesMarkdown,
  events: eventsCollection,
  eventGalleryImage: eventGalleryImageCollection,
  people: peopleCollection,
  venues: venuesCollection,
};
