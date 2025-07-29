import React from "react";
import clsx from "clsx";

interface EntryCardFoldProps {
  child: React.ReactNode;
  index: number;
  seam1Angle: number;
  seam2Angle: number;
  mobileSeam1Angle?: number;
  mobileSeam2Angle?: number;
  shadow?: boolean;
  totalRotation?: { x: number; y: number; z: number };
  isAutoHovered?: boolean;
}

export default function EntryCardFold({
  child,
  index,
  seam1Angle,
  seam2Angle,
  mobileSeam1Angle,
  mobileSeam2Angle,
  shadow,
  totalRotation,
  isAutoHovered,
}: EntryCardFoldProps) {
  if (!React.isValidElement(child)) return child;

  // Calculate widths based on grid spans
  const childElement = child as React.ReactElement<{
    className?: string;
  }>;
  const spanClass = childElement.props.className?.match(/col-span-(\d+)/)?.[1];
  const span = spanClass ? parseInt(spanClass) : 1;
  const width = `${(span / 12) * 100}%`;
  const height = `${(span / 12) * 100}%`;

  // Determine fold angle for this panel
  let foldAngleDesktop = 0;
  let foldAngleMobile = 0;
  let transformOriginDesktop = "50% 50%";
  let transformOriginMobile = "50% 50%";

  if (index === 0) {
    foldAngleDesktop = seam1Angle;
    foldAngleMobile = mobileSeam1Angle || seam1Angle;
    transformOriginDesktop = "100% 50%"; // right edge for horizontal
    transformOriginMobile = "50% 100%"; // bottom edge for vertical
  } else if (index === 2) {
    foldAngleDesktop = seam2Angle;
    foldAngleMobile = mobileSeam2Angle || seam2Angle;
    transformOriginDesktop = "0% 50%"; // left edge for horizontal
    transformOriginMobile = "50% 0%"; // top edge for vertical
  }

  // Calculate natural shading based on surface orientation
  // Light source from above-right-front for natural lighting
  const lightVector = { x: 0.4, y: -0.7, z: 0.6 }; // Normalized vector

  // Convert angles to radians (use desktop angle for shading calculation)
  const panelRotY = (foldAngleDesktop * Math.PI) / 180;
  const cardRotX = totalRotation ? (totalRotation.x * Math.PI) / 180 : 0;
  const cardRotY = totalRotation ? (totalRotation.y * Math.PI) / 180 : 0;

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
  const dotProduct = normal.x * lightVector.x + normal.y * lightVector.y + normal.z * lightVector.z;

  // Map dot product to shade intensity
  // Dot product ranges from -1 (facing away) to 1 (facing toward light)
  // We want: facing light = less shade, facing away = more shade
  const baseLightness = 0.6; // How much light hits even shadowed areas
  const shadowStrength = 0.7; // Maximum shadow darkness
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
  shadeOpacity = Math.max(0.05, Math.min(0.4, shadeOpacity));

  // Apply fold transforms based on position
  // Use CSS custom properties for responsive transforms
  const foldStyle: React.CSSProperties = {
    "--fold-angle-desktop": `${foldAngleDesktop}deg`,
    "--fold-angle-mobile": `${foldAngleMobile}deg`,
    "--transform-origin-desktop": transformOriginDesktop,
    "--transform-origin-mobile": transformOriginMobile,
    "--panel-width": width,
    "--panel-height": height,
    transformStyle: "preserve-3d" as const,
    position: "relative" as const,
  } as React.CSSProperties;

  const element = child as React.ReactElement<{
    style?: React.CSSProperties;
    className?: string;
    shade?: number;
    shadow?: boolean;
  }>;

  // Remove col-span classes since we're using flex
  const newClassName = element.props.className?.replace(/col-span-\d+/, "").trim() || "";

  return React.cloneElement(element, {
    style: { ...(element.props.style || {}), ...foldStyle },
    className: clsx(
      newClassName,
      "entry-card-panel",
      "transition-all duration-500 ease-out-in",
      "group-hover:!transform-none",
      shadow && "shadow-lg select-none",
      isAutoHovered && "!transform-none auto-hover",
    ),
    shade: shadow ? 0 : shadeOpacity,
    shadow: shadow,
  });
}
