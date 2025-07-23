import VenueMapImage from "./VenueMapImage";
import type { ProcessedVenue } from "@/content";

interface Props {
  venue: ProcessedVenue;
  marker?: boolean | string;
  link?: boolean;
  className?: string;
  class?: string;
}

export default function VenueMap({
  venue,
  marker,
  link = false,
  className,
  class: classFromAstro,
}: Props) {
  const finalClassName = className || classFromAstro || "";

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

  // Get processed map image from venue data
  const mapImage = venue.mapImageSrc
    ? {
        default: { src: venue.mapImageSrc },
      }
    : null;

  if (mapUrl && link) {
    return (
      <div data-testid="venue-map">
        <a
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`block w-full h-full hover:opacity-90 transition-opacity cursor-pointer ${finalClassName}`}
          data-testid="venue-map-link"
        >
          <VenueMapImage mapImage={mapImage} marker={marker} />
        </a>
      </div>
    );
  }

  return (
    <div data-testid="venue-map">
      <VenueMapImage mapImage={mapImage} marker={marker} className={finalClassName} />
    </div>
  );
}
