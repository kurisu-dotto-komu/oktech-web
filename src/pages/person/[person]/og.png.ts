import type { APIRoute, GetStaticPaths } from "astro";
import { getPeople } from "../../../data";
import OGPerson from "../../../components/OGPerson";
import { createOGImageHandler } from "../../../utils/ogHandler";

export const GET: APIRoute = async ({ params }) => {
  const slug = params.person;

  // Get person data
  const people = await getPeople();
  const person = people.find((p) => p.id === slug);

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
    params: { person: person.id },
  }));
};