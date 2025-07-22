import { LuClock, LuMapPin } from "react-icons/lu";
import type { EventWithVenue } from "@/data";
import { formatDate, formatTime } from "@/utils/formatDate";
import VenueMap from "@/components/Venue/VenueMap";
import Link from "@/components/Common/LinkReact";
import EventCity from "./EventCity";

interface Props {
  event: EventWithVenue;
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
    <div className="bg-base-100 rounded-lg overflow-hidden">
      {/* Date and Time Section */}
      <div className="p-6 space-y-4">
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
                >
                  {event.venue.title}
                </Link>
              ) : (
                <span className="text-lg font-semibold text-base-content">{event.venue.title}</span>
              )}
              {event.venue.address && (
                <span className="text-base-content/70 mt-1">{event.venue.address}</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Map Section */}
      {event.venue && event.venueSlug && (
        <div className="w-full aspect-video relative">
          <VenueMap
            venue={{
              id: event.venueSlug,
              collection: "venues" as const,
              data: event.venue,
            }}
            marker={event.venue.title}
            link={true}
          />
          {event.venue.city && (
            <div className="absolute bottom-2 right-2">
              <EventCity city={event.venue.city} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
