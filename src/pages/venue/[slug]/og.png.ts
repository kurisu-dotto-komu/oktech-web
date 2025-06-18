import type { APIRoute, GetStaticPaths } from "astro";
import { getVenue, getVenues } from "../../../data";
import satori from "satori";
import { html } from "satori-html";
import { Resvg } from "@resvg/resvg-js";
import { SITE } from "../../../config";

export const GET: APIRoute = async ({ params }) => {
  const slug = params.slug;

  // Get venue data
  const venue = await getVenue(slug);

  if (!venue) {
    return new Response("Not found", { status: 404 });
  }

  // Create location string
  const locationParts = [
    venue.data.address,
    venue.data.city,
    venue.data.state,
    venue.data.country,
  ].filter(Boolean);
  const location = locationParts.join(", ");

  // Create description

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
        style="height: 100%; width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); padding: 48px;"
      >
        <svg width="80" height="80" viewBox="0 0 24 24" fill="white" style="margin-bottom: 24px;">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
        <h1
          style="font-size: 56px; font-weight: bold; color: white; text-align: center; margin: 0;"
        >
          ${venue.data.title}
        </h1>
        ${location
          ? html`
              <p style="font-size: 24px; color: rgba(255, 255, 255, 0.9); margin-top: 16px;">
                ${location}
              </p>
            `
          : ""}
        <div
          style="position: absolute; bottom: 32px; color: rgba(255, 255, 255, 0.8); font-size: 18px;"
        >
          ${SITE.name}
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
  const venues = await getVenues();
  return venues.map((venue) => ({
    params: { slug: venue.id },
  }));
};
