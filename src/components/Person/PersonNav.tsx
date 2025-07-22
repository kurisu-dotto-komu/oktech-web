import StickyBottomNavButtons from "@/components/Layout/StickyBottomNavButtons";
import type { Person } from "@/data";

interface Props {
  person: Person;
  people: Person[];
  className?: string;
  class?: string;
}

export default function PersonNav({ person, people, className, class: classFromAstro }: Props) {
  const finalClassName = className || classFromAstro || "";

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
      className={finalClassName}
    />
  );
}
