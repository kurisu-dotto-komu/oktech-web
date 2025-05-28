import { getCollection, type InferEntrySchema } from "astro:content";

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
  events: Event[];
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
      theme: (data.theme as string) ?? "pastel",
      events: [], // linking to events later
      links: {},
    } satisfies Member;
  });
}

export type Event = InferEntrySchema<"events">;

export async function getEvents(): Promise<Event[]> {
  const allEvents = await getCollection("events");
  return allEvents.reverse().map(({ data }) => data);
}
