export interface EventCityProps {
  city: string;
  className?: string;
  class?: string;
}

export default function EventCity({ city, className, class: classFromAstro }: EventCityProps) {
  const finalClassName = className || classFromAstro || "";
  const cityNames = {
    osaka: "Osaka",
    kyoto: "Kyoto",
    kobe: "Kobe",
  };

  const displayName = cityNames[city.toLowerCase() as keyof typeof cityNames] || city;
  const cityClass = `city-${city.toLowerCase()}`;

  return <span className={`badge ${cityClass} ${finalClassName}`.trim()}>{displayName}</span>;
}
