import type { APIRoute, GetStaticPaths } from "astro";
import { getPeople } from "../../../data";
import satori from "satori";
import { html } from "satori-html";
import { Resvg } from "@resvg/resvg-js";
import { SITE } from "../../../config";

export const GET: APIRoute = async ({ params }) => {
  const slug = params.person;

  // Get person data
  const people = await getPeople();
  const person = people.find((p) => p.id === slug);

  if (!person) {
    return new Response("Not found", { status: 404 });
  }

  // Create description
  const roleDescriptions = person.roles
    .map((role) => role.charAt(0).toUpperCase() + role.slice(1))
    .join(", ");
  const description = person.bio
    ? person.bio.slice(0, 160) + (person.bio.length > 160 ? "..." : "")
    : `${roleDescriptions} at ${person.company || "the tech community"}`;

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
        style="height: 100%; width: 100%; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 48px;"
      >
        <div
          style="display: flex; flex-direction: column; align-items: center; text-align: center;"
        >
          <div
            style="width: 200px; height: 200px; border-radius: 100px; background: rgba(255, 255, 255, 0.3); margin-bottom: 32px; display: flex; align-items: center; justify-content: center;"
          >
            <svg width="80" height="80" viewBox="0 0 24 24" fill="white">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <h1 style="font-size: 56px; font-weight: bold; color: white; margin: 0;">
            ${person.name}
          </h1>
          ${description
            ? html`
                <p style="font-size: 24px; color: rgba(255, 255, 255, 0.9); margin-top: 16px;">
                  ${description}
                </p>
              `
            : ""}
          <div
            style="position: absolute; bottom: 32px; display: flex; align-items: center; gap: 8px;"
          >
            <span style="color: rgba(255, 255, 255, 0.8); font-size: 18px;"> ${SITE.name} </span>
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
  const people = await getPeople();
  return people.map((person) => ({
    params: { person: person.id },
  }));
};
