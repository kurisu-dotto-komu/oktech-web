import { resolveUrl } from "./resolveUrl";

interface OGImageParams {
  type?: "default" | "event" | "person" | "venue";
  slug?: string;
}

export function getOGImageURL(params: OGImageParams, origin?: string | URL): string {
  // Route to the appropriate OG image endpoint based on type
  let path: string;

  if (params.type && params.slug) {
    // Dynamic OG images for specific content types
    switch (params.type) {
      case "event":
        path = `/event/${params.slug}/og.png`;
        break;
      case "person":
        path = `/person/${params.slug}/og.png`;
        break;
      case "venue":
        path = `/venue/${params.slug}/og.png`;
        break;
      default:
        path = "/og.png";
    }
  } else {
    // Default OG image
    path = "/og.png";
  }

  return resolveUrl(path, origin);
}
