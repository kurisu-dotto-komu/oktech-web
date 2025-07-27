import clsx from "clsx";

export default function EntryCardPanel({
  children,
  className,
  cut = false,
  shade = 0,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  cut?: boolean;
  shade?: number;
  style?: React.CSSProperties;
}) {
  return (
    <div className={clsx("bg-base-100 relative overflow-hidden", className)} style={style}>
      <div className="flex flex-col w-full h-full relative">{children}</div>
      {/* Cut corner effect */}
      {cut && (
        <div className="absolute top-0 left-0 w-0 h-0 border-t-[30px] border-t-base-200 border-r-[30px] border-r-transparent z-10" />
      )}
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
