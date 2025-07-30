import type { APIRoute, GetStaticPaths } from "astro";
import { getPeople } from "@/content";
import OGPerson from "@/components/OG/OGPerson";
import { createOGImageHandler } from "@/utils/og";

export const GET: APIRoute = async ({ params }) => {
  const personSlug = params.personSlug;

  // Get person data
  const people = await getPeople();
  const person = people.find((p) => p.id === personSlug);

  if (!person) {
    return new Response("Not found", { status: 404 });
  }

  return createOGImageHandler({
    component: OGPerson,
    props: { person },
  });
};

export const getStaticPaths: GetStaticPaths = async () => {
  const people = await getPeople();
  return people.map((person) => ({
    params: { personSlug: person.id },
  }));
};
