import clsx from "clsx";

import CityBadge from "@/components/Common/CityBadge";
import Link from "@/components/Common/LinkReact";
import type { EventEnriched } from "@/content";

import EventCardDescription from "./EventCardDescription";
import EventCardImage from "./EventCardImage";

type Variant = "compact" | "polaroid" | "big";

const BORDER = "border-base-100/50 hover:border-base-100/100 border-1";
const ROUNDED = "rounded-box overflow-hidden";
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
        "hover:bg-base-100/100 flex transition-all duration-200",
        BORDER,
        border && ROUNDED,
        !border && index === 0 && "border-none",
        !border && index > 0 && "border-r-0 border-b-0 border-l-0",
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
        cityComponent={
          <CityBadge
            city={event.venue?.city}
            className="rounded-tr-none rounded-br-none rounded-bl-none pl-4"
          />
        }
      />
    </Link>
  );
}

export function EventCardList({ events }: { events: EventEnriched[] }) {
  return (
    <div className={clsx(BORDER, ROUNDED)}>
      {events.map((event, index) => (
        <EventCard key={event.id} variant="compact" event={event} index={index} />
      ))}
    </div>
  );
}
