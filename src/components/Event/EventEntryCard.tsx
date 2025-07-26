import React, { useEffect, useRef, useState } from "react";
import type { EventEnriched } from "@/content";
import clsx from "clsx";

interface Props {
  event: EventEnriched;
  forceAngles?: {
    seam1Angle: number;
    seam2Angle: number;
    totalRotation: { x: number; y: number; z: number };
  };
  presetIndex?: number; // Index to select from predefined presets
  seedId?: string; // Seed for randomization
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
}

interface FooterProps {
  text?: string;
  description?: string;
}

function EntryCardInfo({ event }: { event: EventEnriched }) {
  return <div className="h-10 overflow-hidden">{JSON.stringify(event, null, 2)}</div>;
}

function EntryCardFooter({ text }: FooterProps) {
  return (
    <div className="flex gap-2 justify-between select-none opacity-50">
      <div className="text-xs text-red-400 border-l border-red-400 pl-3 pb-1">
        <div>官用欄</div>
        <div>Official Use Only</div>
      </div>
      <div className="text-xs pr-2">{text}</div>
    </div>
  );
}

interface HeaderProps {
  text: string;
  description: string;
}

function EntryCardHeader({ text, description }: HeaderProps) {
  return (
    <div className="flex flex-col select-none pl-10 pt-1 px-2 opacity-50">
      <div className="text-xs text-left">{description}</div>
      <h3 className="text-lg text-right font-zen text-red-400 font-bold">{text}</h3>
    </div>
  );
}

function EntryContent({ children }: { children: React.ReactNode }) {
  return <div className="h-full border-2 border-base-content/60">{children}</div>;
}

function EntryCardInner({
  children,
  className,
  footer,
  header,
  shade = 0,
  style,
}: {
  children: React.ReactNode;
  header?: HeaderProps;
  footer?: FooterProps;
  className?: string;
  cut?: boolean;
  shade?: number;
  style?: React.CSSProperties;
}) {
  return (
    <div className={clsx("bg-base-100 relative overflow-hidden", className)} style={style}>
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500 ease-out-in group-hover:!opacity-0"
        style={{
          backgroundColor: `rgba(0, 0, 0, ${shade})`,
          opacity: shade > 0 ? 1 : 0,
        }}
      />
      <div className="flex flex-col  h-full relative">
        {header && <EntryCardHeader {...header} />}
        <div className="flex flex-grow flex-col gap-2 mx-2 mb-1.5">{children}</div>
        {footer && <EntryCardFooter {...footer} />}
      </div>
    </div>
  );
}

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
      {childArray.map((child, index) => {
        if (!React.isValidElement(child)) return child;

        // Calculate widths based on grid spans
        const childElement = child as React.ReactElement<{ className?: string }>;
        const spanClass = childElement.props.className?.match(/col-span-(\d+)/)?.[1];
        const span = spanClass ? parseInt(spanClass) : 1;
        const width = `${(span / 12) * 100}%`;

        // Determine fold angle for this panel
        let foldAngle = 0;
        let transformOrigin = "50% 50%";

        if (index === 0) {
          foldAngle = seam1Angle;
          transformOrigin = "100% 50%"; // right edge
        } else if (index === 2) {
          foldAngle = seam2Angle;
          transformOrigin = "0% 50%"; // left edge
        }

        // Calculate natural shading based on surface orientation
        // Light source from above-right-front for natural lighting
        const lightVector = { x: 0.4, y: -0.7, z: 0.6 }; // Normalized vector

        // Convert angles to radians
        const panelRotY = (foldAngle * Math.PI) / 180;
        const cardRotX = totalRotation ? (totalRotation.x * Math.PI) / 180 : 0;
        const cardRotY = totalRotation ? (totalRotation.y * Math.PI) / 180 : 0;
        // const cardRotZ = totalRotation ? (totalRotation.z * Math.PI) / 180 : 0; // Z rotation not used in simplified calculation

        // Calculate panel normal after all rotations
        // Start with forward-facing normal [0, 0, 1]
        let normal = { x: 0, y: 0, z: 1 };

        // Apply panel's individual Y rotation first
        const cosPanel = Math.cos(panelRotY);
        const sinPanel = Math.sin(panelRotY);
        normal = {
          x: sinPanel,
          y: 0,
          z: cosPanel,
        };

        // Apply card's overall rotations (simplified for key effects)
        // Y rotation (horizontal turning)
        const cosCardY = Math.cos(cardRotY);
        const sinCardY = Math.sin(cardRotY);
        const tempX = normal.x * cosCardY + normal.z * sinCardY;
        const tempZ = -normal.x * sinCardY + normal.z * cosCardY;
        normal.x = tempX;
        normal.z = tempZ;

        // X rotation (vertical tilting) - affects Y and Z
        const cosCardX = Math.cos(cardRotX);
        const sinCardX = Math.sin(cardRotX);
        const tempY = normal.y * cosCardX - normal.z * sinCardX;
        const tempZ2 = normal.y * sinCardX + normal.z * cosCardX;
        normal.y = tempY;
        normal.z = tempZ2;

        // Calculate dot product with light vector
        const dotProduct =
          normal.x * lightVector.x + normal.y * lightVector.y + normal.z * lightVector.z;

        // Map dot product to shade intensity
        // Dot product ranges from -1 (facing away) to 1 (facing toward light)
        // We want: facing light = less shade, facing away = more shade
        const baseLightness = 0.65; // How much light hits even shadowed areas
        const shadowStrength = 0.6; // Maximum shadow darkness
        const lightness = baseLightness + (1 - baseLightness) * Math.max(0, dotProduct);
        let shadeOpacity = (1 - lightness) * shadowStrength;

        // Subtle adjustments for each panel position
        if (index === 0) {
          // Left panel: slightly more susceptible to shadows
          shadeOpacity *= 1.2;
        } else if (index === 1) {
          // Middle panel: less shadow variation since it doesn't fold
          shadeOpacity *= 0.8;
        } else if (index === 2) {
          // Right panel: standard shading
          shadeOpacity *= 1.0;
        }

        // Ensure shade is within reasonable bounds
        shadeOpacity = Math.max(0.05, Math.min(0.35, shadeOpacity));

        // Apply fold transforms based on position
        const foldStyle: React.CSSProperties = {
          transform: `rotateY(${foldAngle}deg)`,
          transformOrigin,
          transformStyle: "preserve-3d" as const,
          width,
          position: "relative" as const,
        };

        const element = child as React.ReactElement<{
          style?: React.CSSProperties;
          className?: string;
          cut?: boolean;
          shade?: number;
        }>;

        // Remove col-span classes since we're using flex
        const newClassName = element.props.className?.replace(/col-span-\d+/, "").trim() || "";

        // Apply cut effect if the element has the cut prop
        const cutClasses = element.props.cut
          ? "after:absolute after:top-0 after:left-0 after:w-0 after:h-0 after:border-t-[30px] after:border-t-base-200 after:border-r-[30px] after:border-r-transparent after:z-10"
          : "";

        return React.cloneElement(element, {
          style: { ...(element.props.style || {}), ...foldStyle },
          className: `${newClassName} ${shadow ? "shadow-lg select-none" : ""} ${cutClasses} transition-all duration-500 ease-out-in group-hover:!transform-none ${isAutoHovered ? "!transform-none" : ""}`,
          shade: shadow || isAutoHovered ? 0 : shadeOpacity,
        });
      })}
    </div>
  );
}

interface FoldedCardLayoutProps {
  children: React.ReactNode;
  seam1Angle?: number;
  seam2Angle?: number;
  totalRotation?: {
    x: number;
    y: number;
    z: number;
  };
  perspectiveDistance?: number;
  autoHoverRange?: {
    start: number; // percentage (0-100)
    end: number; // percentage (0-100)
  };
}

function FoldedCardLayout({
  children,
  seam1Angle = -15,
  seam2Angle = 30,
  totalRotation = { x: 5, y: -10, z: 0 },
  perspectiveDistance = 800,
  autoHoverRange = { start: 10, end: 30 },
}: FoldedCardLayoutProps) {
  const [isAutoHovered, setIsAutoHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const cardCenter = rect.top + rect.height / 2;

      // Check if card center is in the configured viewport range
      const startPosition = viewportHeight * (autoHoverRange.start / 100);
      const endPosition = viewportHeight * (autoHoverRange.end / 100);
      const isInTargetZone = cardCenter >= startPosition && cardCenter <= endPosition;

      setIsAutoHovered(isInTargetZone);
    };

    // Initial check
    handleScroll();

    // Add scroll listener
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [autoHoverRange]);

  return (
    <div
      ref={cardRef}
      className={clsx("relative w-full group", { "mobile-hover": isAutoHovered })}
      style={{
        perspective: `${perspectiveDistance}px`,
        perspectiveOrigin: "50% 50%",
      }}
    >
      <div
        className={clsx(
          "relative transition-transform duration-500 ease-out-in",
          "group-hover:!transform-none",
          isAutoHovered && "!transform-none",
        )}
        style={{
          transformStyle: "preserve-3d",
          transform: isAutoHovered
            ? "none"
            : `rotateX(${totalRotation.x}deg) rotateY(${totalRotation.y}deg) rotateZ(${totalRotation.z}deg)`,
        }}
      >
        {/* Main content with fold transforms */}
        <div className="relative z-20" style={{ transformStyle: "preserve-3d" }}>
          <FoldedGrid
            seam1Angle={seam1Angle}
            seam2Angle={seam2Angle}
            totalRotation={totalRotation}
            isAutoHovered={isAutoHovered}
          >
            {children}
          </FoldedGrid>
        </div>
        {/* Shadow layer */}
        <div
          className={clsx(
            "absolute z-0 inset-0 transition-transform duration-500 ease-out-in",
            "group-hover:translate-y-0 group-hover:translate-x-0",
            isAutoHovered && "translate-y-0 translate-x-0",
          )}
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          <FoldedGrid
            seam1Angle={seam1Angle}
            seam2Angle={seam2Angle}
            shadow
            isAutoHovered={isAutoHovered}
          >
            {children}
          </FoldedGrid>
        </div>
      </div>
    </div>
  );
}

// Predefined presets for different visual styles
const FOLD_PRESETS = [
  {
    name: "Classic Trifold",
    seam1Angle: -22,
    seam2Angle: -26,
    rotation: { x: 10, y: -12, z: 1 },
  },
  {
    name: "Dynamic Wave",
    seam1Angle: 24,
    seam2Angle: 28,
    rotation: { x: 8, y: 11, z: -2 },
  },
  {
    name: "Dramatic Fan",
    seam1Angle: -28,
    seam2Angle: -32,
    rotation: { x: 12, y: -15, z: 2 },
  },
  {
    name: "Subtle Twist",
    seam1Angle: 20,
    seam2Angle: 23,
    rotation: { x: 6, y: 10, z: -1 },
  },
  {
    name: "Bold Statement",
    seam1Angle: -25,
    seam2Angle: -30,
    rotation: { x: 11, y: -13, z: 1 },
  },
  {
    name: "Gentle Flow",
    seam1Angle: 21,
    seam2Angle: 25,
    rotation: { x: 9, y: 8, z: 0 },
  },
];

// Improved seeded random number generator with better distribution
function seededRandom(seed: string) {
  // Use a more complex hashing algorithm for better distribution
  let hash1 = 0x811c9dc5; // FNV offset basis
  let hash2 = 0;

  // FNV-1a hash for first pass
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash1 ^= char;
    hash1 = Math.imul(hash1, 0x01000193); // FNV prime
    hash2 = hash2 * 31 + char; // Secondary hash
  }

  // Combine hashes for better distribution
  const combined = hash1 ^ hash2;

  // Use both sin and modulo for better pseudo-randomness
  const x = Math.sin(combined * 9.9) * 10000;
  const y = (combined * 2654435761) % 2147483647; // Knuth's multiplicative method

  // Combine both methods
  const result = (x - Math.floor(x) + y / 2147483647) / 2;
  return result - Math.floor(result);
}

// Generate random values within a range using seed
function randomInRange(seed: string, min: number, max: number, offset: number = 0) {
  const rand = seededRandom(seed + offset.toString());
  return min + rand * (max - min);
}

export default function EventEntryCard({
  event,
  forceAngles,
  presetIndex,
  seedId,
  foldAngleBounds = { min: 20, max: 30 },
  rotationBounds = {
    minX: 5,
    maxX: 12,
    minY: 5,
    maxY: 15,
    minZ: -2,
    maxZ: 2,
  },
}: Props) {
  let seam1Angle, seam2Angle, rotationX, rotationY, rotationZ;

  if (forceAngles) {
    // Priority 1: Use forced angles for precise control
    seam1Angle = forceAngles.seam1Angle;
    seam2Angle = forceAngles.seam2Angle;
    rotationX = forceAngles.totalRotation.x;
    rotationY = forceAngles.totalRotation.y;
    rotationZ = forceAngles.totalRotation.z;
  } else if (presetIndex !== undefined) {
    // Priority 2: Use preset based on index
    const preset = FOLD_PRESETS[presetIndex % FOLD_PRESETS.length];
    seam1Angle = preset.seam1Angle;
    seam2Angle = preset.seam2Angle;
    rotationX = preset.rotation.x;
    rotationY = preset.rotation.y;
    rotationZ = preset.rotation.z;
  } else {
    // Priority 3: Use seed for randomization (either provided seedId or event.id)
    const seed = seedId || event.id;

    // Enforce corner-to-corner alternating pattern: up-down-up-down OR down-up-down-up
    const startWithUp = seededRandom(seed + "pattern") > 0.5;
    const seam1Direction = startWithUp ? -1 : 1; // Both seams same direction
    const seam2Direction = startWithUp ? -1 : 1; // Creates the alternating corner pattern

    // Randomize fold angles with direction using bounds
    seam1Angle = seam1Direction * randomInRange(seed, foldAngleBounds.min, foldAngleBounds.max, 1);
    seam2Angle = seam2Direction * randomInRange(seed, foldAngleBounds.min, foldAngleBounds.max, 2);

    // Randomize rotations using bounds
    rotationX = randomInRange(seed, rotationBounds.minX, rotationBounds.maxX, 3);
    rotationY = randomInRange(seed, rotationBounds.minY, rotationBounds.maxY, 4);
    rotationZ = randomInRange(seed, rotationBounds.minZ, rotationBounds.maxZ, 5);
  }

  return (
    <FoldedCardLayout
      perspectiveDistance={1000}
      seam1Angle={seam1Angle}
      seam2Angle={seam2Angle}
      totalRotation={{ x: rotationX, y: rotationY, z: rotationZ }}
    >
      <EntryCardInner className="col-span-1 flex items-center justify-center ">Test</EntryCardInner>
      <EntryCardInner
        cut
        className="col-span-5 border-x-1 border-dashed border-base-300"
        header={{
          text: "【ＡＲＲＩＶＡＬ】",
          description: "再入国入国記録 DISEMBARKATION CARD FOR REENTRANT ②",
        }}
        footer={{
          description: "裏面を見てください。See the back.",
        }}
      >
        <EntryContent>
          <EntryCardInfo event={event} />
        </EntryContent>
      </EntryCardInner>
      <EntryCardInner
        cut
        className="col-span-6 "
        header={{
          text: "【ＤＥＰＡＲＴＵＲＥ】",
          description: "再入国出国記録 EMBARKATION CARD FOR REENTRANT ①",
        }}
        footer={{
          text: "裏面を見てください。See the back.",
          description: "裏面を見てください。See the back.",
        }}
      >
        <EntryContent>
          <div className="aspect-video">
            <img
              src={event.data.cover.src}
              alt="Event cover"
              className="w-full h-full object-cover"
              width={512}
              height={512}
            />
          </div>
        </EntryContent>
      </EntryCardInner>
    </FoldedCardLayout>
  );
}
