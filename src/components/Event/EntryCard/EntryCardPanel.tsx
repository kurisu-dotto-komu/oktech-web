import React from "react";
import clsx from "clsx";

export default function EntryCardPanel({
  children,
  className,
  cut = false,
  shade = 0,
  shadow = false,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  cut?: boolean;
  shade?: number;
  shadow?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={clsx(
        "bg-base-200 group-hover:bg-base-100  relative ",
        className,
        className?.includes("auto-hover") && "!bg-base-100",
      )}
      style={style}
    >
      {/* Cut corner effect */}
      {cut && (
        <div className="absolute top-0 left-0 w-0 h-0 border-t-[40px] border-t-base-300 border-r-[40px] border-r-transparent z-10 -mt-0 md:-mt-2 -ml-2 md:ml-0" />
      )}
      <div className="flex flex-col w-full h-full relative overflow-hidden">
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<{ shadow?: boolean }>, {
              shadow,
            });
          }
          return child;
        })}
      </div>
      {/* Shade overlay */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500 ease-out-in group-hover:!opacity-0 [.auto-hover_&]:!opacity-0 z-[9]"
        style={{
          backgroundColor: `rgba(0, 0, 0, ${shade || 0})`,
          opacity: shade > 0 ? 1 : 0,
        }}
      />
    </div>
  );
}
