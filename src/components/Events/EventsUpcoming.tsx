import Countdown from "@/components/Common/Countdown";
import EventFeatured from "@/components/Event/EventFeatured";
import type { EventEnriched } from "@/content";

interface EventsUpcomingProps {
  events: EventEnriched[];
}

export default function EventsUpcoming({ events }: EventsUpcomingProps) {
  const futureEvents = events.filter((event) => event.data.dateTime > new Date()).reverse();
  const [nextEvent] = futureEvents;

  if (!nextEvent) {
    return null;
  }

  const countdownDate = new Date(nextEvent.data.dateTime);

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-wrap justify-center items-center gap-6 bg-base-100 rounded-xl mx-auto py-6 px-8 shadow-lg">
        <div className="text-lg">Next event starts in</div>
        <Countdown targetDate={countdownDate} />
      </div>
      {futureEvents.map((event) => (
        <EventFeatured key={event.id} event={event} />
      ))}
    </div>
  );
}
