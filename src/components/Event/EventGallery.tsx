import Section from "@/components/Common/Section";
import EventGalleryImages from "./EventGalleryImages";
import type { CollectionEntry } from "astro:content";

interface Props {
  galleryImages: CollectionEntry<"eventGalleryImage">[];
  class?: string;
}

export default function EventGallery({ galleryImages }: Props) {
  if (galleryImages.length === 0) {
    return null;
  }

  return (
    <Section wide grid title="Gallery">
      <EventGalleryImages galleryImages={galleryImages} />
    </Section>
  );
}
