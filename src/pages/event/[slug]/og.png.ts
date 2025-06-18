import type { APIRoute, GetStaticPaths } from "astro";
import { getEvents } from "../../../data";
import satori from "satori";
import { html } from "satori-html";
import { Resvg } from "@resvg/resvg-js";
import { SITE } from "../../../config";

export const GET: APIRoute = async ({ params }) => {
  const slug = params.slug;

  // Get event data
  const events = await getEvents();
  const event = events.find((e) => e.id === slug);

  if (!event) {
    return new Response("Not found", { status: 404 });
  }

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

  // Generate map URL if we have coordinates
  const mapUrl = event.venue?.coordinates
    ? `https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/pin-l+f74e4e(${event.venue.coordinates.lng},${event.venue.coordinates.lat})/${event.venue.coordinates.lng},${event.venue.coordinates.lat},14,0/400x300?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw`
    : null;

  try {
    // Fetch fonts
    const [regularFont, boldFont] = await Promise.all([
      fetch("https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-400-normal.ttf").then(
        (res) => res.arrayBuffer(),
      ),
      fetch("https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-700-normal.ttf").then(
        (res) => res.arrayBuffer(),
      ),
    ]);

    const markup = html`
      <div
        style="height: 100%; width: 100%; display: flex; background: linear-gradient(135deg, #1a1c2e 0%, #2d1b69 100%); position: relative;"
      >
        <div
          style="display: flex; flex-direction: column; justify-content: space-between; width: 100%; height: 100%; padding: 48px; position: relative;"
        >
          <!-- Main content -->
          <div style="display: flex; flex-direction: column; gap: 24px;">
            <h1
              style="font-size: ${event.data.title.length > 40
                ? "48px"
                : "56px"}; font-weight: bold; color: white; margin: 0; line-height: 1.1;"
            >
              ${event.data.title}
            </h1>

            ${description
              ? html`
                  <p
                    style="font-size: 20px; color: rgba(255, 255, 255, 0.8); margin: 0; line-height: 1.4;"
                  >
                    ${description.length > 120
                      ? description.substring(0, 120) + "..."
                      : description}
                  </p>
                `
              : ""}

            <div style="display: flex; flex-direction: column; gap: 16px; margin-top: 8px;">
              ${formattedDate
                ? html`
                    <div style="display: flex; align-items: center; gap: 12px;">
                      <div
                        style="width: 40px; height: 40px; background: rgba(255, 255, 255, 0.1); border-radius: 8px; display: flex; align-items: center; justify-content: center;"
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          stroke-width="2"
                        >
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                      </div>
                      <span style="color: white; font-size: 18px;">${formattedDate}</span>
                    </div>
                  `
                : ""}
              ${venueLocation
                ? html`
                    <div style="display: flex; align-items: center; gap: 12px;">
                      <div
                        style="width: 40px; height: 40px; background: rgba(255, 255, 255, 0.1); border-radius: 8px; display: flex; align-items: center; justify-content: center;"
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          stroke-width="2"
                        >
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                      </div>
                      <span style="color: white; font-size: 18px;">${venueLocation}</span>
                    </div>
                  `
                : ""}
            </div>
          </div>

          <!-- Bottom section with map and branding -->
          <div
            style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 32px;"
          >
            ${mapUrl && event.venue?.title
              ? html`
                  <div style="display: flex; gap: 16px; align-items: flex-end;">
                    <img
                      src="${mapUrl}"
                      style="width: 200px; height: 150px; border-radius: 12px; border: 2px solid rgba(255, 255, 255, 0.2);"
                    />
                    <div style="display: flex; flex-direction: column; gap: 4px;">
                      <span style="color: rgba(255, 255, 255, 0.6); font-size: 14px;">Venue</span>
                      <span style="color: white; font-size: 16px; font-weight: 500;"
                        >${event.venue.title}</span
                      >
                    </div>
                  </div>
                `
              : html`<div></div>`}

            <div style="display: flex; align-items: center; gap: 16px;">
              <div
                style="width: 48px; height: 48px; background: white; border-radius: 12px; display: flex; align-items: center; justify-content: center;"
              >
                <span style="font-size: 24px; font-weight: bold; color: #1a1c2e;"
                  >${SITE.shortName.charAt(0)}</span
                >
              </div>
              <div style="display: flex; flex-direction: column;">
                <span style="color: white; font-size: 20px; font-weight: 600;">
                  ${SITE.shortName}
                </span>
                <span style="color: rgba(255, 255, 255, 0.6); font-size: 14px;">
                  ${SITE.longName}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    const svg = await satori(markup, {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Inter",
          data: regularFont,
          weight: 400,
          style: "normal",
        },
        {
          name: "Inter",
          data: boldFont,
          weight: 700,
          style: "normal",
        },
      ],
    });

    const resvg = new Resvg(svg, {
      fitTo: {
        mode: "width",
        value: 1200,
      },
    });

    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();

    return new Response(pngBuffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error generating OG image:", error);
    return new Response("Error generating image", { status: 500 });
  }
};

export const getStaticPaths: GetStaticPaths = async () => {
  const events = await getEvents();
  return events.map((event) => ({
    params: { slug: event.id },
  }));
};
