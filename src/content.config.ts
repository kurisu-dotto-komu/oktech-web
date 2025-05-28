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

export const collections = { events, eventGalleryImage };
