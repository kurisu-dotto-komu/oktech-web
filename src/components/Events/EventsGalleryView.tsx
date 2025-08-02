import Container from "@/components/Common/Container";
import Grid from "@/components/Common/Grid";
import EventFeatured from "@/components/Event/EventFeatured";
import EventGalleryImages from "@/components/Event/EventGalleryImages";
import type { EventEnriched } from "@/content";

interface Props {
  events: EventEnriched[];
}

export default function EventsGalleryView({ events }: Props) {
  return (
    <div className="space-y-8" data-testid="events-gallery-view">
      {events.map((event, i) => {
        return (
          <div
            key={event.id}
            data-testid="event-card"
            className={`py-8 ${i % 2 === 0 ? "" : "bg-base-100/50"}`}
          >
            <Container>
              <EventFeatured event={event} />
            </Container>
            <Container wide className="mt-8">
              <Grid data-testid="event-gallery-images">
                <EventGalleryImages event={event} />
              </Grid>
            </Container>
          </div>
        );
      })}
    </div>
  );
}
