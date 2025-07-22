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
    <figure className={`w-full h-full relative ${finalClassName}`}>
      {mapImage ? (
        <img
          src={mapImage.default.src}
          alt="Venue location map"
          className="w-full h-full object-cover"
          width={1024}
          height={1024}
        />
      ) : (
        <div className="w-full h-full min-h-[200px] bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
          <LuMapPin className="w-16 h-16 text-base-content/20" />
        </div>
      )}
      {marker && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {typeof marker === "string" && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2">
                <div className="bg-base-100/90 px-3 py-1 rounded-lg shadow-md whitespace-nowrap">
                  <span className="text-base font-medium text-base-content">{marker}</span>
                </div>
              </div>
            )}
            <div className="text-primary-dark bg-base-100/70 rounded-full p-2">
              <LuMapPin className="w-6 h-6" />
            </div>
          </div>
        </div>
      )}
    </figure>
  );
}
