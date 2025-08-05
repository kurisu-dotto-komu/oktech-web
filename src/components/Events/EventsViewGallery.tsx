import Container from "@/components/Common/Container";
import Grid from "@/components/Common/Grid";
import EventGalleryImages from "@/components/Event/EventGalleryImages";
import { EventCardList } from "@/components/EventCard/EventCard";
import type { EventEnriched } from "@/content";
import { filterRecentEvents } from "@/utils/eventFilters";

interface Props {
  events: EventEnriched[];
}

export default function EventsViewGallery({ events }: Props) {
  // Only show past events (events that have ended including 30-minute buffer)
  const recentEvents = filterRecentEvents(events);

  return (
    <div className="my-20 flex flex-col">
      {recentEvents.map((event) => {
        return (
          <div
            key={event.id}
            className="my-20"
            // className={clsx("py-20", i % 2 === 0 ? "bg-base-content/8" : "bg-base-content/12")}
          >
            <Container>
              {/* list mode has a border */}
              <EventCardList events={[event]} />
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
