import React from "react";

import clsx from "clsx";

import { DEFAULT_SLIDESHOW_BLOBS, LANDING_HERO_BLOBS } from "@/utils/blobs";

interface BlobCardProps {
  children: React.ReactNode;
  preset?: number;
  className?: string;
  bgColor?: string;
  hoverBgColor?: string;
}

const BLOBS = [
  DEFAULT_SLIDESHOW_BLOBS[1],
  LANDING_HERO_BLOBS[2],
  LANDING_HERO_BLOBS[4],
  LANDING_HERO_BLOBS[5],
  DEFAULT_SLIDESHOW_BLOBS[2],
];

export default function BlobCard({ children, preset = 0, className = "" }: BlobCardProps) {
  const maskId = `blob-card-${React.useId()}`;
  const blobIndex = preset % BLOBS.length;
  const blobPath = BLOBS[blobIndex];

  console.log(preset, blobIndex, blobPath);

  return (
    <div className={`group relative drop-shadow-lg transition-all duration-300 ${className}`}>
      <svg width={0} height={0} className="absolute">
        <defs>
          <mask id={maskId} maskUnits="objectBoundingBox" maskContentUnits="objectBoundingBox">
            <rect x="0" y="0" width="1" height="1" fill="black" />
            <path fill="white" transform="translate(0 0) scale(0.01)" d={blobPath} />
          </mask>
        </defs>
      </svg>
      <div
        className={clsx(
          `bg-primary/20 group-hover:bg-primary/40 text-primary-content transition-all duration-600`,
          className,
        )}
        style={{
          mask: `url(#${maskId})`,
          WebkitMask: `url(#${maskId})`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
