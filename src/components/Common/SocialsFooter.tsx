import CalendarFeeds from "@/components/Common/CalendarFeeds";
import { SOCIALS } from "@/constants";

interface SocialsFooterProps {
  className?: string;
}

export default function SocialsFooter({ className = "" }: SocialsFooterProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`} data-testid="socials-footer">
      {SOCIALS.map((social) => {
        const IconComponent = social.icon;

        if ((social as any).type === "calendar") {
          return (
            <CalendarFeeds key={social.label} dropdownPosition="top" className="dropdown-end">
              <button
                aria-label={social.label}
                className="btn btn-ghost btn-circle btn-sm hover:text-primary"
                title={social.label}
              >
                <IconComponent size={18} />
              </button>
            </CalendarFeeds>
          );
        }

        return (
          <div key={social.label} className="tooltip tooltip-top" data-tip={social.label}>
            <a
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="btn btn-ghost btn-circle btn-sm hover:text-primary"
            >
              <IconComponent size={18} />
            </a>
          </div>
        );
      })}
    </div>
  );
}
