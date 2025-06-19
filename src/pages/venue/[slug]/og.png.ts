import type { APIRoute, GetStaticPaths } from "astro";
import { getVenue, getVenues } from "../../../data";
import OGVenue from "../../../components/OGVenue";
import { createOGImageHandler } from "../../../utils/ogHandler";

export const GET: APIRoute = async ({ params }) => {
  const slug = params.slug;

  // Get venue data
  const venue = await getVenue(slug);

  if (!venue) {
    return new Response("Not found", { status: 404 });
  }

  return createOGImageHandler({
    component: OGVenue,
    props: { venue },
  });
};

export const getStaticPaths: GetStaticPaths = async () => {
  const venues = await getVenues();
  return venues.map((venue) => ({
    params: { slug: venue.id },
  }));
};