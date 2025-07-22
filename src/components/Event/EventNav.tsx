import StickyBottomNavButtons from "@/components/Layout/StickyBottomNavButtons";
import type { EventWithVenue } from "@/data";
import { formatDate } from "@/utils/formatDate";

interface Props {
  event: EventWithVenue;
  events: EventWithVenue[];
  className?: string;
  class?: string;
}

export default function EventNav({ event, events, className, class: classFromAstro }: Props) {
  const finalClassName = className || classFromAstro || "";

  const currentIndex = events.findIndex(({ data }) => data.id === event.id);
  const futureEvent = currentIndex > 0 ? events[currentIndex - 1] : null;
  const pastEvent = currentIndex < events.length - 1 ? events[currentIndex + 1] : null;

  const prevItem = pastEvent
    ? {
        href: `/event/${pastEvent.data.id}`,
        title: pastEvent.data.title,
        subtitle: formatDate(pastEvent.data.dateTime, "short"),
        image: pastEvent.data.cover,
      }
    : undefined;

  const nextItem = futureEvent
    ? {
        href: `/event/${futureEvent.data.id}`,
        title: futureEvent.data.title,
        subtitle: formatDate(futureEvent.data.dateTime, "short"),
        image: futureEvent.data.cover,
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
      className={finalClassName}
    />
  );
}
