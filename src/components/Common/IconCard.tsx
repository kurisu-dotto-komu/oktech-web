import { LuCode } from "react-icons/lu";

interface IconCardProps {
  icon?: string;
  label: string;
  description: string;
  href: string;
}

export default function IconCard({ label, description, href }: IconCardProps) {
  return (
    <a
      className="w-50 cursor-pointer transition-all card card-border rounded-2xl bg-base-100 text-center hover:bg-primary/10 hover:text-primary"
      href={href}
      rel="noopener noreferrer"
      aria-label={label}
    >
      <div className="p-6 flex flex-col gap-10 items-center">
        <div className="bg-primary/20 text-primary rounded-full w-24 p-2">
          <LuCode className="w-full h-full" />
        </div>

        <div className="text-pretty">
          <h2 className="text-2xl font-bold">{label}</h2>
          <p className="mt-2">{description}</p>
        </div>
      </div>
    </a>
  );
}
