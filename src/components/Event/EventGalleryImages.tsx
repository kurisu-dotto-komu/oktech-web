import type { CollectionEntry } from "astro:content";

interface Props {
  galleryImages: CollectionEntry<"eventGalleryImage">[];
  class?: string;
}

export default function EventGalleryImages({ galleryImages }: Props) {
  return (
    <>
      {galleryImages
        .slice()
        .reverse()
        .map((img) => (
          <img
            key={img.id}
            src={img.data.image.src}
            alt={img.data.caption ?? ""}
            className="w-full aspect-[4/3] object-cover rounded-lg hover:opacity-90 transition-opacity bg-base-300"
            loading="lazy"
            width={512}
            height={512}
          />
        ))}
    </>
  );
}
