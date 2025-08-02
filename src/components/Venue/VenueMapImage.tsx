import { LuMapPin } from "react-icons/lu";

interface Props {
  mapImage?: { default: { src: string } } | null;
  marker?: boolean | string;
  className?: string;
  class?: string;
}

export default function VenueMapImage({
  mapImage,
  marker,
  className,
  class: classFromAstro,
}: Props) {
  const finalClassName = className || classFromAstro || "";

  return (
    <figure className={`relative h-full w-full ${finalClassName}`}>
      {mapImage ? (
        <img
          src={mapImage.default.src}
          alt="Venue location map"
          className="h-full w-full object-cover"
          width={1024}
          height={1024}
        />
      ) : (
        <div className="from-primary/20 to-secondary/20 flex h-full min-h-[200px] w-full items-center justify-center bg-gradient-to-br">
          <LuMapPin className="text-base-content/20 h-16 w-16" />
        </div>
      )}
      {marker && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {typeof marker === "string" && (
              <div className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 transform">
                <div className="bg-base-100/90 max-w-[200px] rounded-lg px-3 py-1 shadow-md">
                  <span className="text-base-content block truncate text-base font-medium">
                    {marker}
                  </span>
                </div>
              </div>
            )}
            <div className="text-primary-dark bg-base-100/70 rounded-full p-2">
              <LuMapPin className="h-6 w-6" />
            </div>
          </div>
        </div>
      )}
    </figure>
  );
}
