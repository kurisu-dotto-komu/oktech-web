import clsx from "clsx";

import Container from "@/components/Common/Container";
import Grid from "@/components/Common/Grid";
import EventGalleryImages from "@/components/Event/EventGalleryImages";
import EventCard from "@/components/EventCard/EventCard";
import type { EventEnriched } from "@/content";
import { filterRecentEvents } from "@/utils/eventFilters";

interface Props {
  events: EventEnriched[];
}

export default function EventsGalleryView({ events }: Props) {
  // Only show past events (events that have ended including 30-minute buffer)
  const recentEvents = filterRecentEvents(events);

  return (
    <div className="my-20 flex flex-col">
      {recentEvents.map((event, i) => {
        return (
          <div
            key={event.id}
            className={clsx("py-20", i % 2 === 0 ? "bg-base-content/5" : "bg-base-content/10")}
          >
            <Container>
              <div className="border-base-100 overflow-hidden rounded-lg border">
                <EventCard event={event} variant="compact" />
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
