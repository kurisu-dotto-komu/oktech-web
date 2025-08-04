import { SOCIALS } from "@/constants";

interface SocialsFooterProps {
  className?: string;
}

export default function SocialsFooter({ className = "" }: SocialsFooterProps) {
  return (
    <div className={`grid grid-flow-col gap-4 ${className}`} data-testid="socials-footer">
      {SOCIALS.map((social) => {
        const IconComponent = social.icon;
        return (
          <div key={social.label} className="tooltip tooltip-top" data-tip={social.label}>
            <a
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="hover:text-primary transition-colors"
            >
              <IconComponent size={18} />
            </a>
          </div>
        );
      })}
    </div>
  );
}
