import clsx from "clsx";

import type { EventEnriched } from "@/content";

import EventCardCountdown from "./EventCardCountdown";

export default function EventCardCountdownAbsolute({ event }: { event: EventEnriched }) {
  return (
    <EventCardCountdown
      event={event}
      renderer={(timeString, badgeClass) => (
        <div className="absolute top-0 left-0 flex">
          <div
            className={clsx(
              badgeClass,
              "rounded-tl-none rounded-tr-none rounded-bl-none px-5 py-3",
            )}
          >
            {timeString}
          </div>
        </div>
      )}
    />
  );
}
