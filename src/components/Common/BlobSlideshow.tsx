import "@/styles/animations.css";

import React, { useEffect, useState } from "react";

// Created with blobmaker.com, then scaled with scripts/precompute-blobs.ts
const DEFAULT_BLOBS = [
  "M96.00,32.00C100.00,50.40,92.00,70.40,76.00,81.60C60.00,92.80,36.00,96.00,20.00,86.40C4.00,76.80,0.00,54.40,8.00,36.00C16.00,17.60,32.00,4.00,56.00,4.80C80.00,5.60,92.00,13.60,96.00,32.00Z",
  "M93.60,30.00C100.00,50.00,92.00,70.00,76.00,82.00C60.00,94.00,36.00,98.00,20.00,90.00C4.00,82.00,0.00,62.00,8.00,42.00C16.00,22.00,32.00,2.00,56.00,3.60C80.00,5.20,87.20,10.00,93.60,30.00Z",
  "M94.62,30.00C100.00,48.46,88.46,70.00,73.08,81.54C57.69,93.08,34.62,94.62,19.23,86.92C3.85,79.23,0.00,56.15,7.69,37.69C15.38,19.23,30.77,5.38,53.85,6.92C76.92,8.46,89.23,11.54,94.62,30.00Z",
];

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
  blobs = DEFAULT_BLOBS,
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
