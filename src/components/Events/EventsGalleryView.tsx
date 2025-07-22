import type { EventWithVenue } from "@/data";
import type { CollectionEntry } from "astro:content";
import EventFeatured from "@/components/Event/EventFeatured";
import EventGalleryImages from "@/components/Event/EventGalleryImages";
import Grid from "@/components/Common/Grid";
import { LuInfo } from "react-icons/lu";

interface Props {
  events: EventWithVenue[];
  galleryImages: CollectionEntry<"eventGalleryImage">[];
}

export default function EventsGalleryView({ events, galleryImages }: Props) {
  // Create a Set of event IDs that have gallery images
  const eventsWithGallery = new Set(galleryImages.map((img) => img.data.event.id));

  // Filter events to only show those with gallery images
  const eventsToShow = events.filter((event) => eventsWithGallery.has(event.id));
  const eventsWithoutGalleryCount = events.length - eventsToShow.length;

  return (
    <div className="space-y-8" data-testid="events-gallery-view">
      {eventsWithoutGalleryCount > 0 && (
        <div className="container mx-auto px-4">
          <div className="alert alert-info">
            <LuInfo className="w-6 h-6" />
            <span>
              Hiding {eventsWithoutGalleryCount} event
              {eventsWithoutGalleryCount > 1 ? "s" : ""} that don't have a gallery
            </span>
          </div>
        </div>
      )}
      {eventsToShow.map((event, i) => {
        // Get gallery images for this event
        const eventGalleryImages = galleryImages.filter((img) => img.data.event.id === event.id);

        return (
          <div
            key={event.id}
            data-testid="event-card"
            className={`py-8 ${i % 2 === 0 ? "" : "bg-base-100/50"}`}
          >
            <div className="container mx-auto px-4">
              <div className="flex flex-col gap-12">
                <EventFeatured event={event} />
                {eventGalleryImages.length > 0 && (
                  <Grid data-testid="event-gallery-images">
                    <EventGalleryImages galleryImages={eventGalleryImages} />
                  </Grid>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
