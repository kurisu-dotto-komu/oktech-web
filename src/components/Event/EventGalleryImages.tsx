import type { EventEnriched } from "@/content";

interface Props {
  event: EventEnriched;
  class?: string;
}

export default function EventGalleryImages({ event }: Props) {
  const galleryImages = event.galleryImages || [];

  if (galleryImages.length === 0) {
    return null;
  }

  return (
    <>
      {galleryImages
        .slice()
        .reverse()
        .map((img) => (
          <img
            key={img.id}
            src={img.thumbnailSrc}
            alt={img.data.caption ?? ""}
            className="w-full aspect-[4/3] object-cover rounded-lg hover:opacity-90 transition-opacity bg-base-300"
            loading="lazy"
            width={320}
            height={240}
          />
        ))}
    </>
  );
}
