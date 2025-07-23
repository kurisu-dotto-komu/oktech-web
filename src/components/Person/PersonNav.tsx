import StickyBottomNavButtons from "@/components/Common/StickyBottomNavButtons";
import type { Person } from "@/content";

interface Props {
  person: Person;
  people: Person[];
  className?: string;
  class?: string;
  keyboardEvents?: boolean;
}

export default function PersonNav({ person, people, className, keyboardEvents }: Props) {
  // Get current index and prev/next people
  const currentIndex = people.findIndex((p) => p.id === person.id);
  // Loop to last person if at first, loop to first person if at last
  const prevPerson = currentIndex > 0 ? people[currentIndex - 1] : people[people.length - 1];
  const nextPerson = currentIndex < people.length - 1 ? people[currentIndex + 1] : people[0];

  const prevItem = prevPerson
    ? {
        href: `/person/${prevPerson.id}`,
        title: prevPerson.name,
      }
    : undefined;

  const nextItem = nextPerson
    ? {
        href: `/person/${nextPerson.id}`,
        title: nextPerson.name,
      }
    : undefined;

  const backButton = {
    href: "/people",
    icon: "lucide:users",
    text: "All People",
  };

  return (
    <StickyBottomNavButtons
      prevItem={prevItem}
      nextItem={nextItem}
      backButton={backButton}
      className={className}
      keyboardEvents={keyboardEvents}
    />
  );
}
