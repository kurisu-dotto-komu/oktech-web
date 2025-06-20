import React from "react";
import { SITE } from "../config";
import OGLayout, { LocationIcon } from "./OGLayout";

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
    <OGLayout gradient="linear-gradient(135deg, #fa709a 0%, #fee140 100%)">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          minHeight: "430px",
        }}
      >
        <div style={{ display: "flex", marginBottom: "24px", justifyContent: "center" }}>
          <LocationIcon size={80} fill={true} />
        </div>
        <h1
          style={{
            fontSize: "56px",
            fontWeight: "bold",
            color: "white",
            textAlign: "center",
            margin: 0,
          }}
        >
          {venue.data.title}
        </h1>
        {location && (
          <p
            style={{
              fontSize: "24px",
              color: "rgba(255, 255, 255, 0.9)",
              marginTop: "16px",
            }}
          >
            {location}
          </p>
        )}
      </div>
    </OGLayout>
  );
}