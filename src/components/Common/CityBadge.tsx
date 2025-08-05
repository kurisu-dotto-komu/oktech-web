import clsx from "clsx";

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

interface CityBadgeProps {
  city: string | undefined;
  className?: string;
}

export default function CityBadge({ city, className }: CityBadgeProps) {
  if (!city) return null;

  const cityLower = city.toLowerCase();
  return (
    <span
      className={clsx(
        cityLower === "osaka" && "badge badge-primary",
        cityLower === "kyoto" && "badge badge-secondary",
        cityLower === "kobe" && "badge badge-accent",
        className,
      )}
    >
      {capitalize(city)}
    </span>
  );
}
