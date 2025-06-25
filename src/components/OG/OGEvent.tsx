import OGLayout, { CalendarIcon, LocationIcon, IconWrapper } from "./OGLayout";

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

export default function OGEvent({ event, mapImageBase64, coverImageBase64 }: OGEventProps) {
  // Format date
  const eventDate = new Date(event.data.dateTime);
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Tokyo",
  });

  // Get venue info
  const venueLocation = event.venue
    ? `${event.venue.title}${event.venue.city ? `, ${event.venue.city}` : ""}`
    : undefined;

  // Get description
  const description = event.data.topics?.length
    ? `Topics: ${event.data.topics.join(", ")}`
    : "Join us for this exciting tech meetup event!";

  const bottomLeft = coverImageBase64 ? (
    <img
      src={coverImageBase64}
      style={{
        width: "320px",
        height: "180px", // 16:9 aspect ratio
        borderRadius: "12px",
        border: "2px solid rgba(255, 255, 255, 0.2)",
        objectFit: "cover",
      }}
    />
  ) : undefined;

  return (
    <OGLayout bottomLeft={bottomLeft}>
      <div style={{ display: "flex", gap: "32px", alignItems: "flex-start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "24px", flex: 1 }}>
          <h1
            style={{
              fontSize: event.data.title.length > 40 ? "48px" : "56px",
              fontWeight: "bold",
              color: "white",
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            {event.data.title}
          </h1>

          {description && (
            <p
              style={{
                fontSize: "20px",
                color: "rgba(255, 255, 255, 0.8)",
                margin: 0,
                lineHeight: 1.4,
              }}
            >
              {description.length > 120 ? description.substring(0, 120) + "..." : description}
            </p>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "8px" }}>
            {formattedDate && (
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <IconWrapper>
                  <CalendarIcon />
                </IconWrapper>
                <span style={{ color: "white", fontSize: "18px" }}>{formattedDate}</span>
              </div>
            )}
            {venueLocation && (
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <IconWrapper>
                  <LocationIcon />
                </IconWrapper>
                <span style={{ color: "white", fontSize: "18px" }}>{venueLocation}</span>
              </div>
            )}
          </div>
        </div>
        {mapImageBase64 && event.venue?.title && (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px", alignItems: "center" }}
          >
            <img
              src={mapImageBase64}
              style={{
                width: "250px",
                height: "250px", // Square aspect ratio
                borderRadius: "16px",
                border: "3px solid rgba(255, 255, 255, 0.2)",
                objectFit: "cover",
              }}
            />
            <div
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}
            >
              <span style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "14px" }}>Venue</span>
              <span style={{ color: "white", fontSize: "16px", fontWeight: 500 }}>
                {event.venue.title}
              </span>
            </div>
          </div>
        )}
      </div>
    </OGLayout>
  );
}
