import Link from "@/components/Common/LinkReact";
import type { EventEnriched } from "@/content";

import EventIconList from "./EventIconList";

interface Props {
  event: EventEnriched;
  className?: string;
  class?: string;
}

export default function EventCompact({ event, className, class: classFromAstro }: Props) {
  const finalClassName = className || classFromAstro || "";

  return (
    <Link href={`/event/${event.id}`} className={`flex h-24 transition-colors ${finalClassName}`}>
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1 px-6 py-2">
        <h3 className="truncate text-base font-semibold" data-testid="event-title">
          {event.data.title}
        </h3>

        <div className="text-base-content/70">
          <EventIconList
            event={event}
            showCountdown={true}
            // stats={["date", "time", "city", "venue"]}
            inline={true}
          />
        </div>
      </div>

      <div className="flex-shrink-0 p-2">
        <figure className="bg-base-300 aspect-video h-full overflow-hidden rounded-lg">
          {event.data.cover ? (
            <img
              src={event.data.cover.src}
              alt={event.data.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="bg-base-300 h-full w-full" />
          )}
        </figure>
      </div>
    </Link>
  );
}
