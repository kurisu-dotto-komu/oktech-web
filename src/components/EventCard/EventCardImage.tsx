import clsx from "clsx";

import type { EventEnriched } from "@/content";

import EventCardCountdownAbsolute from "./EventCardCountdownAbsolute";

type Variant = "compact" | "polaroid" | "big";

interface EventCardImageProps {
  event: EventEnriched;
  variant: Variant;
  cityComponent?: React.ReactNode;
}

export default function EventCardImage({ event, variant, cityComponent }: EventCardImageProps) {
  return (
    <div className={clsx("relative", variant === "compact" && "hidden sm:block")}>
      {variant !== "compact" && (
        <>
          <div className="absolute right-0 bottom-0">{cityComponent}</div>
          <EventCardCountdownAbsolute event={event} />
        </>
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
