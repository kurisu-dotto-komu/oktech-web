import type { AstroGlobal } from "astro";
import { DEV_MODE } from "./config";
import { getCollection, getEntry, type InferEntrySchema } from "astro:content";

export const ROLE_CONFIGS = {
  volunteer: {
    label: "Volunteer",
    plural: "Volunteers",
    description: "Supporting events with hands-on help",
    color: "badge-accent",
    icon: "lucide:hand",
  },
  speaker: {
    label: "Speaker",
    plural: "Speakers",
    description: "Sharing knowledge through engaging presentations",
    color: "badge-error",
    icon: "lucide:mic",
  },
  organizer: {
    label: "Organizer",
    plural: "Organizers",
    description: "Leading and coordinating community initiatives",
    color: "badge-warning",
    icon: "lucide:users",
  },
} as const;

export type Role = keyof typeof ROLE_CONFIGS;

export type Person = {
  id: string;
  name: string;
  jobTitle: string;
  company: string;
  department: string;
  bio: string;
  avatar?: string;
  skills: string[];
  location: string;
  email: string;
  roles: Role[];
  theme: string;
  events: number[];
  links?: {
    github?: string;
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
  markdownContent?: string;
};

// Define Tailwind color classes for users
const TAILWIND_COLORS = [
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "rose",
] as const;

export async function getPeople(): Promise<Person[]> {
  const people = await getCollection("people");

  return people.map(({ data }) => {
    // Use a hash of the person's ID to deterministically select a color
    const hash = data.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colorIndex = hash % TAILWIND_COLORS.length;
    const color = TAILWIND_COLORS[colorIndex];

    return {
      id: data.id,
      name: data.name,
      jobTitle: "Guest Speaker",
      company: "",
      department: "",
      bio: data.bio ?? "",
      avatar: data.avatar?.src ?? "",
      skills: (data.skills as string[]) ?? [],
      location: "Osaka, Japan",
      email: "",
      roles: ["speaker"],
      theme: color,
      events: data.events ?? [],
      links: {},
      markdownContent: data.markdownContent,
    } satisfies Person;
  });
}

export type Venue = InferEntrySchema<"venues">;
export type EventData = InferEntrySchema<"events">;

// Enhanced event type that includes joined venue data
export type EventWithVenue = {
  id: string;
  slug?: string;
  collection: "events";
  data: EventData;
  venue?: Venue;
  venueSlug?: string;
};

// Type for events array from getEvents()
export type EventsArray = EventWithVenue[];

// Export getVenues as it's needed for static path generation
export async function getVenues() {
  const venues = await getCollection("venues");
  // Only return venues that have a page
  return venues.filter((venue) => venue.data.hasPage);
}

export async function getEvents() {
  const [allEvents, allVenues] = await Promise.all([
    getCollection("events"),
    getCollection("venues"),
  ]);

  // Create a venue lookup map by meetupId, including both data and venueSlug
  const venueMap = new Map<string, { data: Venue; venueSlug: string }>();
  allVenues.forEach((venue) => {
    venueMap.set(venue.data.meetupId.toString(), { data: venue.data, venueSlug: venue.id });
  });

  // Filter out devOnly events in production
  const filteredEvents = DEV_MODE ? allEvents : allEvents.filter((event) => !event.data.devOnly);

  // Join venue data with events
  const eventsWithVenues = filteredEvents.map((event) => {
    const venueEntry = event.data.venue ? venueMap.get(event.data.venue.id) : undefined;
    return {
      ...event,
      venue: venueEntry?.data,
      venueSlug: venueEntry?.venueSlug,
    };
  });

  return eventsWithVenues.reverse();
}

export async function getEvent(eventSlug: string | undefined) {
  if (!eventSlug) {
    throw "Event slug not defined";
  }
  const event = await getEntry("events", eventSlug);
  if (!event) {
    throw `No event found for slug ${eventSlug}`;
  }

  // Get venue data if the event has a venue reference
  let venueData: Venue | undefined;
  let venueSlug: string | undefined;
  if (event.data.venue) {
    const venues = await getCollection("venues");
    const venue = venues.find((v) => v.data.meetupId.toString() === event.data.venue?.id);
    venueData = venue?.data;
    venueSlug = venue?.id;
  }

  return {
    ...event,
    venue: venueData,
    venueSlug,
  };
}

export async function getVenue(venueSlug: string | undefined) {
  if (!venueSlug) {
    throw "Venue slug not defined";
  }
  const venue = await getEntry("venues", venueSlug);
  if (!venue) {
    throw `No venue found for slug ${venueSlug}`;
  }
  return venue;
}

export async function getPerson(id: string | undefined) {
  if (!id) {
    throw "Person ID not defined";
  }
  const people = await getPeople();
  const person = people.find((p) => p.id === id);
  if (!person) {
    throw `No person found for id ${id}`;
  }
  return person;
}
