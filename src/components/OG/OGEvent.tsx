import { twStyle } from "@/utils/og/tw";

import OGLayout, { CalendarIcon, IconWrapper, LocationIcon } from "./OGLayout";

interface EventData {
  data: {
    title: string;
    dateTime: Date;
    topics?: string[];
  };
  venue?: {
    id: string;
    title: string;
    city?: string;
  };
}

interface OGEventProps {
  event: EventData;
  mapImageBase64?: string | null;
  coverImageBase64?: string | null;
}

export default function OGEvent({ event }: OGEventProps) {
  // Format date
  const eventDate = new Date(event.data.dateTime);
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Tokyo",
  });

  // Get venue info
  const venueLocation = event.venue
    ? `${event.venue.title}${event.venue.city ? `, ${event.venue.city}` : ""}`
    : "Location TBD";

  // Determine subtitle based on event data
  const subtitle =
    event.data.topics && event.data.topics.length > 0
      ? event.data.topics.slice(0, 2).join(" • ")
      : "OKTech Event";

  return (
    <OGLayout title={event.data.title} subtitle={subtitle}>
      <div style={twStyle("flex flex-col gap-6")}>
        <div style={twStyle("flex items-center gap-4")}>
          <IconWrapper>
            <CalendarIcon />
          </IconWrapper>
          <span style={twStyle("text-white/95 text-[22px]")}>{formattedDate}</span>
        </div>

        <div style={twStyle("flex items-center gap-4")}>
          <IconWrapper>
            <LocationIcon />
          </IconWrapper>
          <span style={twStyle("text-white/95 text-[22px]")}>{venueLocation}</span>
        </div>

        {event.data.topics && event.data.topics.length > 2 && (
          <div style={twStyle("flex mt-2")}>
            <p style={twStyle("text-white/85 text-lg")}>
              Also featuring: {event.data.topics.slice(2).join(", ")}
            </p>
          </div>
        )}
      </div>
    </OGLayout>
  );
}
