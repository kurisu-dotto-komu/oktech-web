import Section from "@/components/Common/Section";
import PersonDetails from "./PersonDetails";
import PersonNav from "./PersonNav";
import type { Person } from "@/content";
import type { CollectionEntry } from "astro:content";
import type { ReactNode } from "react";

interface Props {
  person: Person;
  people: Person[];
  personEvents: CollectionEntry<"events">[];
  children?: ReactNode;
}

export default function PersonPage({ person, people, personEvents, children }: Props) {
  return (
    <>
      <Section>
        <PersonDetails person={person} />
      </Section>

      {personEvents.length > 0 && (
        <Section title="Events">
          <div className="flex flex-col gap-8 pt-8">
            {/* EventFeatured components will be rendered by parent */}
            {children}
          </div>
        </Section>
      )}

      <Section>
        <PersonNav person={person} people={people} className="person-navigation" />
      </Section>
    </>
  );
}
