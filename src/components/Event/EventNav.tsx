import StickyBottomNavButtons from "@/components/Layout/StickyBottomNavButtons";
import type { EventEnriched } from "@/content";
import { formatDate } from "@/utils/formatDate";

interface Props {
  event: EventEnriched;
  events: EventEnriched[];
  className?: string;
  class?: string;
  keyboardEvents?: boolean;
}

export default function EventNav({ event, events, className, keyboardEvents }: Props) {
  const currentIndex = events.findIndex(({ data }) => data.id === event.id);
  // Since events are sorted newest first, previous index is newer/future event
  const nextEvent = currentIndex > 0 ? events[currentIndex - 1] : null;
  // And next index is older/past event
  const prevEvent = currentIndex < events.length - 1 ? events[currentIndex + 1] : null;

  const prevItem = prevEvent
    ? {
        href: `/event/${prevEvent.data.id}`,
        title: formatDate(prevEvent.data.dateTime, "short"),
        subtitle: prevEvent.data.title,
        image: prevEvent.data.cover,
      }
    : undefined;

  const nextItem = nextEvent
    ? {
        href: `/event/${nextEvent.data.id}`,
        title: formatDate(nextEvent.data.dateTime, "short"),
        subtitle: nextEvent.data.title,
        image: nextEvent.data.cover,
      }
    : undefined;

  const backButton = {
    href: "/events",
    icon: "lucide:calendar-days",
    text: "All Events",
  };

  return (
    <StickyBottomNavButtons
      prevItem={prevItem}
      nextItem={nextItem}
      backButton={backButton}
      className={className}
      keyboardEvents={keyboardEvents}
    />
  );
}
