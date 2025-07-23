import Section from "@/components/Common/Section";
import EventGalleryImages from "./EventGalleryImages";
import type { EventEnriched } from "@/content";

interface Props {
  event: EventEnriched;
  class?: string;
}

export default function EventGallery({ event }: Props) {
  const galleryImages = event.galleryImages || [];

  if (galleryImages.length === 0) {
    return null;
  }

  return (
    <Section wide grid title="Gallery">
      <EventGalleryImages event={event} />
    </Section>
  );
}
