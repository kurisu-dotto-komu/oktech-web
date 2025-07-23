import type { Person } from "@/content";
import Button from "@/components/Common/Button";
import PersonImage from "@/components/Person/PersonImage";

interface Props {
  people: Person[];
}

export default function PersonAvatars({ people }: Props) {
  return (
    <div className="space-y-12">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(4rem,1fr))] gap-4">
        {people.map((person) => (
          <div key={person.id} className="avatar">
            <PersonImage person={person} className="w-16 h-16 rounded-full p-2" />
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <Button className="btn-xl" href="/people" text="View All People" />
      </div>
    </div>
  );
}
