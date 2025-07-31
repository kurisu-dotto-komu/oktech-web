import type { ReactNode } from "react";
import Container from "./Container";
import Lorem from "./Lorem";
import Button from "./Button";

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
  class: classFromAstro,
  split,
  wide,
  markdown,
  lorem,
  inline,
  grid,
  children,
  element,
}: Props) {
  const finalClassName = className || classFromAstro || "";

  const generatedContent = title || description || markdown || button || lorem;
  const secondContainer = wide || grid;
  const firstContainer = !secondContainer || generatedContent;

  return (
    <section className={`py-18 flex flex-col gap-12 ${finalClassName}`} id={anchor}>
      {firstContainer && (
        <Container
          className={`${split ? "grid md:grid-cols-2 gap-12 lg:gap-24 items-center" : ""} ${
            left ? "md:[&>*:first-child]:order-2 md:[&>*:last-child]:order-1" : ""
          }`}
        >
          {generatedContent && (
            <div
              className={`mx-6 lg:mx-0 ${
                split ? "max-w-xl m-auto text-lg flex flex-col gap-6" : ""
              } ${inline ? "flex flex-row gap-4 lg:gap-12 justify-between items-center" : ""}`}
            >
              {title && (
                <div className={`flex items-center justify-between gap-2 ${!inline ? "mb-4" : ""}`}>
                  <h2 className="text-3xl font-bold">{title}</h2>
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
