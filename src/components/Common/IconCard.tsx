import type { IconType } from "react-icons";
import { LuCode } from "react-icons/lu";

interface IconCardProps {
  icon?: IconType;
  label: string;
  description: string;
  href: string;
}

export default function IconCard({ icon: IconComponent, label, description, href }: IconCardProps) {
  return (
    <a
      className="card card-border bg-base-100 hover:bg-primary/10 hover:text-primary w-50 cursor-pointer rounded-2xl text-center transition-all"
      href={href}
      rel="noopener noreferrer"
      aria-label={label}
    >
      <div className="flex flex-col items-center gap-10 p-6">
        <div className="bg-primary/20 text-primary w-24 rounded-full p-2">
          {IconComponent ? (
            <IconComponent className="h-full w-full" />
          ) : (
            <LuCode className="h-full w-full" />
          )}
        </div>

        <div className="text-pretty">
          <h2 className="text-2xl font-bold">{label}</h2>
          <p className="mt-2">{description}</p>
        </div>
      </div>
    </a>
  );
}
