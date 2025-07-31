import { LuClock, LuMapPin } from "react-icons/lu";
import type { EventEnriched } from "@/content";
import { formatDate, formatTime } from "@/utils/formatDate";
import VenueMap from "@/components/Venue/VenueMap";
import Link from "@/components/Common/LinkReact";
import EventCity from "./EventCity";
import HowToFindUs from "./EventHowToFindUs";

interface Props {
  event: EventEnriched;
}

export default function EventInfo({ event }: Props) {
  // Format the date and time range similar to Meetup.com
  const eventDate = new Date(event.data.dateTime);
  const fullDate = formatDate(eventDate, "long");

  // Calculate end time using duration (in minutes)
  const startTime = formatTime(eventDate);
  let timeRange = startTime;

  if (event.data.duration) {
    const endDate = new Date(eventDate.getTime() + event.data.duration * 60000);
    const endTime = formatTime(endDate);
    timeRange = `${startTime} to ${endTime} JST`;
  }

  return (
    <div className="bg-base-100 rounded-lg relative group">
      {/* Tooltip for How to Find Us */}
      {event.data.howToFindUs && (
        <div className="w-xl absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full -ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto z-50">
          <div className="relative">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full">
              <div className="w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-l-[10px] border-l-base-200"></div>
            </div>
            <div className="justify-items-end">
              <HowToFindUs howToFindUs={event.data.howToFindUs} />
            </div>
          </div>
        </div>
      )}

      {/* Date and Time Section */}
      <div className="p-6 space-y-4" data-testid="event-info">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 mt-1">
            <LuClock className="w-6 h-6 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-base-content">{fullDate}</span>
            <span className="text-base-content/70 mt-1">{timeRange}</span>
          </div>
        </div>

        {event.venue && (
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 mt-1">
              <LuMapPin className="w-6 h-6 text-primary" />
            </div>
            <div className="flex flex-col">
              {event.venue.hasPage ? (
                <Link
                  href={`/venue/${event.venueSlug}`}
                  className="text-lg underline font-semibold text-base-content hover:text-primary transition-colors"
                  data-testid="venue-title-link"
                >
                  {event.venue.title}
                </Link>
              ) : (
                <span className="text-lg font-semibold text-base-content" data-testid="venue-title">
                  {event.venue.title}
                </span>
              )}
              {event.venue.address && (
                <span className="text-base-content/70 mt-1" data-testid="venue-address">
                  {event.venue.address}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Map Section */}
      {event.venue && event.venueSlug && (
        <div className="w-full aspect-video relative">
          <VenueMap venue={event.venue} marker={event.venue.title} link={true} />
          {event.venue.city && (
            <div className="absolute bottom-2 right-2">
              <EventCity city={event.venue.city} />
            </div>
          )}
        </div>
      )}

      {event.data.howToFindUs && (
        <div className="md:hidden">
          <HowToFindUs howToFindUs={event.data.howToFindUs} />
        </div>
      )}
    </div>
  );
}
