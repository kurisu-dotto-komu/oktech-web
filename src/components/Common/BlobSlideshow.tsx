import "@/styles/animations.css";

import React, { useEffect, useState } from "react";

import { BLOBS } from "@/utils/blobs";

interface ImageData {
  src: string;
}

interface BlobSlideshowProps<T = string | ImageData> {
  images?: (string | ImageData)[];
  data?: T[];
  renderer?: (item: T, index: number) => React.ReactNode;
  transitionSpeed?: number; // milliseconds for blob morph
  slideDelay?: number; // milliseconds between slides
  className?: string;
  blobs?: string[];
  containerClassName?: string;
}

export default function BlobSlideshow<T = string | ImageData>({
  images,
  data,
  renderer,
  transitionSpeed = 1000,
  slideDelay = 2000,
  className = "",
  blobs = BLOBS,
  containerClassName = "",
}: BlobSlideshowProps<T>) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentBlob, setCurrentBlob] = useState(0);

  // Determine which mode we're in
  const items = data || images || [];
  const isDataMode = !!data && !!renderer;

  // Preload all images (only if in image mode)
  useEffect(() => {
    if (!isDataMode && images) {
      images.forEach((image) => {
        const img = new Image();
        img.src = typeof image === "string" ? image : image.src;
      });
    }
  }, [images, isDataMode]);

  // Synchronize slide and blob transitions
  useEffect(() => {
    if (items.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
      setCurrentBlob((prev) => (prev + 1) % blobs.length);
    }, slideDelay);

    return () => clearInterval(timer);
  }, [items.length, slideDelay, blobs.length]);

  if (items.length === 0) return null;

  // Create unique mask ID to avoid conflicts
  const maskId = `blob-mask-${React.useId()}`;

  return (
    <div className={`relative z-10 h-full w-full ${containerClassName || "aspect-[4/3]"}`}>
      <div className="absolute inset-0 -mx-20 -my-10 md:-mx-16 md:-my-16 lg:-mx-12 lg:-my-12">
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
          {isDataMode
            ? // Render custom data with renderer
              data!.map((item, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-[1000ms] ${
                    index === currentIndex ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {renderer!(item, index)}
                </div>
              ))
            : // Render images
              images!.map((image, index) => {
                const isString = typeof image === "string";
                const src = isString ? image : image.src;

                return (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-[1000ms] ${
                      index === currentIndex ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <img src={src} alt="" className="absolute inset-0 h-full w-full object-cover" />
                  </div>
                );
              })}
        </div>
      </div>
    </div>
  );
}
