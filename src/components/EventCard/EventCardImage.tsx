import clsx from "clsx";

import type { EventEnriched } from "@/content";

import EventCardCountdown from "./EventCardCountdown";

type Variant = "compact" | "polaroid" | "big";

interface EventCardImageProps {
  event: EventEnriched;
  variant: Variant;
  cityComponent?: React.ReactNode;
}

export default function EventCardImage({ event, variant }: EventCardImageProps) {
  return (
    <div
      className={clsx(
        "relative m-2 overflow-hidden",
        variant === "compact" ? "hidden rounded-2xl sm:block" : "rounded-box",
      )}
    >
      {variant !== "compact" && (
        <div className="absolute top-3 left-3">
          <EventCardCountdown event={event} />
        </div>
      )}

      <figure
        className={clsx(
          "bg-base-300",
          variant === "compact" ? "aspect-video w-42" : "h-full w-full",
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
