import Section from "@/components/Common/Section";
import PersonSummary from "@/components/Person/PersonSummary";
import type { EventWithVenue, Person } from "@/data";

interface Props {
  event: EventWithVenue;
  people: Person[];
}

export default function EventPeople({ event, people }: Props) {
  const eventPeople = people.filter((person) =>
    person.events.find((e) => event.id.startsWith(`${e}`)),
  );

  if (eventPeople.length === 0) {
    return null;
  }

  return (
    <Section grid title="People">
      {eventPeople.map((person) => (
        <PersonSummary key={person.id} person={person} />
      ))}
    </Section>
  );
}
