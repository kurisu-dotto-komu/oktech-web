import React, { type ReactNode, type Ref } from "react";

import clsx from "clsx";

import LinkReact from "@/components/Common/LinkReact";
import { useScrollHotspot } from "@/utils/useScrollHotspot";

import EntryCardPanel from "./EntryCardPanel";
import { type AngleCalculationProps, useEntryCardAngles } from "./useEntryCardAngles";

interface EntryCardTrifoldProps extends AngleCalculationProps {
  leftPanel: ReactNode;
  midPanel: ReactNode;
  rightPanel: ReactNode;
  perspectiveDistance?: number;
}

export default function EntryCardTrifold({
  leftPanel,
  midPanel,
  rightPanel,
  forceAngles,
  presetIndex,
  seedId,
  eventId,
  foldAngleBounds,
  rotationBounds,
  zoomBounds,
  perspectiveDistance = 800,
}: EntryCardTrifoldProps) {
  const { isInHotspot, elementRef: cardRef } = useScrollHotspot();
  const { panelProps, transformStyles, panelShades } = useEntryCardAngles({
    forceAngles,
    presetIndex,
    seedId,
    eventId,
    foldAngleBounds,
    rotationBounds,
    zoomBounds,
  });

  return (
    <LinkReact
      href={`/event/${eventId}`}
      ref={cardRef as Ref<HTMLAnchorElement>}
      data-testid={`event-card-${eventId}`}
      className={clsx("group relative w-full drop-shadow-xl", {
        "mobile-hover": isInHotspot,
      })}
    >
      <div
        className="relative z-20"
        style={{
          perspective: `${perspectiveDistance}px`,
          perspectiveOrigin: "50% 50%",
        }}
      >
        <div
          className={clsx(
            "entry-card-wrapper",
            "ease-out-in relative transition-transform duration-500",
            "group-hover:!transform-none",
            isInHotspot && "!transform-none",
          )}
          style={
            {
              ...transformStyles,
              transformStyle: "preserve-3d",
              transform: isInHotspot ? "none" : "var(--desktop-transform)",
            } as React.CSSProperties
          }
        >
          <div
            className="flex w-full flex-col md:flex-row"
            style={{ transformStyle: "preserve-3d" }}
          >
            <EntryCardPanel
              {...panelProps}
              index={0}
              isHovered={isInHotspot}
              shadeOpacity={panelShades.panel0Shade}
            >
              {leftPanel}
            </EntryCardPanel>
            <EntryCardPanel
              {...panelProps}
              index={1}
              isHovered={isInHotspot}
              cut
              shadeOpacity={panelShades.panel1Shade}
            >
              {midPanel}
            </EntryCardPanel>
            <EntryCardPanel
              {...panelProps}
              index={2}
              isHovered={isInHotspot}
              cut
              shadeOpacity={panelShades.panel2Shade}
            >
              {rightPanel}
            </EntryCardPanel>
          </div>
        </div>
      </div>
    </LinkReact>
  );
}
