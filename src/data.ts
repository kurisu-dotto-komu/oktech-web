import { faker } from "@faker-js/faker";
import { THEMES } from "./config";
import { getCollection, type InferEntrySchema } from "astro:content";

export const FAKER_COUNT = 50;

// Predefined lists
const PROGRAMMING_LANGUAGES = [
  "TypeScript",
  "JavaScript",
  "Python",
  "Java",
  "C++",
  "Rust",
  "Go",
  "Ruby",
  "PHP",
  "Swift",
];

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
  gender: ReturnType<typeof faker.person.sexType>;
  name: string;
  jobTitle: string;
  company: string;
  department: string;
  bio: string;
  avatar: string;
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

function generateMember(id: string): Member {
  // Seed faker with the member ID to get consistent data
  faker.seed(parseInt(id.replace(/\D/g, "") || "0", 10));

  // Determine if this should be an anonymous/GitHub-style user (roughly 20% chance)
  const isAnonymous = faker.number.int(100) < 20;

  // Generate username once to use consistently across profile
  const username = faker.internet.username().toLowerCase();

  // First determine gender for consistency using the type-safe method
  const gender = faker.person.sexType();

  // Generate 2-3 paragraphs of text
  const paragraphs = faker.helpers.multiple(() => faker.lorem.paragraph(), {
    count: { min: 2, max: 3 },
  });

  // Format the bio with markdown
  const bio =
    paragraphs.map((p) => `${p}\n\n`).join("") +
    `### Skills & Interests\n\n` +
    `* ${faker.lorem.words(3)}\n` +
    `* ${faker.lorem.words(2)}\n` +
    `* ${faker.lorem.words(4)}\n\n` +
    `> ${faker.lorem.sentence()}`;

  // For anonymous users, use generic avatar
  const avatar = isAnonymous
    ? faker.image.avatarGitHub()
    : faker.image.personPortrait({ sex: gender });

  // For anonymous users, use username as display name
  const name = isAnonymous ? username : faker.person.fullName({ sex: gender });

  return {
    id,
    gender,
    name,
    jobTitle: faker.person.jobTitle(),
    company: faker.company.name(),
    department: faker.commerce.department(),
    bio,
    avatar,
    skills: faker.helpers.arrayElements(PROGRAMMING_LANGUAGES, { min: 0, max: 8 }),
    location: `${faker.location.city()}, ${faker.location.country()}`,
    email: faker.internet.email(),
    roles: faker.helpers.arrayElements(
      POSSIBLE_ROLES.filter((r) => r !== "speaker"),
      { min: 0, max: 3 },
    ),
    theme: faker.helpers.arrayElement(THEMES),
    events: [],
    links: {
      github: faker.helpers.maybe(() => `https://github.com/${username}`),
      twitter: faker.helpers.maybe(() => `https://twitter.com/${username}`),
      linkedin: faker.helpers.maybe(() => `https://linkedin.com/in/${username}`),
      website: faker.helpers.maybe(() => `https://${username}.dev`),
    },
  };
}

export const members: Member[] = [
  // Real speakers imported from the content collection
  ...(await (async () => {
    const speakers = await getCollection("speakers");
    return speakers.map(({ data }) => {
      return {
        id: data.id,
        gender: "male" as ReturnType<typeof faker.person.sexType>,
        name: data.name,
        jobTitle: "Guest Speaker",
        company: "",
        department: "",
        bio: data.bio ?? "",
        avatar:
          (data.avatar as unknown as string) ??
          "https://placehold.co/400x600?text=Speaker",
        skills: (data.skills as string[]) ?? [],
        location: "Osaka, Japan",
        email: "",
        roles: ["speaker"],
        theme: (data.theme as string) ?? "pastel",
        events: [], // linking to events later
        links: {},
      } satisfies Member;
    });
  })()),
  // Faker generated community members (without any speakers)
  ...(() => {
    const arr: Member[] = [];
    for (let i = 0; i < FAKER_COUNT; i++) {
      arr.push(generateMember(i.toString()));
    }
    return arr;
  })(),
];

export type Event = InferEntrySchema<"events">;

export async function getEvents(): Promise<Event[]> {
  const allEvents = await getCollection("events");
  return allEvents.reverse().map(({ data }) => data);
}
