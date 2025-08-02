export function EntryCardOfficial({ top, bottom }: { top: string; bottom: string }) {
  return (
    <div className="text-primary border-primary flex flex-col border-l pl-3 text-xs whitespace-nowrap">
      <div>{top}</div>
      <div>{bottom}</div>
    </div>
  );
}

export function EntryCardFooter({
  text,
  top,
  bottom,
}: {
  text?: string;
  top: string;
  bottom: string;
}) {
  return (
    <div className="flex justify-between gap-2 whitespace-nowrap opacity-50 select-none">
      <EntryCardOfficial top={top} bottom={bottom} />
      <div className="pr-2 text-xs">{text}</div>
    </div>
  );
}

export function EntryCardHeader({ text, description }: { text: string; description: string }) {
  return (
    <div className="flex flex-col px-2 pt-1 pl-10 opacity-50 select-none">
      <div className="text-left text-xs whitespace-nowrap">{description}</div>
      <h3 className="text-primary text-right font-mono text-lg font-bold whitespace-nowrap">
        {text}
      </h3>
    </div>
  );
}
