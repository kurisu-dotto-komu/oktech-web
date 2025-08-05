import "@/styles/animations.css";

import React, { useEffect, useState } from "react";

import { DEFAULT_SLIDESHOW_BLOBS } from "@/utils/blobs";

interface ImageData {
  src: string;
}

interface BlobSlideshowProps {
  images: (string | ImageData)[];
  transitionSpeed?: number; // milliseconds for blob morph
  slideDelay?: number; // milliseconds between slides
  className?: string;
  blobs?: string[];
  containerClassName?: string;
}

export default function BlobSlideshow({
  images,
  transitionSpeed = 1000,
  slideDelay = 3000,
  className = "",
  blobs = DEFAULT_SLIDESHOW_BLOBS,
  containerClassName = "",
}: BlobSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentBlob, setCurrentBlob] = useState(0);

  // Preload all images
  useEffect(() => {
    images.forEach((image) => {
      const img = new Image();
      img.src = typeof image === "string" ? image : image.src;
    });
  }, [images]);

  // Synchronize slide and blob transitions
  useEffect(() => {
    if (images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
      setCurrentBlob((prev) => (prev + 1) % blobs.length);
    }, slideDelay);

    return () => clearInterval(timer);
  }, [images.length, slideDelay]);

  if (images.length === 0) return null;

  // Create unique mask ID to avoid conflicts
  const maskId = `blob-mask-${React.useId()}`;

  return (
    <div className={`relative h-full w-full ${containerClassName || "aspect-[4/3]"}`}>
      <div className="animate-floating absolute inset-0">
        <svg width={0} height={0}>
          <defs>
            <mask
              id={maskId}
              maskUnits="objectBoundingBox"
              maskContentUnits="objectBoundingBox"
              x="0"
              y="0"
              width="1"
              height="1"
            >
              <rect x="0" y="0" width="1" height="1" fill="black" />
              <path
                fill="white"
                transform="translate(0 0) scale(0.01)"
                d={blobs[currentBlob]}
                style={{ transition: `d ${transitionSpeed}ms cubic-bezier(0.68,-0.55,0.265,1.55)` }}
              />
            </mask>
          </defs>
        </svg>
        <div className={`absolute inset-0 ${className}`} style={{ mask: `url(#${maskId})` }}>
          {images.map((image, index) => {
            const isString = typeof image === "string";
            const src = isString ? image : image.src;

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
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
