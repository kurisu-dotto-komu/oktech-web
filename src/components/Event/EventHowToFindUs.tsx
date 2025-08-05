import clsx from "clsx";

interface Props {
  howToFindUs: string;
  horizontal?: boolean;
}

export default function HowToFindUs({ howToFindUs, horizontal = false }: Props) {
  return (
    <div className={clsx("glass-card px-6 py-4 text-sm")}>
      <b className="mr-1">How to find us: </b>
      {howToFindUs}
    </div>
  );
}
