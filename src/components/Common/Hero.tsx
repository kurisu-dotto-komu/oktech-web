import type { ReactNode } from "react";

import clsx from "clsx";

interface HeroProps {
  title?: string;
  description?: string;
  button?: {
    href: string;
    text: string;
    icon?: string;
    iconLeft?: boolean;
  };
  slim?: boolean;
  class?: string;
  className?: string;
  children?: ReactNode;
}

export default function Hero({ slim, className, children }: HeroProps) {
  return (
    <div data-testid="hero" className={clsx("py-20", slim ? "" : "min-h-[50vh]", className)}>
      {children}
    </div>
  );
}
