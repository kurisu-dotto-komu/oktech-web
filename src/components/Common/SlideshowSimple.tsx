import { useEffect, useState } from "react";

interface ImageSlideshowProps {
  images: string[];
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
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
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
      {images.map((image, index) => (
        <img
          key={index}
          src={image}
          alt="OKTech community gathering"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1000ms] ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </div>
  );
}
