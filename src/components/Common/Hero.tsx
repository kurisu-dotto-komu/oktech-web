import type { ReactNode } from "react";
import Button from "@/components/Common/Button";
import AsanohaShader from "./AsanohaShader";
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
  shader?: boolean;
}

export default function Hero({
  title,
  description,
  button,
  slim,
  className,
  children,
  shader,
}: HeroProps) {
  return (
    <div
      data-testid="hero"
      className={clsx(
        "hero",
        slim ? "" : "min-h-[50vh]",
        "bg-primary-content text-primary",
        shader && "relative",
        className,
      )}
    >
      {shader && <AsanohaShader />}
      <div className="hero-content px-12 py-20">
        <div className="text-center flex flex-col gap-16">
          {title && <h1 className="text-5xl font-bold ">{title}</h1>}
          {description && <p className="text-2xl text-primary/70 ">{description}</p>}
          {button && <Button className="btn-xl" {...button} />}
          {children}
        </div>
      </div>
    </div>
  );
}
