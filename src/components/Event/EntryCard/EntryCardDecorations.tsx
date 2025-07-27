export function EntryCardOfficial({ top, bottom }: { top: string; bottom: string }) {
  return (
    <div className="text-xs text-primary border-l border-primary pl-3 flex flex-col whitespace-nowrap">
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
    <div className="flex gap-2 justify-between select-none">
      <EntryCardOfficial top={top} bottom={bottom} />
      <div className="text-xs pr-2 opacity-50">{text}</div>
    </div>
  );
}

export function EntryCardHeader({ text, description }: { text: string; description: string }) {
  return (
    <div className="flex flex-col select-none pl-10 pt-1 px-2">
      <div className="text-xs text-left opacity-50">{description}</div>
      <h3 className="text-lg text-right font-mono text-primary font-bold">{text}</h3>
    </div>
  );
}
