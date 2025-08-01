import { MENU } from "@/constants";
import LinkReact from "@/components/Common/LinkReact";

interface MainMenuProps {
  variant?: "footer" | "default";
  className?: string;
}

export default function MainMenu({ variant = "default", className = "" }: MainMenuProps) {
  if (variant === "footer") {
    return (
      <nav className={`flex gap-1 flex-wrap justify-center -mx-4 ${className}`}>
        {MENU.map((item) => {
          const IconComponent = item.icon;
          return (
            <LinkReact
              key={item.href}
              href={item.href}
              className="btn btn-ghost gap-2 text-sm items-center justify-start"
            >
              {IconComponent && <IconComponent />}
              {item.label}
            </LinkReact>
          );
        })}
      </nav>
    );
  }

  // Default variant for other uses
  const items = MENU.filter((item) => item.header !== false);
  return (
    <nav className={className}>
      {items.map((item) => (
        <LinkReact
          key={item.label}
          href={item.href}
          className="btn btn-ghost gap-3 text-lg items-center justify-start"
        >
          {item.label}
        </LinkReact>
      ))}
    </nav>
  );
}
