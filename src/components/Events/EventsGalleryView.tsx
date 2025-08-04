import clsx from "clsx";

import Container from "@/components/Common/Container";
import Grid from "@/components/Common/Grid";
import EventCompact from "@/components/Event/EventCompact";
import EventGalleryImages from "@/components/Event/EventGalleryImages";
import type { EventEnriched } from "@/content";
import { filterRecentEvents } from "@/utils/eventFilters";

interface Props {
  events: EventEnriched[];
}

export default function EventsGalleryView({ events }: Props) {
  // Only show past events (events that have ended including 30-minute buffer)
  const recentEvents = filterRecentEvents(events);

  return (
    <div className="space-y-8" data-testid="events-gallery-view">
      {recentEvents.map((event) => {
        return (
          <div key={event.id} data-testid="event-card" className={`py-8`}>
            <Container>
              <div className="border-base-100 overflow-hidden rounded-lg border">
                <EventCompact
                  event={event}
                  className={clsx(
                    "hover:bg-base-100 bg-base-100/30",
                    // i % 2 === 0 && "bg-base-100/30",
                    // i % 2 === 1 && "bg-base-100/60",
                  )}
                />
              </div>
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
