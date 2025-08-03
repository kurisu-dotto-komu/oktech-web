import React, { type ReactNode } from "react";

import clsx from "clsx";

interface EntryCardPanelProps {
  children: ReactNode;
  index: number;
  seam1Angle: number;
  seam2Angle: number;
  mobileSeam1Angle: number;
  mobileSeam2Angle: number;
  totalRotation: { x: number; y: number; z: number };
  isHovered: boolean;
  shadeOpacity: number;
  cut?: boolean;
}

export default function EntryCardPanel({
  children,
  index,
  seam1Angle,
  seam2Angle,
  mobileSeam1Angle,
  mobileSeam2Angle,
  isHovered,
  shadeOpacity,
  cut,
}: EntryCardPanelProps) {
  let foldAngleDesktop = 0;
  let foldAngleMobile = 0;
  let transformOriginDesktop = "50% 50%";
  let transformOriginMobile = "50% 50%";

  if (index === 0) {
    foldAngleDesktop = seam1Angle;
    foldAngleMobile = mobileSeam1Angle;
    transformOriginDesktop = "100% 50%";
    transformOriginMobile = "50% 100%";
  } else if (index === 2) {
    foldAngleDesktop = seam2Angle;
    foldAngleMobile = mobileSeam2Angle;
    transformOriginDesktop = "0% 50%";
    transformOriginMobile = "50% 0%";
  }

  const widths = ["8.333333%", "41.666667%", "50%"];
  const width = widths[index];

  const panelStyle: React.CSSProperties = {
    "--fold-angle-desktop": `${foldAngleDesktop}deg`,
    "--fold-angle-mobile": `${foldAngleMobile}deg`,
    "--transform-origin-desktop": transformOriginDesktop,
    "--transform-origin-mobile": transformOriginMobile,
    "--panel-width": width,
    "--panel-height": width,
    transformStyle: "preserve-3d",
    position: "relative",
  } as React.CSSProperties;

  const maskStyle = cut
    ? {
        maskImage: "linear-gradient(135deg, transparent 0, transparent 19px, black 19px)",
        WebkitMaskImage: "linear-gradient(135deg, transparent 0, transparent 19px, black 19px)",
      }
    : {};

  return (
    <div
      style={{ ...panelStyle, ...maskStyle }}
      className={clsx(
        "entry-card-panel bg-base-200 group-hover:bg-base-100 relative",
        "ease-out-in transition-all duration-500",
        "group-hover:!transform-none",
        isHovered && "auto-hover !bg-base-100 !transform-none",
      )}
    >
      <div className="relative flex h-full w-full flex-col overflow-hidden">{children}</div>
      <div
        className="ease-out-in pointer-events-none absolute inset-0 z-[9] transition-opacity duration-500 group-hover:!opacity-0 [.auto-hover_&]:!opacity-0"
        style={{
          backgroundColor: `rgba(0, 0, 0, ${shadeOpacity})`,
          opacity: shadeOpacity > 0 ? 1 : 0,
        }}
      />
    </div>
  );
}
