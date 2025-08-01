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
    // Calculate panel normals based on fold angles and card rotation
    // Light source from the right: (1, 0.1, 0.2) - slightly elevated for realism
    const lightDir = { x: 1, y: 0.1, z: 0.2 };
    const lightMagnitude = Math.sqrt(lightDir.x ** 2 + lightDir.y ** 2 + lightDir.z ** 2);
    const normalizedLight = {
      x: lightDir.x / lightMagnitude,
      y: lightDir.y / lightMagnitude,
      z: lightDir.z / lightMagnitude,
    };

    // Convert angles to radians
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const seam1Rad = toRad(desktopAngles.seam1Angle);
    const seam2Rad = toRad(desktopAngles.seam2Angle);
    const rotXRad = toRad(desktopAngles.totalRotation.x);
    const rotYRad = toRad(desktopAngles.totalRotation.y);
    const rotZRad = toRad(desktopAngles.totalRotation.z);

    // Calculate normal vectors for each panel (before card rotation)
    // Panel 0 (left): rotated by seam1Angle around Y-axis
    const panel0Normal = {
      x: Math.sin(seam1Rad),
      y: 0,
      z: Math.cos(seam1Rad),
    };

    // Panel 1 (middle): no fold rotation
    const panel1Normal = { x: 0, y: 0, z: 1 };

    // Panel 2 (right): rotated by -seam2Angle around Y-axis
    const panel2Normal = {
      x: Math.sin(-seam2Rad),
      y: 0,
      z: Math.cos(-seam2Rad),
    };

    // Apply card's total rotation to each panel normal
    const rotateVector = (v: { x: number; y: number; z: number }) => {
      // Apply rotations in order: Z, Y, X (matching CSS transform order)
      // Rotate around Z
      let x1 = v.x * Math.cos(rotZRad) - v.y * Math.sin(rotZRad);
      let y1 = v.x * Math.sin(rotZRad) + v.y * Math.cos(rotZRad);
      let z1 = v.z;

      // Rotate around Y
      let x2 = x1 * Math.cos(rotYRad) + z1 * Math.sin(rotYRad);
      let y2 = y1;
      let z2 = -x1 * Math.sin(rotYRad) + z1 * Math.cos(rotYRad);

      // Rotate around X
      let x3 = x2;
      let y3 = y2 * Math.cos(rotXRad) - z2 * Math.sin(rotXRad);
      let z3 = y2 * Math.sin(rotXRad) + z2 * Math.cos(rotXRad);

      return { x: x3, y: y3, z: z3 };
    };

    const rotatedPanel0Normal = rotateVector(panel0Normal);
    const rotatedPanel1Normal = rotateVector(panel1Normal);
    const rotatedPanel2Normal = rotateVector(panel2Normal);

    // Calculate dot product with light direction (higher = brighter)
    const dotProduct = (
      v1: { x: number; y: number; z: number },
      v2: { x: number; y: number; z: number },
    ) => v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;

    const panel0Dot = dotProduct(rotatedPanel0Normal, normalizedLight);
    const panel1Dot = dotProduct(rotatedPanel1Normal, normalizedLight);
    const panel2Dot = dotProduct(rotatedPanel2Normal, normalizedLight);

    // Convert dot products to shade values
    // Dot product ranges from -1 (facing away) to 1 (facing towards)
    // We want shade from 0.05 (brightest) to 0.3 (darkest)
    const dotToShade = (dot: number) => {
      // Remap from [-1, 1] to [0.3, 0.05]
      return 0.175 - dot * 0.125;
    };

    return {
      panel0Shade: Math.max(0.05, Math.min(0.3, dotToShade(panel0Dot))),
      panel1Shade: Math.max(0.05, Math.min(0.3, dotToShade(panel1Dot))),
      panel2Shade: Math.max(0.05, Math.min(0.3, dotToShade(panel2Dot))),
    };
  }, [desktopAngles]);

  return { desktopAngles, mobileAngles, panelProps, transformStyles, panelShades };
}
