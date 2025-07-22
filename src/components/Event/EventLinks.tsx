import Section from "@/components/Common/Section";
import EventLinkCard from "./EventLinkCard";

export interface EventLink {
  type: string;
  title: string;
  description?: string;
  url: string;
}

interface Props {
  links: EventLink[];
}

export default function EventLinks({ links }: Props) {
  if (links.length === 0) {
    return null;
  }

  return (
    <Section grid title="Links">
      {links.map((link, index) => (
        <EventLinkCard key={index} link={link} />
      ))}
    </Section>
  );
}
