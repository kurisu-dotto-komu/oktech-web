import { defineCollection, reference, z } from "astro:content";
import path from "path";

const events = defineCollection({
  loader: async () => {
    const imports = await import.meta.glob("/content/events/**/event.md", { eager: true });
    return Object.entries(imports).map(([fileName, module]) => {
      // console.log({ module });
      const basePath = fileName.replace("/event.md", "");
      const slug = basePath.split("/").pop() as string;
      const { frontmatter } = module as { frontmatter: Record<string, unknown> };
      const cover = frontmatter.cover && path.join(basePath, frontmatter.cover as string);
      const [date, time] = (frontmatter.dateTime as string).split(" ");
      return {
        id: slug,
        cover,
        title: frontmatter.title as string,
        // Convert to UTC from JST (+09:00),
        dateTime: new Date(`${date}T${time}:00+09:00`),
        duration: frontmatter.duration,
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
      // console.log({ event });
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

const speakers = defineCollection({
  loader: async () => {
    // Load every speaker markdown file located at `/content/speakers/**/speaker.md`
    // The folder name will be used as the unique slug / id for the speaker.
    const imports = await import.meta.glob("/content/speakers/**/speaker.md", {
      eager: true,
    });

    return Object.entries(imports).map(([fileName, module]) => {
      const basePath = fileName.replace("/speaker.md", "");
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
    // Load every venue markdown file located at `/content/venues/**/venue.md`
    // The folder name will be used as the unique slug / id for the venue.
    const imports = await import.meta.glob("/content/venues/**/venue.md", {
      eager: true,
    });

    return Object.entries(imports).map(([fileName, module]) => {
      const basePath = fileName.replace("/venue.md", "");
      const slug = basePath.split("/").pop() as string;

      const { frontmatter, default: body } = module as {
        frontmatter: Record<string, unknown>;
        default: { render: () => { html: string } };
      };

      const image = frontmatter.image
        ? path.join(basePath, frontmatter.image as string)
        : undefined;

      // Extract description from markdown body
      let description: string | undefined;
      try {
        const html = body.render().html as string;
        description = html.trim();
      } catch {
        description = undefined;
      }

      return {
        id: slug,
        title: frontmatter.title as string,
        city: frontmatter.city as string,
        coordinates: frontmatter.coordinates as { lat: number; lng: number },
        image,
        description,
      };
    });
  },
  schema: ({ image }) =>
    z.object({
      id: z.string(),
      title: z.string(),
      city: z.enum(["osaka", "kyoto"]),
      coordinates: z.object({
        lat: z.number(),
        lng: z.number(),
      }),
      image: image().optional(),
      description: z.string().optional(),
    }),
});

export const collections = { events, eventGalleryImage, speakers, venues };
