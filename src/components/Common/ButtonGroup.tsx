import LinkReact from "./LinkReact";
import { LuSquare } from "react-icons/lu";

interface Button {
  href: string;
  icon: string;
  value: string;
  title?: string;
}

interface ButtonGroupProps {
  buttons: Button[];
  active: string;
  className?: string;
}

export default function ButtonGroup({ buttons, active, className }: ButtonGroupProps) {
  const groupClasses = ["join", className].filter(Boolean).join(" ");

  return (
    <div className={groupClasses}>
      {buttons.map((button: Button) => (
        <LinkReact
          key={button.value}
          href={button.href}
          className={`btn join-item ${active === button.value ? "btn-active" : ""}`}
          title={button.title || button.value}
        >
          <LuSquare size={20} />
        </LinkReact>
      ))}
    </div>
  );
}
