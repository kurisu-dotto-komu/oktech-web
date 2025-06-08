import type { AstroGlobal } from "astro";
import { THEMES, DEV_MODE } from "./config";
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
export const POSSIBLE_ROLES = Object.keys(ROLE_CONFIGS) as Role[];

export type Member = {
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
};

export async function getMembers(): Promise<Member[]> {
  const speakers = await getCollection("speakers");

  return speakers.map(({ data }) => {
    // Use a hash of the speaker's ID to deterministically select a theme
    const hash = data.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const themeIndex = hash % THEMES.length;
    const theme = THEMES[themeIndex];

    return {
      id: data.id,
      name: data.name,
      jobTitle: "Guest Speaker",
      company: "",
      department: "",
      bio: data.bio ?? "",
      avatar: (data.avatar as unknown as string) ?? "",
      skills: (data.skills as string[]) ?? [],
      location: "Osaka, Japan",
      email: "",
      roles: ["speaker"],
      theme: theme,
      events: data.events ?? [],
      links: {},
    } satisfies Member;
  });
}

export type Venue = InferEntrySchema<"venues">;
export type EventEntry = Awaited<ReturnType<typeof getEvent>>;
export type EventData = InferEntrySchema<"events">;

export async function getEvents() {
  const [allEvents, allVenues] = await Promise.all([
    getCollection("events"),
    getCollection("venues"),
  ]);

  // Create a venue lookup map by meetupId, including both data and slug
  const venueMap = new Map<string, { data: Venue; slug: string }>();
  allVenues.forEach((venue) => {
    venueMap.set(venue.data.meetupId.toString(), { data: venue.data, slug: venue.id });
  });

  // Filter out devOnly events in production
  const filteredEvents = DEV_MODE ? allEvents : allEvents.filter((event) => !event.data.devOnly);

  // Join venue data with events
  const eventsWithVenues = filteredEvents.map((event) => {
    const venueEntry = event.data.venue ? venueMap.get(event.data.venue.id) : undefined;
    return {
      ...event,
      venue: venueEntry?.data,
      venueSlug: venueEntry?.slug,
    };
  });

  return eventsWithVenues.reverse();
}

export async function getEvent(slug: string | undefined) {
  if (!slug) {
    throw "Slug not defined";
  }
  const event = await getEntry("events", slug);
  if (!event) {
    throw `No even found for slug ${slug}`;
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

export async function resolveEvent({ params, props }: AstroGlobal) {
  // pull the ID if it's passed, otherwise, use the path's `slug` param
  const slug = props.slug ?? params.slug;
  if (!slug) {
    throw `Slug not defined ${JSON.stringify({ params, props })}`;
  }
  return await getEvent(slug);
}
