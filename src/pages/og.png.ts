import type { APIRoute } from "astro";
import OGDefault from "../components/OGDefault";
import { createOGImageHandler } from "../utils/ogHandler";

export const GET: APIRoute = async () => {
  return createOGImageHandler({
    component: OGDefault,
    props: {},
  });
};