import { LuCalendar, LuClock, LuMapPin } from "react-icons/lu";
import type { EventWithVenue } from "@/data";
import Link from "@/components/Common/LinkReact";
import { formatDate, formatTime } from "@/utils/formatDate";
import VenueMap from "@/components/Venue/VenueMap";
import EventCity from "./EventCity";

interface Props {
  event: EventWithVenue;
  hideMap?: boolean;
}

export default function EventFeatured({ event, hideMap = false }: Props) {
  const formattedDate = formatDate(event.data.dateTime, "long");
  const formattedTime = formatTime(event.data.dateTime);

  return (
    <Link
      className="card rounded-xl bg-base-100 h-full hover-zoom flex flex-col lg:flex-row shadow-md w-full hover:shadow-lg overflow-hidden"
      href={`/event/${event.id}`}
    >
      {/* Left side - Image (1/3 width) */}
      <div className="lg:w-1/3">
        <figure className="aspect-video lg:aspect-auto w-full h-full">
          {event.data.cover ? (
            <img
              src={event.data.cover.src}
              alt="Event cover"
              className="bg-base-300 w-full h-full object-cover"
              width={512}
              height={512}
            />
          ) : (
            <div className="bg-base-300 w-full h-full" />
          )}
        </figure>
      </div>

      {/* Right side - Details and Map (2/3 width) */}
      <div className="lg:w-2/3 flex">
        <div className="flex-1">
          <div className="flex flex-col h-full md:flex-row">
            {/* Left side - Event Details */}
            <div className={`flex flex-col p-6 ${hideMap ? "w-full" : "md:w-2/3"}`}>
              <h3 className="card-title text-2xl mb-4" data-testid="event-title">
                {event.data.title}
              </h3>

              <div className="flex flex-col gap-3 text-base mb-4">
                <div className="flex gap-2 items-center">
                  <LuCalendar size={20} />
                  <span data-testid="event-date" data-date={event.data.dateTime}>
                    {formattedDate} • {formattedTime}
                  </span>
                </div>
                {event.data.duration && (
                  <div className="flex gap-2 items-center">
                    <LuClock size={20} />
                    <span>{event.data.duration / 60} hours</span>
                  </div>
                )}
                {event.venue && (
                  <div className="flex gap-2 items-center">
                    <LuMapPin size={20} />
                    <span>{event.venue.title}</span>
                  </div>
                )}
              </div>

              {/* Topics/Tags */}
              {event.data.topics && event.data.topics.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {event.data.topics.map((topic) => (
                    <span
                      key={topic}
                      className="badge badge-sm badge-neutral whitespace-nowrap flex-shrink-0"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Right side - Map */}
            {!hideMap && event.venue && event.venueSlug && (
              <div className="w-full md:w-1/2 lg:w-1/3 h-full hidden lg:block border-l-2 border-dotted border-base-content/30 relative">
                <div className="h-full w-full">
                  <VenueMap
                    venue={{
                      id: event.venueSlug,
                      collection: "venues" as const,
                      data: event.venue,
                    }}
                    marker={event.venue.title}
                  />
                </div>
                {event.venue.city && (
                  <div className="absolute bottom-2 right-2">
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
