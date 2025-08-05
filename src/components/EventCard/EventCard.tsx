import clsx from "clsx";

import CityBadge from "@/components/Common/CityBadge";
import Link from "@/components/Common/LinkReact";
import type { EventEnriched } from "@/content";

import EventCardDescription from "./EventCardDescription";
import EventCardImage from "./EventCardImage";

type Variant = "compact" | "polaroid" | "big";

export const BORDER_CLASS = "border-base-100 overflow-hidden rounded-lg border";

export default function EventCard({
  event,
  index,
  variant = "compact",
}: {
  event: EventEnriched;
  index?: number;
  variant?: Variant;
}) {
  const odd = index !== undefined && index % 2 === 1;
  const border = index === undefined;
  return (
    <Link
      href={`/event/${event.id}`}
      className={clsx(
        "hover:bg-base-100 flex p-1 transition-colors",
        border && BORDER_CLASS,
        odd ? "bg-base-100/30" : "bg-base-100/60",
        variant === "compact" && "flex-row items-center",
        variant === "polaroid" && "flex-col-reverse",
        variant === "big" && "flex-row-reverse",
      )}
    >
      <EventCardDescription
        event={event}
        variant={variant}
        cityComponent={<CityBadge city={event.venue?.city} />}
      />
      <EventCardImage
        event={event}
        variant={variant}
        cityComponent={<CityBadge city={event.venue?.city} />}
      />
    </Link>
  );
}

export function EventCardList({ events }: { events: EventEnriched[] }) {
  return (
    <div className={BORDER_CLASS}>
      {events.map((event, index) => (
        <EventCard key={event.id} variant="compact" event={event} index={index} />
      ))}
    </div>
  );
}
