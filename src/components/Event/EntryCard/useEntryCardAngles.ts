import { useMemo } from "react";
import { seededRandom, randomInRange } from "@/utils/random";

export const FOLD_PRESETS = [
  [45, 35, -10, -15, -2, 0],
  [-45, -35, 10, 25, 1, -1],
  [-25, -25, -10, 10, -1, -1],
  [-25, -25, -10, 10, 1, 0],
  [25, 25, 10, -20, 1, 0],
];

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

function calculateAngles({
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
    return {
      seam1Angle: forceAngles.seam1Angle,
      seam2Angle: forceAngles.seam2Angle,
      totalRotation: forceAngles.totalRotation,
      zoom: forceAngles.zoom ?? 0,
    };
  } else if (presetIndex !== undefined) {
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
    const seed = seedId || eventId;

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

    const startWithUp = seededRandom(seed + "pattern") > 0.5;
    const seam1Direction = startWithUp ? -1 : 1;
    const seam2Direction = startWithUp ? -1 : 1;

    const seam1Angle =
      seam1Direction * randomInRange(seed, actualFoldBounds.min, actualFoldBounds.max, 1);
    const seam2Angle =
      seam2Direction * randomInRange(seed, actualFoldBounds.min, actualFoldBounds.max, 2);

    const rotationX = randomInRange(seed, actualRotationBounds.minX, actualRotationBounds.maxX, 3);
    const rotationY = randomInRange(seed, actualRotationBounds.minY, actualRotationBounds.maxY, 4);
    const rotationZ = randomInRange(seed, actualRotationBounds.minZ, actualRotationBounds.maxZ, 5);

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

export interface PanelAnglesProps {
  seam1Angle: number;
  seam2Angle: number;
  mobileSeam1Angle: number;
  mobileSeam2Angle: number;
  totalRotation: { x: number; y: number; z: number };
}

export interface PanelShadeProps {
  panel0Shade: number;
  panel1Shade: number;
  panel2Shade: number;
}

export interface TransformStyleProps {
  "--desktop-transform": string;
  "--mobile-transform": string;
}

export function useEntryCardAngles(props: AngleCalculationProps) {
  const desktopAngles = useMemo(
    () =>
      calculateAngles({
        ...props,
        isMobile: false,
      }),
    [props],
  );

  const mobileAngles = useMemo(
    () =>
      calculateAngles({
        ...props,
        isMobile: true,
      }),
    [props],
  );

  const panelProps: PanelAnglesProps = useMemo(
    () => ({
      seam1Angle: desktopAngles.seam1Angle,
      seam2Angle: desktopAngles.seam2Angle,
      mobileSeam1Angle: mobileAngles.seam1Angle,
      mobileSeam2Angle: mobileAngles.seam2Angle,
      totalRotation: desktopAngles.totalRotation,
    }),
    [desktopAngles, mobileAngles],
  );

  const transformStyles: TransformStyleProps = useMemo(
    () => ({
      "--desktop-transform": `translateZ(${desktopAngles.zoom * 100}px) rotateX(${desktopAngles.totalRotation.x}deg) rotateY(${desktopAngles.totalRotation.y}deg) rotateZ(${desktopAngles.totalRotation.z}deg)`,
      "--mobile-transform": `translateZ(${mobileAngles.zoom * 100}px) rotateX(${mobileAngles.totalRotation.x}deg) rotateY(${mobileAngles.totalRotation.y}deg) rotateZ(${mobileAngles.totalRotation.z}deg)`,
    }),
    [desktopAngles, mobileAngles],
  );

  const panelShades: PanelShadeProps = useMemo(() => {
    // Simple shade calculation based on fold angles
    // Left panel: darker when folded back (positive angle)
    const leftShade = Math.max(0.05, Math.min(0.3, 0.15 + desktopAngles.seam1Angle * 0.003));
    
    // Middle panel: always slightly shaded
    const midShade = 0.12;
    
    // Right panel: darker when folded back (negative angle)
    const rightShade = Math.max(0.05, Math.min(0.3, 0.15 - desktopAngles.seam2Angle * 0.003));
    
    return {
      panel0Shade: leftShade,
      panel1Shade: midShade,
      panel2Shade: rightShade,
    };
  }, [desktopAngles]);

  return { desktopAngles, mobileAngles, panelProps, transformStyles, panelShades };
}
