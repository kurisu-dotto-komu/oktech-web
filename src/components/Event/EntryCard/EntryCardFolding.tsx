import React, { useMemo, type Ref } from "react";
import clsx from "clsx";
import { seededRandom, randomInRange } from "@/utils/random";
import { useScrollHotspot } from "@/utils/useScrollHotspot";
import EntryCardFold from "./EntryCardFold";
import LinkReact from "@/components/Common/LinkReact";

interface FoldedGridProps {
  children: React.ReactNode;
  seam1Angle: number;
  seam2Angle: number;
  mobileSeam1Angle?: number;
  mobileSeam2Angle?: number;
  shadow?: boolean;
  totalRotation?: { x: number; y: number; z: number };
  isAutoHovered?: boolean;
}

function FoldedGrid({
  children,
  seam1Angle,
  seam2Angle,
  mobileSeam1Angle,
  mobileSeam2Angle,
  shadow,
  totalRotation,
  isAutoHovered,
}: FoldedGridProps) {
  const childArray = React.Children.toArray(children);

  return (
    <div className="flex flex-col md:flex-row w-full" style={{ transformStyle: "preserve-3d" }}>
      {childArray.map((child, index) => (
        <EntryCardFold
          key={index}
          child={child}
          index={index}
          seam1Angle={seam1Angle}
          seam2Angle={seam2Angle}
          mobileSeam1Angle={mobileSeam1Angle || seam1Angle}
          mobileSeam2Angle={mobileSeam2Angle || seam2Angle}
          shadow={shadow}
          totalRotation={totalRotation}
          isAutoHovered={isAutoHovered}
        />
      ))}
    </div>
  );
}

// Predefined presets: [seam1Angle, seam2Angle, rotationX, rotationY, rotationZ, zoom]
// zoom: 0 = normal, negative = push back, positive = pull forward
export const FOLD_PRESETS = [
  [45, 35, -10, -15, -2, 0],
  [-45, -35, 10, 25, 1, -1],
  [-25, -25, -10, 10, -1, -1],
  [-25, -25, -10, 10, 1, 0],
  [25, 25, 10, -20, 1, 0],
];

// Mobile presets for vertical layout: [seam1Angle, seam2Angle, rotationX, rotationY, rotationZ, zoom]
export const FOLD_PRESETS_MOBILE = [
  [35, 45, -15, -10, -1, 0],
  [-35, -45, 15, 10, 1, -1],
  [-25, -25, -5, 15, -1, -1],
  [-25, -25, -5, 15, 1, 0],
  [25, 25, 5, -15, 1, 0],
];

export interface AngleCalculationProps {
  forceAngles?: {
    seam1Angle: number;
    seam2Angle: number;
    totalRotation: { x: number; y: number; z: number };
    zoom?: number;
  };
  presetIndex?: number;
  seedId?: string;
  eventId: string;
  foldAngleBounds?: {
    min: number;
    max: number;
  };
  rotationBounds?: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    minZ: number;
    maxZ: number;
  };
  zoomBounds?: {
    min: number;
    max: number;
  };
  isMobile?: boolean;
}

export interface CalculatedAngles {
  seam1Angle: number;
  seam2Angle: number;
  totalRotation: {
    x: number;
    y: number;
    z: number;
  };
  zoom: number;
}

export function calculateAngles({
  forceAngles,
  presetIndex,
  seedId,
  eventId,
  foldAngleBounds = { min: 20, max: 30 },
  rotationBounds = {
    minX: 5,
    maxX: 12,
    minY: 5,
    maxY: 15,
    minZ: -2,
    maxZ: 2,
  },
  zoomBounds = { min: -0.3, max: 0.1 },
  isMobile = false,
}: AngleCalculationProps): CalculatedAngles {
  if (forceAngles) {
    // Priority 1: Use forced angles for precise control
    return {
      seam1Angle: forceAngles.seam1Angle,
      seam2Angle: forceAngles.seam2Angle,
      totalRotation: forceAngles.totalRotation,
      zoom: forceAngles.zoom ?? 0,
    };
  } else if (presetIndex !== undefined) {
    // Priority 2: Use preset based on index
    const presets = isMobile ? FOLD_PRESETS_MOBILE : FOLD_PRESETS;
    const preset = presets[presetIndex % presets.length];
    return {
      seam1Angle: preset[0],
      seam2Angle: preset[1],
      totalRotation: {
        x: preset[2],
        y: preset[3],
        z: preset[4],
      },
      zoom: preset[5],
    };
  } else {
    // Priority 3: Use seed for randomization (either provided seedId or event.id)
    const seed = seedId || eventId;

    // Adjust bounds for mobile
    const mobileFoldBounds = { min: 15, max: 25 };
    const mobileRotationBounds = {
      minX: 3,
      maxX: 8,
      minY: 5,
      maxY: 12,
      minZ: -1,
      maxZ: 1,
    };

    const actualFoldBounds = isMobile ? mobileFoldBounds : foldAngleBounds;
    const actualRotationBounds = isMobile ? mobileRotationBounds : rotationBounds;

    // Enforce corner-to-corner alternating pattern: up-down-up-down OR down-up-down-up
    const startWithUp = seededRandom(seed + "pattern") > 0.5;
    const seam1Direction = startWithUp ? -1 : 1; // Both seams same direction
    const seam2Direction = startWithUp ? -1 : 1; // Creates the alternating corner pattern

    // Randomize fold angles with direction using bounds
    const seam1Angle =
      seam1Direction * randomInRange(seed, actualFoldBounds.min, actualFoldBounds.max, 1);
    const seam2Angle =
      seam2Direction * randomInRange(seed, actualFoldBounds.min, actualFoldBounds.max, 2);

    // Randomize rotations using bounds
    const rotationX = randomInRange(seed, actualRotationBounds.minX, actualRotationBounds.maxX, 3);
    const rotationY = randomInRange(seed, actualRotationBounds.minY, actualRotationBounds.maxY, 4);
    const rotationZ = randomInRange(seed, actualRotationBounds.minZ, actualRotationBounds.maxZ, 5);

    // Randomize zoom using bounds
    const zoom = randomInRange(seed, zoomBounds.min, zoomBounds.max, 6);

    return {
      seam1Angle,
      seam2Angle,
      totalRotation: {
        x: rotationX,
        y: rotationY,
        z: rotationZ,
      },
      zoom,
    };
  }
}

interface TransformedLayerProps {
  children: React.ReactNode;
  desktopAngles: CalculatedAngles;
  mobileAngles: CalculatedAngles;
  perspectiveDistance: number;
  isHovered: boolean;
  className?: string;
  shadow?: boolean;
}

function TransformedLayer({
  children,
  desktopAngles,
  mobileAngles,
  perspectiveDistance,
  isHovered,
  className,
  shadow = false,
}: TransformedLayerProps) {
  return (
    <div
      className={className}
      style={{
        perspective: `${perspectiveDistance}px`,
        perspectiveOrigin: "50% 50%",
      }}
    >
      <div
        className={clsx(
          "entry-card-wrapper",
          "relative transition-transform duration-500 ease-out-in",
          "group-hover:!transform-none",
          isHovered && "!transform-none",
        )}
        style={
          {
            "--desktop-transform": `translateZ(${desktopAngles.zoom * 100}px) rotateX(${desktopAngles.totalRotation.x}deg) rotateY(${desktopAngles.totalRotation.y}deg) rotateZ(${desktopAngles.totalRotation.z}deg)`,
            "--mobile-transform": `translateZ(${mobileAngles.zoom * 100}px) rotateX(${mobileAngles.totalRotation.x}deg) rotateY(${mobileAngles.totalRotation.y}deg) rotateZ(${mobileAngles.totalRotation.z}deg)`,
            transformStyle: "preserve-3d",
            transform: isHovered ? "none" : "var(--desktop-transform)",
          } as React.CSSProperties
        }
      >
        <FoldedGrid
          seam1Angle={desktopAngles.seam1Angle}
          seam2Angle={desktopAngles.seam2Angle}
          mobileSeam1Angle={mobileAngles.seam1Angle}
          mobileSeam2Angle={mobileAngles.seam2Angle}
          shadow={shadow}
          totalRotation={shadow ? undefined : desktopAngles.totalRotation}
          isAutoHovered={isHovered}
        >
          {children}
        </FoldedGrid>
      </div>
    </div>
  );
}

interface EntryCardFoldingProps extends AngleCalculationProps {
  children: React.ReactNode;
  perspectiveDistance?: number;
}

export default function EntryCardFolding({
  children,
  forceAngles,
  presetIndex,
  seedId,
  eventId,
  foldAngleBounds,
  rotationBounds,
  zoomBounds,
  perspectiveDistance = 800,
}: EntryCardFoldingProps) {
  // Calculate angles for both desktop and mobile
  const desktopAngles = useMemo(
    () =>
      calculateAngles({
        forceAngles,
        presetIndex,
        seedId,
        eventId,
        foldAngleBounds,
        rotationBounds,
        zoomBounds,
        isMobile: false,
      }),
    [forceAngles, presetIndex, seedId, eventId, foldAngleBounds, rotationBounds, zoomBounds],
  );

  const mobileAngles = useMemo(
    () =>
      calculateAngles({
        forceAngles,
        presetIndex,
        seedId,
        eventId,
        foldAngleBounds,
        rotationBounds,
        zoomBounds,
        isMobile: true,
      }),
    [forceAngles, presetIndex, seedId, eventId, foldAngleBounds, rotationBounds, zoomBounds],
  );

  const { isInHotspot, elementRef: cardRef } = useScrollHotspot();

  return (
    <LinkReact
      href={`/event/${eventId}`}
      ref={cardRef as Ref<HTMLAnchorElement>}
      className={clsx("relative w-full group", { "mobile-hover": isInHotspot })}
    >
      {/* Shadow layer - separate 3D context */}
      <TransformedLayer
        className="absolute inset-0 z-0"
        desktopAngles={desktopAngles}
        mobileAngles={mobileAngles}
        perspectiveDistance={perspectiveDistance}
        isHovered={isInHotspot}
        shadow
      >
        {children}
      </TransformedLayer>

      {/* Main content - separate 3D context */}
      <TransformedLayer
        className="relative z-20"
        desktopAngles={desktopAngles}
        mobileAngles={mobileAngles}
        perspectiveDistance={perspectiveDistance}
        isHovered={isInHotspot}
      >
        {children}
      </TransformedLayer>
    </LinkReact>
  );
}
