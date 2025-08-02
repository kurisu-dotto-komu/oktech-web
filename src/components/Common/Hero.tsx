import type { ReactNode } from "react";

import clsx from "clsx";

import Button from "@/components/Common/Button";

import AsanohaShader from "./AsanohaShader";

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
      className={clsx("py-20", slim ? "" : "min-h-[50vh]", shader && "relative", className)}
    >
      {shader && <AsanohaShader />}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
