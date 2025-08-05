import clsx from "clsx";

import type { EventEnriched } from "@/content";

import EventCardCountdown from "./EventCardCountdown";

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
          <EventCardCountdown
            event={event}
            renderer={(timeString, badgeClass) => (
              <div className="absolute top-0 left-0 flex">
                <div
                  className={clsx(
                    badgeClass,
                    "badge-info m-0 rounded-tl-none rounded-tr-none rounded-bl-none px-4",
                  )}
                >
                  {timeString}
                </div>
              </div>
            )}
          />
        </>
      )}

      <figure
        className={clsx(
          "bg-base-300 aspect-video overflow-hidden",
          variant === "compact" && "h-24",
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
