import { type Person } from "@/data";
import LinkReact from "@/components/Common/LinkReact";
import PersonImage from "./PersonImage";

interface PersonSummaryProps {
  person: Person;
  showRoles?: boolean;
}

export default function PersonSummary({ person }: PersonSummaryProps) {
  return (
    <LinkReact
      data-theme={person.theme}
      href={`/person/${person.id}`}
      className="hover-zoom relative card bg-primary-content text-primary"
    >
      <div className="card-body p-2">
        <div className="flex gap-6 items-center">
          <figure className="w-28 h-40 flex-shrink-0">
            <PersonImage person={person} />
          </figure>
          <div className="flex flex-col gap-2">
            <div>
              <h3 className="card-title text-xl">{person.name}</h3>
              <p className="text-sm">{person.jobTitle}</p>
            </div>
            <div className="gap-1 flex flex-wrap">
              {person.skills.map((skill: string) => (
                <span key={skill} className="badge badge-primary badge-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </LinkReact>
  );
}
