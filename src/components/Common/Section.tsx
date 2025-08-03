import type { ReactNode } from "react";

import Button from "./Button";
import Container from "./Container";
import Lorem from "./Lorem";

function StripedBackground() {
  const patternStyles = {
    "--s": "60px",
    "--c1": "#000000",
    "--c2": "#ffffff",
    "--_g": "radial-gradient(25% 25% at 25% 25%, var(--c1) 99%, rgba(0, 0, 0, 0) 101%)",
    background: `var(--_g) var(--s) var(--s) / calc(2 * var(--s)) calc(2 * var(--s)), var(--_g) 0 0 / calc(2 * var(--s)) calc(2 * var(--s)), radial-gradient(50% 50%, var(--c2) 98%, rgba(0, 0, 0, 0)) 0 0 / var(--s) var(--s), repeating-conic-gradient(var(--c2) 0 50%, var(--c1) 0 100%) calc(0.5 * var(--s)) 0 / calc(2 * var(--s)) var(--s)`,
  } as React.CSSProperties;

  return (
    <div
      className="absolute inset-0 opacity-20 mix-blend-lighten"
      style={patternStyles}
      aria-hidden="true"
    />
  );
}

interface Props {
  anchor?: string;
  button?: any;
  buttonClass?: string;
  title?: string;
  description?: string;
  left?: boolean;
  className?: string;
  class?: string;
  split?: boolean;
  wide?: boolean;
  markdown?: string;
  lorem?: boolean | number;
  inline?: boolean;
  grid?: boolean;
  children?: ReactNode;
  element?: ReactNode;
  variant?: "default" | "striped";
}

export default function Section({
  anchor,
  button,
  buttonClass,
  title,
  description,
  left,
  className,
  split,
  wide,
  markdown,
  lorem,
  inline,
  grid,
  children,
  element,
  variant = "default",
}: Props) {
  const finalClassName = className || "";

  const generatedContent = title || description || markdown || button || lorem;
  const secondContainer = wide || grid;
  const firstContainer = !secondContainer || generatedContent;

  const variantClasses = {
    default: "",
    striped: "relative overflow-hidden my-16 bg-primary dark:text-black",
  };

  return (
    <section
      className={`flex flex-col gap-12 ${variant === "striped" ? "py-24" : "py-18"} ${variantClasses[variant]} ${finalClassName}`}
      style={variant === "striped" ? { clipPath: "polygon(0 15%, 100% 0, 100% 85%, 0 100%)" } : {}}
      id={anchor}
      data-testid="section"
    >
      {variant === "striped" && <StripedBackground />}
      {firstContainer && (
        <Container
          className={`relative z-10 ${split ? "grid items-center gap-12 md:grid-cols-2 lg:gap-24" : ""} ${
            left ? "md:[&>*:first-child]:order-2 md:[&>*:last-child]:order-1" : ""
          }`}
        >
          {generatedContent && (
            <div
              className={`mx-6 lg:mx-0 ${
                split ? "m-auto flex max-w-xl flex-col gap-6 text-lg" : ""
              } ${inline ? "flex flex-row items-center justify-between gap-4 lg:gap-12" : ""} ${
                !split && !inline ? "mx-auto max-w-4xl text-center" : ""
              }`}
            >
              {title && (
                <div
                  className={`flex items-center justify-between gap-2 ${!inline ? "mb-4" : ""} ${
                    !inline && !element ? "justify-center" : ""
                  }`}
                >
                  <h2 className="text-3xl font-bold" data-testid="section-title">
                    {title}
                  </h2>
                  {element}
                </div>
              )}
              <div
                className={`flex flex-col gap-6 ${!split && !inline && button ? "items-center" : ""}`}
              >
                {description && (
                  <p className={split || (!split && !inline) ? "text-justify text-pretty" : ""}>
                    {description}
                  </p>
                )}
                {markdown && (
                  <div className={split || (!split && !inline) ? "text-justify text-pretty" : ""}>
                    TODO: RENDER: {markdown}
                  </div>
                )}
                {button && <Button {...button} />}
              </div>
            </div>
          )}
          {!secondContainer && children}
        </Container>
      )}
      {secondContainer && (
        <Container wide={wide} grid={grid} className="relative z-10">
          {children}
        </Container>
      )}
    </section>
  );
}
