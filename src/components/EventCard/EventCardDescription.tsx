import clsx from "clsx";

import type { EventEnriched } from "@/content";
import { formatDate, formatDuration, formatTime, getEndTime } from "@/utils/formatDate";

import EventCardCountdown from "./EventCardCountdown";

type Variant = "compact" | "polaroid" | "big";

function InfoItem({ children, variant }: { children: React.ReactNode; variant: Variant }) {
  if (!children) return null;

  return (
    <div
      className={clsx(
        variant === "compact" ? "text-sm whitespace-nowrap md:text-base" : "line-clamp-2",
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
        variant === "big" && "flex-col gap-2 text-lg",
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
            {" to "}
            {formatTime(getEndTime(event.data.dateTime, event.data.duration)!)}
            {" ("}
            {formatDuration(event.data.duration)}
            {")"}
          </>
        )}
      </InfoItem>
      <InfoItem variant={variant}>{event.venue?.title}</InfoItem>
    </div>
  );
}

interface EventCardDescriptionProps {
  event: EventEnriched;
  variant: Variant;
  cityComponent?: React.ReactNode;
}

export default function EventCardDescription({
  event,
  variant,
  cityComponent,
}: EventCardDescriptionProps) {
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
        {variant === "compact" && cityComponent}
      </div>
      <Info event={event} variant={variant} />
    </div>
  );
}
