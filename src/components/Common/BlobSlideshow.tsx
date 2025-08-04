import "@/styles/animations.css";

import React, { useEffect, useState } from "react";

import { scalePathTo100 } from "@/utils/scalePathTo100";

// Define blob shapes to cycle through
// https://www.blobmaker.app/
const DEFAULT_BLOBS = [
  "M55,-20C60,3,50,28,30,42C10,56,-20,60,-40,48C-60,36,-65,8,-55,-15C-45,-38,-25,-55,5,-54C35,-53,50,-43,55,-20Z",
  "M50,-25C58,0,48,25,28,40C8,55,-22,60,-42,50C-62,40,-67,15,-57,-10C-47,-35,-27,-60,3,-58C33,-56,42,-50,50,-25Z",
  "M60,-22C67,2,52,30,32,45C12,60,-18,62,-38,52C-58,42,-63,12,-53,-12C-43,-36,-23,-54,7,-52C37,-50,53,-46,60,-22Z",
].map(scalePathTo100);

interface ImageData {
  src: string;
  zoom?: string;
  objectPosition?: string;
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

  console.log({ blobs });
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
      </div>
    </div>
  );
}
