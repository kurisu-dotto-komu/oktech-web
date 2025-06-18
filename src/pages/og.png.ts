import type { APIRoute } from "astro";
import satori from "satori";
import { html } from "satori-html";
import { Resvg } from "@resvg/resvg-js";
import { SITE } from "../config";

export const GET: APIRoute = async () => {
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
        style="height: 100%; width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); position: relative;"
      >
        <div
          style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 64px; text-align: center;"
        >
          <h1
            style="font-size: 96px; font-weight: bold; color: white; margin: 0; line-height: 1; margin-bottom: 24px;"
          >
            ${SITE.shortName}
          </h1>
          <h2
            style="font-size: 36px; font-weight: normal; color: rgba(255, 255, 255, 0.95); margin: 0; margin-bottom: 48px;"
          >
            ${SITE.longName}
          </h2>
          <p style="font-size: 24px; color: rgba(255, 255, 255, 0.9); max-width: 600px;">
            Join our vibrant community of tech enthusiasts, developers, and designers in Osaka &
            Kansai
          </p>
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
