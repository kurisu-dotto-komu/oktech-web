import clsx from "clsx";
import { LuClock, LuMapPin } from "react-icons/lu";

import BigTooltip from "@/components/Common/BigTooltip";
import CityBadge from "@/components/Common/CityBadge";
import Link from "@/components/Common/LinkReact";
import VenueMap from "@/components/Venue/VenueMap";
import type { EventEnriched } from "@/content";
import { formatDate, formatTime } from "@/utils/formatDate";

import HowToFindUs from "./EventHowToFindUs";

interface Props {
  event: EventEnriched;
  horizontal?: boolean;
}

export default function EventInfo({ event, horizontal = false }: Props) {
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

  const eventContent = (
    <div className={clsx("bg-base-100 rounded-box", horizontal && "flex flex-col gap-4")}>
      {/* Date and Time Section */}
      <div className="space-y-4 p-6" data-testid="event-info">
        <div className="flex items-start gap-4">
          <div className="mt-1 flex-shrink-0">
            <LuClock className="text-primary h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-base-content text-lg font-semibold">{fullDate}</span>
            <span className="text-base-content/70 mt-1">{timeRange}</span>
          </div>
        </div>

        {event.venue && (
          <div className="flex items-start gap-4">
            <div className="mt-1 flex-shrink-0">
              <LuMapPin className="text-primary h-6 w-6" />
            </div>
            <div className="flex flex-col">
              {event.venue.hasPage ? (
                <Link
                  href={`/venue/${event.venueSlug}`}
                  className="text-base-content hover:text-primary text-lg font-semibold underline transition-colors"
                  data-testid="venue-title-link"
                >
                  {event.venue.title}
                </Link>
              ) : (
                <span className="text-base-content text-lg font-semibold" data-testid="venue-title">
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
        <div className="relative aspect-video w-full">
          <VenueMap venue={event.venue} marker={event.venue.title} link={true} />
          {event.venue.city && (
            <div className="absolute right-2 bottom-2">
              <CityBadge city={event.venue.city} />
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

  if (event.data.howToFindUs) {
    return (
      <BigTooltip position="left" content={<HowToFindUs howToFindUs={event.data.howToFindUs} />}>
        {eventContent}
      </BigTooltip>
    );
  }

  return eventContent;
}
