import { LuCalendar, LuClock, LuMapPin } from "react-icons/lu";

import Link from "@/components/Common/LinkReact";
import VenueMap from "@/components/Venue/VenueMap";
import type { EventEnriched } from "@/content";
import { formatDate, formatTime } from "@/utils/formatDate";

import EventCity from "./EventCity";

interface Props {
  event: EventEnriched;
  hideMap?: boolean;
}

export default function EventFeatured({ event, hideMap = false }: Props) {
  const formattedDate = formatDate(event.data.dateTime, "long");
  const formattedTime = formatTime(event.data.dateTime);

  return (
    <Link
      className="card bg-base-100 hover-zoom flex h-full w-full flex-col overflow-hidden rounded-lg lg:flex-row"
      href={`/event/${event.id}`}
    >
      {/* Left side - Image (1/3 width) */}
      <div className="lg:w-1/3">
        <figure className="aspect-video h-full w-full lg:aspect-auto">
          {event.data.cover ? (
            <img
              src={event.data.cover.src}
              alt="Event cover"
              className="bg-base-300 h-full w-full object-cover"
              width={512}
              height={512}
            />
          ) : (
            <div className="bg-base-300 h-full w-full" />
          )}
        </figure>
      </div>

      {/* Right side - Details and Map (2/3 width) */}
      <div className="flex lg:w-2/3">
        <div className="flex-1">
          <div className="flex h-full flex-col md:flex-row">
            {/* Left side - Event Details */}
            <div className={`flex flex-col p-6 ${hideMap ? "w-full" : "md:w-2/3"}`}>
              <h3 className="card-title mb-4 text-2xl" data-testid="event-title">
                {event.data.title}
              </h3>

              <div className="mb-4 flex flex-col gap-3 text-base">
                <div className="flex items-center gap-2">
                  <LuCalendar size={20} />
                  <span data-testid="event-date" data-date={event.data.dateTime}>
                    {formattedDate} • {formattedTime}
                  </span>
                </div>
                {event.data.duration && (
                  <div className="flex items-center gap-2">
                    <LuClock size={20} />
                    <span>{event.data.duration / 60} hours</span>
                  </div>
                )}
                {event.venue && (
                  <div className="flex items-center gap-2">
                    <LuMapPin size={20} />
                    <span>{event.venue.title}</span>
                  </div>
                )}
              </div>

              {/* Topics/Tags */}
              {event.data.topics && event.data.topics.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {event.data.topics.map((topic) => (
                    <span
                      key={topic}
                      className="badge badge-sm badge-neutral flex-shrink-0 whitespace-nowrap"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Right side - Map */}
            {!hideMap && event.venue && event.venueSlug && (
              <div className="border-base-content/30 relative hidden h-full w-full border-l-2 border-dotted md:w-1/2 lg:block lg:w-1/3">
                <div className="h-full w-full">
                  <VenueMap venue={event.venue} marker={event.venue.title} />
                </div>
                {event.venue.city && (
                  <div className="absolute right-2 bottom-2">
                    <EventCity city={event.venue.city} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
