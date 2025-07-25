import type { ReactNode } from "react";
import Button from "@/components/Common/Button";
import ShaderRenderer from "./ShaderRenderer";
import asanohaShader from "@/shaders/asanoha.frag?raw";
import cyberShader from "@/shaders/cyber.frag?raw";
import seascapeShader from "@/shaders/seascape.frag?raw";
import hypnoticShader from "@/shaders/hypnotic.frag?raw";
import mandelbrotShader from "@/shaders/mandelbrot.frag?raw";
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
      className={clsx(
        "hero",
        slim ? "" : "min-h-[70vh]",
        "bg-primary-content text-primary",
        shader && "relative",
        className,
      )}
    >
      {shader && (
        <ShaderRenderer
          fragmentShader={[
            asanohaShader,
            cyberShader,
            seascapeShader,
            hypnoticShader,
            mandelbrotShader,
          ]}
        />
      )}
      <div className="hero-content px-12 py-20">
        <div className="max-w-xl text-center text-pretty flex flex-col gap-16 bg-base-100/90  p-14 rounded-2xl">
          {title && <h1 className="text-5xl font-bold ">{title}</h1>}
          {description && <p className="text-2xl text-primary/70 ">{description}</p>}
          {button && <Button className="btn-xl" {...button} />}
          {children}
        </div>
      </div>
    </div>
  );
}
