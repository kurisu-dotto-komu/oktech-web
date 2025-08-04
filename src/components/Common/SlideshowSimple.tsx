import { useEffect, useState } from "react";

interface ImageData {
  src: string;
  zoom?: string;
  objectPosition?: string;
}

interface ImageSlideshowProps {
  images: (string | ImageData)[];
  className?: string;
  interval?: number;
}

export default function ImageSlideshow({
  images,
  className = "",
  interval = 3000,
}: ImageSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Preload all images
  useEffect(() => {
    images.forEach((image) => {
      const img = new Image();
      img.src = typeof image === "string" ? image : image.src;
    });
  }, [images]);

  useEffect(() => {
    if (images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  if (images.length === 0) return null;
  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`}>
      {images.map((image, index) => {
        const isString = typeof image === "string";
        const src = isString ? image : image.src;
        const zoom = isString ? undefined : image.zoom;
        const objectPosition = isString ? undefined : image.objectPosition;

        return (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-[1000ms] ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={src}
              alt="OKTech community gathering"
              className="absolute inset-0 h-full w-full object-cover"
              style={{
                transform: zoom ? `scale(${zoom})` : undefined,
                objectPosition: objectPosition || "center",
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
