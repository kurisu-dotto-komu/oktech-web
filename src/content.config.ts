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
    const imports = await import.meta.glob("/content/speakers/**/speaker.md", {
      eager: true,
    });

    // Build lookup table of meetupId -> event slug once
    const eventImports = await import.meta.glob("/content/events/**/event.md", {
      eager: true,
    });

    const meetupIdToSlug = Object.fromEntries(
      Object.entries(eventImports).map(([fileName, mod]) => {
        const base = fileName.replace("/event.md", "");
        const slug = base.split("/").pop() as string;
        const { frontmatter } = mod as { frontmatter: Record<string, unknown> };
        const meetupId = frontmatter.meetupId ? String(frontmatter.meetupId) : undefined;
        return [meetupId, slug];
      })
    ) as Record<string | undefined, string>;

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

      const rawEvents = (frontmatter.events as (string | number)[] | undefined) ?? [];
      const events = rawEvents
        .map((id) => meetupIdToSlug[String(id)])
        .filter(Boolean) as string[];
       
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
      events: z.array(reference("events")).optional(),
      avatar: image().optional(),
      theme: z.string().optional(),
      bio: z.string().optional(),
    }),
});

export const collections = { events, eventGalleryImage, speakers };
