import { type Person } from "@/content";
import LinkReact from "@/components/Common/LinkReact";
import PersonImage from "./PersonImage";

interface PersonSummaryProps {
  person: Person;
  showRoles?: boolean;
}

// Map color names to badge classes
const badgeColorClasses = {
  red: "badge-error",
  orange: "badge-warning",
  amber: "badge-warning",
  yellow: "badge-warning",
  lime: "badge-success",
  green: "badge-success",
  emerald: "badge-success",
  teal: "badge-info",
  cyan: "badge-info",
  sky: "badge-info",
  blue: "badge-primary",
  indigo: "badge-primary",
  violet: "badge-secondary",
  purple: "badge-secondary",
  fuchsia: "badge-secondary",
  pink: "badge-accent",
  rose: "badge-accent",
} as const;

// Map color names to light background classes
const backgroundColorClasses = {
  red: "bg-red-50",
  orange: "bg-orange-50",
  amber: "bg-amber-50",
  yellow: "bg-yellow-50",
  lime: "bg-lime-50",
  green: "bg-green-50",
  emerald: "bg-emerald-50",
  teal: "bg-teal-50",
  cyan: "bg-cyan-50",
  sky: "bg-sky-50",
  blue: "bg-blue-50",
  indigo: "bg-indigo-50",
  violet: "bg-violet-50",
  purple: "bg-purple-50",
  fuchsia: "bg-fuchsia-50",
  pink: "bg-pink-50",
  rose: "bg-rose-50",
} as const;

export default function PersonSummary({ person }: PersonSummaryProps) {
  const badgeClass =
    badgeColorClasses[person.theme as keyof typeof badgeColorClasses] || "badge-primary";
  const backgroundClass =
    backgroundColorClasses[person.theme as keyof typeof backgroundColorClasses] || "bg-blue-50";

  return (
    <LinkReact href={`/person/${person.id}`} className="hover-zoom relative block">
      <div
        className={`card h-full ${backgroundClass}`}
        style={{ viewTransitionName: `person-card-${person.id}` }}
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
                  <span key={skill} className={`badge ${badgeClass} badge-sm`}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </LinkReact>
  );
}
