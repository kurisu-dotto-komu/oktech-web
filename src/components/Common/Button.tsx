import clsx from "clsx";
import { LuArrowUpRight, LuChevronLeft } from "react-icons/lu";

import LinkReact from "./LinkReact";

interface ButtonProps {
  href: string;
  text: string;
  icon?: string;
  className?: string;
  class?: string;
  iconLeft?: boolean;
}

export default function Button({ href, text, className, iconLeft = false }: ButtonProps) {
  return (
    <LinkReact className={clsx("btn btn-primary mx-auto", className)} href={href}>
      {iconLeft && <LuChevronLeft />}
      {text}
      {!iconLeft && <LuArrowUpRight />}
    </LinkReact>
  );
}
