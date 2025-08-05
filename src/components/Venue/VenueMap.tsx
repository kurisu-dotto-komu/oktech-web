import type { ProcessedVenue } from "@/content";

import VenueMapImage from "./VenueMapImage";

interface Props {
  venue: ProcessedVenue;
  marker?: boolean | string;
  link?: boolean;
  className?: string;
}

export default function VenueMap({ venue, marker, link = false, className }: Props) {
  // Generate map URL - use gmaps if available, otherwise create from address
  const getMapUrl = () => {
    // Show link if either showMarker is true or marker prop is provided
    if (marker === undefined) return null;

    if (venue.gmaps) {
      return venue.gmaps;
    }
    if (venue.coordinates?.lat && venue.coordinates?.lng) {
      return `https://www.google.com/maps/search/?api=1&query=${venue.coordinates.lat},${venue.coordinates.lng}`;
    }

    if (venue.address) {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue.address)}`;
    }
    return null;
  };

  const mapUrl = getMapUrl();

  // Get processed map images from venue data
  const mapImage = venue.mapImageSrc
    ? {
        default: { src: venue.mapImageSrc },
      }
    : null;

  const mapDarkImage = venue.mapDarkImageSrc
    ? {
        default: { src: venue.mapDarkImageSrc },
      }
    : null;

  if (mapUrl && link) {
    return (
      <>
        <a href={mapUrl} target="_blank" rel="noopener noreferrer">
          <VenueMapImage
            mapImage={mapImage}
            mapDarkImage={mapDarkImage}
            marker={marker}
            className={className}
          />
        </a>
      </>
    );
  }

  return (
    <>
      <VenueMapImage
        mapImage={mapImage}
        mapDarkImage={mapDarkImage}
        marker={marker}
        className={className}
      />
    </>
  );
}
