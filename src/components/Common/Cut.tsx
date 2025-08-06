import clsx from "clsx";

export default function Cut({
  position = "both",
  className = "py-24",
  bgClass = "bg-primary/20",
  children,
}: {
  position?: "top" | "bottom" | "both";
  children: React.ReactNode;
  bgClass?: string;
  className?: string;
}) {
  return (
    <div className={clsx("relative", className)}>
      <div
        className={clsx(
          "cut-inset",
          position === "both" && "cut",
          position === "top" && "cut-top",
          position === "bottom" && "cut-bottom",
          bgClass,
        )}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
