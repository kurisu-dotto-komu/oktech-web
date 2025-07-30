import { defineCollection, z, getCollection } from "astro:content";
import path from "path";
import { memoize } from "@/utils/memoize";
import { ROLE_CONFIGS } from "@/constants";

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

// Type definitions
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
};

// Collection definition
export const peopleCollection = defineCollection({
  loader: async () => {
    // Load every person markdown file located at `/content/people/**/person.md`
    // The folder name will be used as the unique slug / id for the person.
    const imports = import.meta.glob("/content/people/**/person.md", {
      eager: true,
    });

    return Object.entries(imports).map(([fileName, module]) => {
      const basePath = fileName.replace("/person.md", "");
      const slug = basePath.split("/").pop() as string;

      const {
        frontmatter,
        default: body,
        rawContent,
      } = module as {
        frontmatter: Record<string, unknown>;
        default: { render: () => { html: string } };
        rawContent: () => string;
      };

      const avatar = frontmatter.avatar
        ? path.join(basePath, frontmatter.avatar as string)
        : undefined;

      // When optional properties don't exist yet, fall back to safe placeholders.
      const theme = (frontmatter.theme as string | undefined) ?? "pastel";
      const skills = (frontmatter.skills as string[] | undefined) ?? [];
      const events = (frontmatter.events as string[] | undefined) ?? [];

      // Extract a plain-text version of the markdown body to use as a simple bio.
      // `body.render()` gives us HTML – strip tags for now because we only need raw text.
      let bio: string | undefined;
      try {
        const html = body.render().html as string;
        bio = html.replace(/<[^>]*>/g, "").trim();
      } catch {
        bio = undefined;
      }


      return {
        id: slug,
        name: frontmatter.name as string,
        skills,
        events,
        avatar,
        theme,
        bio,
      };
    });
  },
  schema: ({ image }) =>
    z.object({
      id: z.string(),
      name: z.string(),
      skills: z.array(z.string()).optional(),
      events: z.array(z.number()).optional(), // will be linked later via reference
      avatar: image().optional(),
      theme: z.string().optional(),
      bio: z.string().optional(),
    }),
});

// Export memoized functions
export const getPeople = memoize(async (): Promise<Person[]> => {
  // Reason: Soft delete - returning empty array to disable people section
  // while preserving all content and data structure for potential future use
  return [];
  
  // Original implementation preserved below:
  /*
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
    } satisfies Person;
  });
  */
});

export const getPerson = memoize(async (id: string | undefined) => {
  // Reason: Soft delete - always throw to prevent individual person access
  throw `People section is disabled`;
  
  // Original implementation preserved below:
  /*
  if (!id) {
    throw "Person ID not defined";
  }
  const people = await getPeople();
  const person = people.find((p) => p.id === id);
  if (!person) {
    throw `No person found for id ${id}`;
  }
  return person;
  */
});