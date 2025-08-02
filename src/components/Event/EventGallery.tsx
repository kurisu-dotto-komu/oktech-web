import GalleryDisclaimer from "@/components/Common/GalleryDisclaimer";
import Section from "@/components/Common/Section";
import type { EventEnriched } from "@/content";

import EventGalleryImages from "./EventGalleryImages";

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
