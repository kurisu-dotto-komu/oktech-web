import { type Person } from "@/content";
import { LuUser } from "react-icons/lu";

interface PersonImageProps {
  person: Person;
  className?: string;
  class?: string;
}

// Map color names to Tailwind classes
const colorClasses = {
  red: "bg-red-600 text-red-100",
  orange: "bg-orange-600 text-orange-100",
  amber: "bg-amber-600 text-amber-100",
  yellow: "bg-yellow-600 text-yellow-100",
  lime: "bg-lime-600 text-lime-100",
  green: "bg-green-600 text-green-100",
  emerald: "bg-emerald-600 text-emerald-100",
  teal: "bg-teal-600 text-teal-100",
  cyan: "bg-cyan-600 text-cyan-100",
  sky: "bg-sky-600 text-sky-100",
  blue: "bg-blue-600 text-blue-100",
  indigo: "bg-indigo-600 text-indigo-100",
  violet: "bg-violet-600 text-violet-100",
  purple: "bg-purple-600 text-purple-100",
  fuchsia: "bg-fuchsia-600 text-fuchsia-100",
  pink: "bg-pink-600 text-pink-100",
  rose: "bg-rose-600 text-rose-100",
} as const;

export default function PersonImage({
  person,
  className,
  class: classFromAstro,
}: PersonImageProps) {
  const finalClassName = className || classFromAstro || "rounded-lg";
  const colorClass = colorClasses[person.theme as keyof typeof colorClasses] || colorClasses.blue;

  return (
    <div
      className={`overflow-hidden flex items-center justify-center ${colorClass} w-full h-full ${finalClassName}`}
    >
      {person.avatar && person.avatar.length > 0 ? (
        <img src={person.avatar} alt={person.name} className="w-full h-full object-cover" />
      ) : (
        <LuUser className="w-full h-full opacity-50" />
      )}
    </div>
  );
}
