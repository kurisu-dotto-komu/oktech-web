import React from "react";

import { Resvg } from "@resvg/resvg-js";
// required here
import satori from "satori";

import { OGImageCache } from "./ogCache";

export interface OGHandlerOptions {
  component: React.ComponentType<any>;
  props: Record<string, unknown>;
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
    const cache = new OGImageCache();

    // Check if we have a cached version
    const cachedBuffer = await cache.getCachedImage(props);
    if (cachedBuffer && process.env.NODE_ENV !== "development") {
      return new Response(cachedBuffer, {
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }

    // Load local fonts from assets
    const fs = await import("fs/promises");
    const path = await import("path");

    const fontsDir = path.join(process.cwd(), "src/assets/fonts");

    const [notoRegular, notoMedium, notoBold, lexendMedium, lexendBold] = await Promise.all([
      fs.readFile(path.join(fontsDir, "NotoSans-Regular.ttf")),
      fs.readFile(path.join(fontsDir, "NotoSans-Medium.ttf")),
      fs.readFile(path.join(fontsDir, "NotoSans-Bold.ttf")),
      fs.readFile(path.join(fontsDir, "Lexend-Medium.ttf")),
      fs.readFile(path.join(fontsDir, "Lexend-Bold.ttf")),
    ]);

    // Generate the markup using the provided component
    const markup = React.createElement(component, props);

    const svg = await satori(markup, {
      width,
      height,
      fonts: [
        // Body font - Noto Sans
        {
          name: "Noto Sans",
          data: notoRegular,
          weight: 400,
          style: "normal",
        },
        {
          name: "Noto Sans",
          data: notoMedium,
          weight: 500,
          style: "normal",
        },
        {
          name: "Noto Sans",
          data: notoBold,
          weight: 700,
          style: "normal",
        },
        // Header font - Lexend
        {
          name: "Lexend",
          data: lexendMedium,
          weight: 500,
          style: "normal",
        },
        {
          name: "Lexend",
          data: lexendBold,
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

    // Cache the generated image
    await cache.cacheImage(props, pngBuffer);

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
      const convertedBuffer = await sharp
        .default(imageBuffer)
        .resize(600, 600, {
          fit: "inside",
          withoutEnlargement: true,
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
