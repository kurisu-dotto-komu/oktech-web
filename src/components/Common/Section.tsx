import type { ReactNode } from "react";

import Button from "./Button";
import Container from "./Container";
import Lorem from "./Lorem";

interface Props {
  anchor?: string;
  button?: any;
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
}

export default function Section({
  anchor,
  button,
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
}: Props) {
  const finalClassName = className || "";

  const generatedContent = title || description || markdown || button || lorem;
  const secondContainer = wide || grid;
  const firstContainer = !secondContainer || generatedContent;

  return (
    <section
      className={`flex flex-col gap-12 py-18 ${finalClassName}`}
      id={anchor}
      data-testid="section"
    >
      {firstContainer && (
        <Container
          className={`${split ? "grid items-center gap-12 md:grid-cols-2 lg:gap-24" : ""} ${
            left ? "md:[&>*:first-child]:order-2 md:[&>*:last-child]:order-1" : ""
          }`}
        >
          {generatedContent && (
            <div
              className={`mx-6 lg:mx-0 ${
                split ? "m-auto flex max-w-xl flex-col gap-6 text-lg" : ""
              } ${inline ? "flex flex-row items-center justify-between gap-4 lg:gap-12" : ""}`}
            >
              {title && (
                <div className={`flex items-center justify-between gap-2 ${!inline ? "mb-4" : ""}`}>
                  <h2 className="text-3xl font-bold" data-testid="section-title">
                    {title}
                  </h2>
                  {element}
                </div>
              )}
              <div className="flex flex-col gap-6">
                {description && <p>{description}</p>}
                {markdown && <div>TODO: RENDER: {markdown}</div>}
                {lorem && <Lorem count={typeof lorem === "number" ? lorem : undefined} />}
                {button && <Button {...button} />}
              </div>
            </div>
          )}
          {!secondContainer && children}
        </Container>
      )}
      {secondContainer && (
        <Container wide={wide} grid={grid}>
          {children}
        </Container>
      )}
    </section>
  );
}
