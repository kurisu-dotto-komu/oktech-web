import clsx from "clsx";

import Link from "@/components/Common/LinkReact";
import type { EventEnriched } from "@/content";
import { formatDate, formatDuration, formatTime, getEndTime } from "@/utils/formatDate";

import EventCardCountdown from "./EventCardCountdown";

type Variant = "compact" | "polaroid" | "big";

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function City({ city }: { city: string | undefined }) {
  if (!city) return null;

  const cityLower = city.toLowerCase();
  return (
    <span
      className={clsx(
        cityLower === "osaka" && "badge badge-primary",
        cityLower === "kyoto" && "badge badge-secondary",
        cityLower === "kobe" && "badge badge-accent",
      )}
    >
      {capitalize(city)}
    </span>
  );
}

export const BORDER_CLASS = "border-base-100 overflow-hidden rounded-lg border";

function InfoItem({ children, variant }: { children: React.ReactNode; variant: Variant }) {
  if (!children) return null;

  return (
    <div
      className={clsx(
        variant === "compact" ? "text-sm whitespace-nowrap md:text-base" : "line-clamp-2",
        // variant === "big" && "text-lg",
      )}
    >
      {children}
    </div>
  );
}

function Info({ event, variant }: { event: EventEnriched; variant: Variant }) {
  return (
    <div
      className={clsx(
        "text-base-content/70 flex",
        variant === "compact" && "flex-row items-center gap-4",
        variant === "polaroid" && "flex-col gap-2",
        variant === "big" && "flex-col gap-2",
      )}
      style={
        variant === "compact"
          ? {
              maskImage: "linear-gradient(to right, black 80%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to right, black 80%, transparent 100%)",
            }
          : {}
      }
    >
      {variant === "compact" && (
        <EventCardCountdown
          event={event}
          renderer={(timeString, badgeClass) => (
            <InfoItem variant={variant}>
              <div className={badgeClass}>{timeString}</div>
            </InfoItem>
          )}
        />
      )}
      <InfoItem variant={variant}>{formatDate(event.data.dateTime, "long")}</InfoItem>
      <InfoItem variant={variant}>
        {formatTime(event.data.dateTime)}
        {event.data.duration && (
          <>
            {" - "}
            {formatTime(getEndTime(event.data.dateTime, event.data.duration)!)}
            {" ・ "}
            {formatDuration(event.data.duration)}
          </>
        )}
      </InfoItem>
      <InfoItem variant={variant}>
        {event.venue?.title} {event.venue?.address}
      </InfoItem>
    </div>
  );
}

function Description({ event, variant }: { event: EventEnriched; variant: Variant }) {
  return (
    <div
      className={clsx(
        "flex min-w-0 flex-1 flex-col",
        variant === "compact" && "gap-2 px-5 py-4",
        variant === "polaroid" && "justify-start gap-4 px-4 py-6",
        variant === "big" && "justify-center gap-6 px-6 py-8",
      )}
    >
      <div className="flex justify-between gap-8">
        <h3
          className={clsx(
            "line-clamp-2",
            variant === "compact" && "truncate text-lg sm:text-xl",
            variant === "big" && "text-2xl",
            variant === "polaroid" && "text-xl",
          )}
          data-testid="event-title"
        >
          {event.data.title}
        </h3>
        {variant === "compact" && <City city={event.venue?.city} />}
      </div>
      <Info event={event} variant={variant} />
    </div>
  );
}

function Image({ event, variant }: { event: EventEnriched; variant: Variant }) {
  return (
    <div className={clsx("relative", variant === "compact" && "hidden sm:block")}>
      {variant !== "compact" && (
        <>
          <div className="absolute right-1 bottom-1">
            <City city={event.venue?.city} />
          </div>
          <EventCardCountdown
            event={event}
            renderer={(timeString, badgeClass) => (
              <div className="absolute top-1 left-1">
                <div className={badgeClass}>{timeString}</div>
              </div>
            )}
          />
        </>
      )}

      <figure
        className={clsx(
          "bg-base-300 aspect-video overflow-hidden rounded-lg",
          variant === "compact" && "h-22",
          variant === "polaroid" && "h-full",
          variant === "big" && "h-60",
        )}
      >
        <img
          src={event.data.cover.src}
          alt={event.data.title}
          className="h-full w-full object-cover"
        />
      </figure>
    </div>
  );
}

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
      <Description event={event} variant={variant} />
      <Image event={event} variant={variant} />
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
