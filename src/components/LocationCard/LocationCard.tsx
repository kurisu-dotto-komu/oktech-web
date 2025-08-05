import clsx from "clsx";

import CityBadge from "@/components/Common/CityBadge";
import type { EventEnriched } from "@/content";
import { formatDate, formatDuration, formatTime, getEndTime } from "@/utils/formatDate";

import LinkReact from "../Common/LinkReact";
import AddToCalendarDropdown from "../Event/EventCalendarDropdown";
import EventJoinButton from "../Event/EventJoinButton";
import VenueMap from "../Venue/VenueMap";

export default function LocationCard({
  event,
  horizontal = false,
}: {
  event: EventEnriched;
  horizontal?: boolean;
}) {
  return (
    <>
      <div className={clsx("glass-card flex", horizontal ? "flex-row" : "flex-col")}>
        {event.venue && (
          <div className={clsx("relative flex", horizontal ? "h-60 w-60" : "h-full w-full")}>
            <VenueMap
              venue={event.venue}
              marker={event.venue?.title}
              link={true}
              className="absolute inset-0"
            />
            {event.venue.city && (
              <div className="absolute right-2 bottom-2">
                <CityBadge city={event.venue.city} />
              </div>
            )}
          </div>
        )}
        <div className="flex flex-grow flex-col">
          <div className="flex flex-grow flex-col justify-center gap-2 p-8">
            <div>{formatDate(event.data.dateTime, "long")}</div>
            <div>
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
            </div>
            <div>
              {event.venue?.hasPage ? (
                <LinkReact
                  className="decoration-base-content/20 hover:decoration-base-content/90 underline decoration-dotted underline-offset-2 transition-all duration-200"
                  href={`/venue/${event.venue?.id}`}
                >
                  {event.venue?.title}
                </LinkReact>
              ) : (
                <span>{event.venue?.title}</span>
              )}
            </div>
            <div>{event.venue?.address}</div>
          </div>
          {event.data.howToFindUs && (
            <div className="bg-info/50 hidden px-8 py-4 text-sm md:block">
              <b className="mr-1">How to find us: </b>
              {event.data.howToFindUs}
            </div>
          )}
        </div>
      </div>
      {event.data.howToFindUs && (
        <div className="bg-info/50 rounded-box px-8 py-4 text-sm md:hidden">
          <b className="mr-1">How to find us: </b>
          {event.data.howToFindUs}
        </div>
      )}
      <div className={clsx("grid gap-6", horizontal ? "grid-cols-2" : "grid-cols-1")}>
        <div>
          <EventJoinButton event={event} />
        </div>
        <div>
          <AddToCalendarDropdown event={event} />
        </div>
      </div>
    </>
  );
}
