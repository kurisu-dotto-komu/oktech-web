import type { APIRoute } from "astro";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import React from "react";

interface OGHandlerOptions {
  component: React.ComponentType<any>;
  props: any;
  width?: number;
  height?: number;
}

export async function createOGImageHandler({
  component,
  props,
  width = 1200,
  height = 630,
}: OGHandlerOptions): Promise<Response> {
  try {
    // Fetch fonts - including Japanese font support
    const [regularFont, boldFont, japaneseFont, japaneseBoldFont] = await Promise.all([
      fetch("https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-400-normal.ttf").then(
        (res) => res.arrayBuffer(),
      ),
      fetch("https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-700-normal.ttf").then(
        (res) => res.arrayBuffer(),
      ),
      // Noto Sans JP for Japanese characters
      fetch("https://cdn.jsdelivr.net/fontsource/fonts/noto-sans-jp@latest/japanese-400-normal.ttf").then(
        (res) => res.arrayBuffer(),
      ),
      fetch("https://cdn.jsdelivr.net/fontsource/fonts/noto-sans-jp@latest/japanese-700-normal.ttf").then(
        (res) => res.arrayBuffer(),
      ),
    ]);

    // Generate the markup using the provided component
    const markup = React.createElement(component, props);

    const svg = await satori(markup, {
      width,
      height,
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
        {
          name: "Noto Sans JP",
          data: japaneseFont,
          weight: 400,
          style: "normal",
        },
        {
          name: "Noto Sans JP",
          data: japaneseBoldFont,
          weight: 700,
          style: "normal",
        },
      ],
    });

    const resvg = new Resvg(svg, {
      fitTo: {
        mode: "width",
        value: width,
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
    // Return the error message in development mode for debugging
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(`Error generating image: ${errorMessage}`, { status: 500 });
  }
}

export async function loadImageAsBase64(imagePath: string): Promise<string | null> {
  try {
    const fs = await import("fs/promises");
    const sharp = await import("sharp");
    
    // Read the image file
    const imageBuffer = await fs.readFile(imagePath);
    const extension = imagePath.split(".").pop()?.toLowerCase();
    
    // Convert WebP to JPEG for better compatibility with Satori
    // Also resize if needed to prevent memory issues
    if (extension === "webp") {
      const convertedBuffer = await sharp.default(imageBuffer)
        .resize(600, 600, { 
          fit: "inside",
          withoutEnlargement: true 
        })
        .jpeg({ quality: 85 })
        .toBuffer();
      return `data:image/jpeg;base64,${convertedBuffer.toString("base64")}`;
    }
    
    // For other formats, use as-is
    const mimeType = extension === "png" ? "image/png" : "image/jpeg";
    return `data:${mimeType};base64,${imageBuffer.toString("base64")}`;
  } catch (error) {
    console.error("Error loading image:", error);
    // Image not found or conversion failed
    return null;
  }
}