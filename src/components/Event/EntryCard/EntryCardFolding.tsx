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
  shadow?: boolean;
  totalRotation?: { x: number; y: number; z: number };
  isAutoHovered?: boolean;
}

function FoldedGrid({
  children,
  seam1Angle,
  seam2Angle,
  shadow,
  totalRotation,
  isAutoHovered,
}: FoldedGridProps) {
  const childArray = React.Children.toArray(children);

  return (
    <div className="flex w-full" style={{ transformStyle: "preserve-3d" }}>
      {childArray.map((child, index) => (
        <EntryCardFold
          key={index}
          child={child}
          index={index}
          seam1Angle={seam1Angle}
          seam2Angle={seam2Angle}
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
    const preset = FOLD_PRESETS[presetIndex % FOLD_PRESETS.length];
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

    // Enforce corner-to-corner alternating pattern: up-down-up-down OR down-up-down-up
    const startWithUp = seededRandom(seed + "pattern") > 0.5;
    const seam1Direction = startWithUp ? -1 : 1; // Both seams same direction
    const seam2Direction = startWithUp ? -1 : 1; // Creates the alternating corner pattern

    // Randomize fold angles with direction using bounds
    const seam1Angle =
      seam1Direction * randomInRange(seed, foldAngleBounds.min, foldAngleBounds.max, 1);
    const seam2Angle =
      seam2Direction * randomInRange(seed, foldAngleBounds.min, foldAngleBounds.max, 2);

    // Randomize rotations using bounds
    const rotationX = randomInRange(seed, rotationBounds.minX, rotationBounds.maxX, 3);
    const rotationY = randomInRange(seed, rotationBounds.minY, rotationBounds.maxY, 4);
    const rotationZ = randomInRange(seed, rotationBounds.minZ, rotationBounds.maxZ, 5);

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

interface EntryCardFoldingProps extends AngleCalculationProps {
  children: React.ReactNode;
  perspectiveDistance?: number;
  autoHoverRange?: {
    start: number; // percentage (0-100)
    end: number; // percentage (0-100)
  };
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
  autoHoverRange = { start: 10, end: 30 },
}: EntryCardFoldingProps) {
  // Memoize angle calculations
  const { seam1Angle, seam2Angle, totalRotation, zoom } = useMemo(
    () =>
      calculateAngles({
        forceAngles,
        presetIndex,
        seedId,
        eventId,
        foldAngleBounds,
        rotationBounds,
        zoomBounds,
      }),
    [forceAngles, presetIndex, seedId, eventId, foldAngleBounds, rotationBounds, zoomBounds],
  );
  const { isInHotspot, elementRef: cardRef } = useScrollHotspot(autoHoverRange);

  return (
    <LinkReact
      href={`/event/${eventId}`}
      ref={cardRef as Ref<HTMLAnchorElement>}
      className={clsx("relative w-full group", { "mobile-hover": isInHotspot })}
      style={{
        perspective: `${perspectiveDistance}px`,
        perspectiveOrigin: "50% 50%",
      }}
    >
      <div
        className={clsx(
          "relative transition-transform duration-500 ease-out-in",
          "group-hover:!transform-none",
          isInHotspot && "!transform-none",
        )}
        style={{
          transformStyle: "preserve-3d",
          transform: isInHotspot
            ? "none"
            : `translateZ(${zoom * 100}px) rotateX(${totalRotation.x}deg) rotateY(${totalRotation.y}deg) rotateZ(${totalRotation.z}deg)`,
        }}
      >
        {/* Main content with fold transforms */}
        <div className="relative z-20" style={{ transformStyle: "preserve-3d" }}>
          <FoldedGrid
            seam1Angle={seam1Angle}
            seam2Angle={seam2Angle}
            totalRotation={totalRotation}
            isAutoHovered={isInHotspot}
          >
            {children}
          </FoldedGrid>
        </div>
        {/* Shadow layer */}
        <div
          className={clsx(
            "absolute z-0 inset-0 transition-transform duration-500 ease-out-in",
            "group-hover:translate-y-0 group-hover:translate-x-0",
            isInHotspot && "translate-y-0 translate-x-0",
          )}
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          <FoldedGrid
            seam1Angle={seam1Angle}
            seam2Angle={seam2Angle}
            shadow
            isAutoHovered={isInHotspot}
          >
            {children}
          </FoldedGrid>
        </div>
      </div>
    </LinkReact>
  );
}
