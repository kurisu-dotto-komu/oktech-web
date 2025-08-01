import { SOCIALS } from "@/constants";

export { SOCIALS };

interface SocialsProps {
  variant?: "footer" | "default";
  className?: string;
}

export default function Socials({ variant = "default", className = "" }: SocialsProps) {
  if (variant === "footer") {
    return (
      <div className={`grid grid-flow-col gap-4 ${className}`}>
        {SOCIALS.map((social) => {
          const IconComponent = social.icon;
          return (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="hover:text-primary transition-colors"
            >
              <IconComponent size={18} />
            </a>
          );
        })}
      </div>
    );
  }

  // Default variant - same as footer for now
  return (
    <div className={`grid grid-flow-col gap-4 ${className}`}>
      {SOCIALS.map((social) => {
        const IconComponent = social.icon;
        return (
          <a
            key={social.label}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.label}
            className="hover:text-primary transition-colors"
          >
            <IconComponent size={18} />
          </a>
        );
      })}
    </div>
  );
}
