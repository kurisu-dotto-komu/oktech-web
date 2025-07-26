import React from "react";
import type { EventEnriched } from "@/content";
import clsx from "clsx";

interface Props {
  event: EventEnriched;
  forceAngles?: {
    seam1Angle: number;
    seam2Angle: number;
    totalRotation: { x: number; y: number; z: number };
  };
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
    <div className="flex gap-2 justify-between select-none">
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
    <div className="flex flex-col select-none pl-6 px-2">
      <div className="text-sm text-left">{description}</div>
      <h3 className="text-lg text-right font-zen text-red-400 font-bold">{text}</h3>
    </div>
  );
}

function EntryContent({ children }: { children: React.ReactNode }) {
  return <div className="h-full border-2 border-base-content">{children}</div>;
}

function EntryCardInner({
  children,
  className,
  footer,
  header,
  cut = false,
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
    <div
      className={clsx("bg-base-100 border-r border-dotted border-base-300 relative", className)}
      style={style}
    >
      {shade > 0 && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-500 ease-out-in group-hover:!opacity-0"
          style={{ backgroundColor: `rgba(0, 0, 0, ${shade})` }}
        />
      )}
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
}

function FoldedGrid({ children, seam1Angle, seam2Angle, shadow, totalRotation }: FoldedGridProps) {
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

        // Calculate shade based on light source from right
        // Light vector pointing from right to left: [-1, 0, 0]
        // Panel normal after rotation depends on fold angle
        let shadeOpacity = 0.05; // Minimum shade for visibility

        if (index === 0) {
          // Left panel: starts facing forward [0, 0, 1], rotates around Y axis
          // When folded right (positive angle), faces more toward light (less shade)
          // When folded left (negative angle), faces away from light (more shade)
          const normalX = Math.sin((foldAngle * Math.PI) / 180);
          const dotProduct = normalX * -1; // dot product with light vector
          shadeOpacity = Math.max(0.05, Math.min(0.3, 0.05 + dotProduct * 0.25));
        } else if (index === 1) {
          // Middle panel: Add subtle shade based on overall rotation
          if (totalRotation) {
            const rotY = (totalRotation.y * Math.PI) / 180;
            const normalX = Math.sin(rotY);
            const dotProduct = normalX * -1;
            shadeOpacity = Math.max(0.05, Math.min(0.15, 0.05 + Math.abs(dotProduct) * 0.1));
          }
        } else if (index === 2) {
          // Right panel: starts facing forward [0, 0, 1], rotates around Y axis
          // When folded right (positive angle), faces away from light (more shade)
          // When folded left (negative angle), faces toward light (less shade)
          const normalX = Math.sin((foldAngle * Math.PI) / 180);
          const dotProduct = normalX * -1; // dot product with light vector
          shadeOpacity = Math.max(0.05, Math.min(0.3, 0.05 - dotProduct * 0.25));
        }

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
          ? [
              "before:absolute before:top-0 before:left-0 before:w-0 before:h-0",
              "before:border-t-[20px] before:border-r-[20px] before:border-r-transparent",
              "before:z-10",
            ].join(" ")
          : "";

        return React.cloneElement(element, {
          style: { ...(element.props.style || {}), ...foldStyle },
          className: `${newClassName} ${shadow ? "shadow-lg select-none" : ""} ${cutClasses} transition-all duration-500 ease-out-in group-hover:!transform-none`,
          shade: shadow ? 0 : shadeOpacity,
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
}

function FoldedCardLayout({
  children,
  seam1Angle = -15,
  seam2Angle = 30,
  totalRotation = { x: 5, y: -10, z: 0 },
  perspectiveDistance = 800,
}: FoldedCardLayoutProps) {
  return (
    <div
      className="relative w-full group"
      style={{
        perspective: `${perspectiveDistance}px`,
        perspectiveOrigin: "50% 50%",
      }}
    >
      <div
        className="relative transition-transform duration-500 ease-out-in group-hover:!transform-none"
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(${totalRotation.x}deg) rotateY(${totalRotation.y}deg) rotateZ(${totalRotation.z}deg)`,
        }}
      >
        {/* Main content with fold transforms */}
        <div className="relative z-10" style={{ transformStyle: "preserve-3d" }}>
          <FoldedGrid seam1Angle={seam1Angle} seam2Angle={seam2Angle} totalRotation={totalRotation}>
            {children}
          </FoldedGrid>
        </div>
        {/* Shadow layer */}
        <div
          className="absolute z-0 inset-0 transition-transform duration-500 ease-out-in group-hover:translate-y-0 group-hover:translate-x-0 "
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          <FoldedGrid seam1Angle={seam1Angle} seam2Angle={seam2Angle} shadow>
            {children}
          </FoldedGrid>
        </div>
      </div>
    </div>
  );
}

// Simple seeded random number generator
function seededRandom(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  const x = Math.sin(hash) * 10000;
  return x - Math.floor(x);
}

// Generate random values within a range using seed
function randomInRange(seed: string, min: number, max: number, offset: number = 0) {
  const rand = seededRandom(seed + offset.toString());
  return min + rand * (max - min);
}

export default function EventEntryCard({
  event,
  forceAngles,
  foldAngleBounds = { min: 15, max: 25 },
  rotationBounds = {
    minX: 10,
    maxX: 20,
    minY: 10,
    maxY: 25,
    minZ: -5,
    maxZ: 5,
  },
}: Props) {
  let seam1Angle, seam2Angle, rotationX, rotationY, rotationZ;

  if (forceAngles) {
    // Use forced angles for testing
    seam1Angle = forceAngles.seam1Angle;
    seam2Angle = forceAngles.seam2Angle;
    rotationX = forceAngles.totalRotation.x;
    rotationY = forceAngles.totalRotation.y;
    rotationZ = forceAngles.totalRotation.z;
  } else {
    // Use event ID as seed for consistent randomization
    const seed = event.id;

    // Ensure alternating fold pattern
    const firstFoldUp = seededRandom(seed + "firstDir") > 0.5;
    const seam1Direction = firstFoldUp ? 1 : -1;
    const seam2Direction = firstFoldUp ? -1 : 1; // Always opposite of seam1

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
      <EntryCardInner className="col-span-1 flex items-center justify-center relative">
        Test
      </EntryCardInner>
      <EntryCardInner
        cut
        className="col-span-5 relative"
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
        className="col-span-6 border-none relative"
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
