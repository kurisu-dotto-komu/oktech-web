import Section from "@/components/Common/Section";
import EventGalleryImages from "./EventGalleryImages";
import GalleryDisclaimer from "@/components/Common/GalleryDisclaimer";
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
    <Section wide grid title="Gallery" element={<GalleryDisclaimer />}>
      <EventGalleryImages event={event} />
    </Section>
  );
}
