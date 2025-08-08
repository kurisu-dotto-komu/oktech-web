import { twStyle } from "@/utils/og/tw";

import OGLayout, { IconWrapper, LocationIcon } from "./OGLayout";

interface VenueData {
  data: {
    title: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
  };
}

interface OGVenueProps {
  venue: VenueData;
}

export default function OGVenue({ venue }: OGVenueProps) {
  // Create location string
  const locationParts = [
    venue.data.address,
    venue.data.city,
    venue.data.state,
    venue.data.country,
  ].filter(Boolean);
  const location = locationParts.join(", ");

  return (
    <OGLayout title={venue.data.title} subtitle="Event Venue">
      <div style={twStyle("flex flex-col gap-6")}>
        {location && (
          <div style={twStyle("flex items-center gap-4")}>
            <IconWrapper>
              <LocationIcon />
            </IconWrapper>
            <span style={twStyle("text-white/95 text-[22px]")}>{location}</span>
          </div>
        )}

        <div style={twStyle("flex flex-col gap-3")}>
          <p style={twStyle("text-white/90 text-xl leading-relaxed")}>
            Host venue for OKTech community events and meetups.
          </p>
          <p style={twStyle("text-white/80 text-lg")}>
            Join us at this location for networking, learning, and collaboration.
          </p>
        </div>
      </div>
    </OGLayout>
  );
}
