import { defineCollection, reference, z } from "astro:content";
import path from "path";

const events = defineCollection({
  loader: async () => {
    const imports = await import.meta.glob("/content/events/**/event.md", { eager: true });
    return Object.entries(imports).map(([fileName, module]) => {
      const basePath = fileName.replace("/event.md", "");
      const slug = basePath.split("/").pop() as string;
      const { frontmatter } = module as { frontmatter: Record<string, unknown> };
      const cover = frontmatter.cover && path.join(basePath, frontmatter.cover as string);
      const [date, time] = (frontmatter.dateTime as string).split(" ");
      const devOnly = frontmatter.devOnly as boolean | undefined;

      // Convert venue number to string if it exists
      const venueId = frontmatter.venue;
      const venue = venueId ? String(venueId) : undefined;

      return {
        id: slug,
        cover,
        title: frontmatter.title as string,
        // Convert to UTC from JST (+09:00),
        dateTime: new Date(`${date}T${time}:00+09:00`),
        duration: frontmatter.duration,
        devOnly: devOnly ?? false,
        venue,
        topics: frontmatter.topics as string[] | undefined,
      };
    });
  },
  schema: ({ image }) =>
    z.object({
      id: z.string(),
      title: z.string(),
      dateTime: z.date(),
      duration: z.number().optional(),
      cover: image(),
      devOnly: z.boolean().optional().default(false),
      venue: reference("venues").optional(),
      topics: z.array(z.string()).optional(),
    }),
});

const eventGalleryImage = defineCollection({
  loader: async () => {
    const [images, metadata] = await Promise.all([
      import.meta.glob("/content/events/**/gallery/*.{webp,jpg,jpeg,png,gif,svg}", {
        eager: true,
      }),
      import.meta.glob("/content/events/**/gallery/*.yaml", { eager: true }),
    ]);

    return Object.entries(images).map(([id]) => {
      const metaDataPath = `${id}.yaml`;
      const metaDataModule = metadata[metaDataPath] as
        | { default: Record<string, unknown> }
        | undefined;
      const imageMetadata = metaDataModule?.default as Record<string, unknown>;
      const event = id.split("/").slice(0, -2).pop();
      return { ...imageMetadata, id, event, image: id };
    });
  },
  schema: ({ image }) =>
    z.object({
      id: z.string(),
      image: image(),
      event: reference("events"),
      caption: z.string().optional(), // todo add more metadatas?
    }),
});

const people = defineCollection({
  loader: async () => {
    // Load every person markdown file located at `/content/people/**/person.md`
    // The folder name will be used as the unique slug / id for the person.
    const imports = await import.meta.glob("/content/people/**/person.md", {
      eager: true,
    });

    return Object.entries(imports).map(([fileName, module]) => {
      const basePath = fileName.replace("/person.md", "");
      const slug = basePath.split("/").pop() as string;

      const { frontmatter, default: body } = module as {
        frontmatter: Record<string, unknown>;
        default: { render: () => { html: string } };
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

const venues = defineCollection({
  loader: async () => {
    const imports = await import.meta.glob("/content/venues/**/venue.md", {
      eager: true,
    });

    return Object.entries(imports).map(([fileName, module]) => {
      const basePath = fileName.replace("/venue.md", "");
      const slug = basePath.split("/").pop() as string;

      const { frontmatter } = module as {
        frontmatter: Record<string, unknown>;
      };

      const cover = frontmatter.cover && path.join(basePath, frontmatter.cover as string);

      return {
        id: slug,
        title: frontmatter.title as string,
        city: frontmatter.city as string | undefined,
        country: frontmatter.country as string | undefined,
        address: frontmatter.address as string | undefined,
        state: frontmatter.state as string | undefined,
        postalCode: frontmatter.postalCode as string | undefined,
        url: frontmatter.url as string | undefined,
        gmaps: frontmatter.gmaps as string | undefined,
        coordinates: frontmatter.coordinates as { lat: number; lng: number } | undefined,
        meetupId: frontmatter.meetupId as number,
        hasPage: frontmatter.hasPage as boolean | undefined,
        description: frontmatter.description as string | undefined,
        cover,
      };
    });
  },
  schema: ({ image }) =>
    z.object({
      id: z.string(),
      title: z.string(),
      city: z.string().optional(),
      country: z.string().optional(),
      address: z.string().optional(),
      state: z.string().optional(),
      postalCode: z.string().optional(),
      url: z.string().optional(),
      gmaps: z.string().optional(),
      coordinates: z
        .object({
          lat: z.number(),
          lng: z.number(),
        })
        .optional(),
      meetupId: z.number(),
      hasPage: z.boolean().optional(),
      description: z.string().optional(),
      cover: image().optional(),
    }),
});

export const collections = { events, eventGalleryImage, people, venues };
