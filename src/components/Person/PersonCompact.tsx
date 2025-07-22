import PersonImage from "./PersonImage";
import PersonRoleBadges from "./PersonRoleBadges";
import type { Person } from "@/data";
import { LuChevronRight } from "react-icons/lu";

export interface PersonCompactProps {
  person: Person;
  showRoles?: boolean;
}

export default function PersonCompact({ person, showRoles = false }: PersonCompactProps) {
  return (
    <a
      href={`/person/${person.id}`}
      className="flex items-center gap-4 p-4 hover:bg-base-200 transition-colors rounded-lg"
    >
      <div className="avatar">
        <div className="w-16 h-16 rounded-full">
          <PersonImage person={person} />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-lg truncate">{person.name}</h3>
        <p className="text-sm text-base-content/70 truncate">
          {person.jobTitle || "Guest Speaker"}
          {person.company && ` at ${person.company}`}
        </p>
        {showRoles && person.roles?.length > 0 && (
          <div className="flex gap-2 mt-1">
            <PersonRoleBadges roles={person.roles} compact />
          </div>
        )}
      </div>

      <LuChevronRight className="w-5 h-5 text-base-content/50" />
    </a>
  );
}
