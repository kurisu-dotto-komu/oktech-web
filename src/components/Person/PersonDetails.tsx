import type { Person } from "@/data";
import PersonSocialLink from "./PersonSocialLink";
import PersonImage from "./PersonImage";
import PersonRoleBadges from "./PersonRoleBadges";
import ReactMarkdown from "react-markdown";

interface Props {
  person: Person;
}

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

export default function PersonDetails({ person }: Props) {
  const backgroundClass =
    backgroundColorClasses[person.theme as keyof typeof backgroundColorClasses] || "bg-blue-50";

  return (
    <div className={`card w-full ${backgroundClass}`}>
      <div className="card-body p-8">
        <div className="w-full flex flex-col md:flex-row gap-8">
          <figure className="md:w-1/3">
            <PersonImage person={person} className="w-full h-[400px] shadow-lg rounded-lg" />
          </figure>

          <div className="w-full flex flex-col gap-8">
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-2">
                <h3 className="card-title text-4xl font-bold">{person.name}</h3>
                <p className="text-xl">{person.jobTitle}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <PersonSocialLink type="email" url={person.email} />
              <PersonSocialLink type="website" url={person.links?.website} />
              <PersonSocialLink type="github" url={person.links?.github} />
              <PersonSocialLink type="twitter" url={person.links?.twitter} />
              <PersonSocialLink type="linkedin" url={person.links?.linkedin} />
            </div>

            {(person.roles.length > 0 || person.skills.length > 0) && (
              <div className="flex flex-col gap-2">
                {person.roles.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    <PersonRoleBadges roles={person.roles} />
                  </div>
                )}
                {person.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {person.skills.map((skill) => (
                      <span key={skill} className="badge badge-primary badge-lg">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {person.markdownContent && (
              <div className="flex flex-col gap-4 max-w-none prose prose-lg">
                <ReactMarkdown>{person.markdownContent}</ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
