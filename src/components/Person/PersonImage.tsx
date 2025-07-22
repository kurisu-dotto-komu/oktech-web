import { type Person } from "@/data";
import { LuUser } from "react-icons/lu";

interface PersonImageProps {
  person: Person;
  className?: string;
  class?: string;
}

export default function PersonImage({
  person,
  className,
  class: classFromAstro,
}: PersonImageProps) {
  const finalClassName = className || classFromAstro || "rounded-lg";
  return (
    <div
      data-theme={person.theme}
      className={`overflow-hidden flex items-center justify-center bg-primary text-primary-content w-full h-full ${finalClassName}`}
    >
      {person.avatar && person.avatar.length > 0 ? (
        <img src={person.avatar} alt={person.name} className="w-full h-full object-cover" />
      ) : (
        <LuUser className="w-full h-full opacity-50" />
      )}
    </div>
  );
}
