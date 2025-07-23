import type { ReactNode } from "react";
import Button from "@/components/Common/Button";

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

export default function Hero({
  title,
  description,
  button,
  slim,
  class: classFromAstro,
  className,
  children,
}: HeroProps) {
  const finalClassName = className || classFromAstro || "";
  return (
    <div
      className={`hero ${slim ? "" : "min-h-[70vh]"} bg-primary-content text-primary px-12 py-20 ${finalClassName}`.trim()}
    >
      <div className="hero-content">
        <div className="max-w-xl text-center text-pretty flex flex-col gap-16">
          {title && <h1 className="text-5xl font-bold">{title}</h1>}
          {description && <p className="text-2xl text-primary/70">{description}</p>}
          {button && <Button className="btn-xl" {...button} />}
          {children}
        </div>
      </div>
    </div>
  );
}
