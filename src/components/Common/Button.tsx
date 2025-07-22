import LinkReact from "./LinkReact";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

interface ButtonProps {
  href: string;
  text: string;
  icon?: string;
  className?: string;
  class?: string;
  iconLeft?: boolean;
}

export default function Button({
  href,
  text,
  className,
  class: classFromAstro,
  iconLeft = false,
}: ButtonProps) {
  const buttonClasses = ["btn btn-primary mx-auto", className || classFromAstro]
    .filter(Boolean)
    .join(" ");

  return (
    <LinkReact className={buttonClasses} href={href}>
      {iconLeft && <LuChevronLeft />}
      {text}
      {!iconLeft && <LuChevronRight />}
    </LinkReact>
  );
}
