export interface RGB {
  r: number;
  g: number;
  b: number;
}

/**
 * Converts OKLCH color values to RGB
 * @param lightness - Lightness value (0-1 or 0-100)
 * @param chroma - Chroma value (typically 0-0.4)
 * @param hue - Hue value in degrees (0-360)
 * @returns RGB values in range 0-1
 */
export function oklchToRgb(lightness: number, chroma: number, hue: number): RGB {
  // Normalize lightness if it's in percentage
  if (lightness > 1) {
    lightness = lightness / 100;
  }

  // Convert hue to radians
  const hueRad = (hue * Math.PI) / 180;

  // OKLab intermediate values
  // This is a simplified conversion that approximates OKLCH to RGB
  const a = chroma * Math.cos(hueRad);
  const b = chroma * Math.sin(hueRad);

  // Convert from OKLab to linear RGB
  // These are approximation matrices for OKLab to linear RGB conversion
  let l_ = lightness + 0.3963377774 * a + 0.2158037573 * b;
  let m_ = lightness - 0.1055613458 * a - 0.0638541728 * b;
  let s_ = lightness - 0.0894841775 * a - 1.291485548 * b;

  // Apply gamma correction (cube)
  l_ = l_ * l_ * l_;
  m_ = m_ * m_ * m_;
  s_ = s_ * s_ * s_;

  // Convert to linear RGB
  let red = +4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_;
  let green = -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_;
  let blue = -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_;

  // Apply sRGB gamma correction
  red = gammaCorrect(red);
  green = gammaCorrect(green);
  blue = gammaCorrect(blue);

  // Clamp values to 0-1 range
  red = Math.max(0, Math.min(1, red));
  green = Math.max(0, Math.min(1, green));
  blue = Math.max(0, Math.min(1, blue));

  return { r: red, g: green, b: blue };
}

/**
 * Apply sRGB gamma correction
 */
function gammaCorrect(channel: number): number {
  if (channel <= 0.0031308) {
    return 12.92 * channel;
  } else {
    return 1.055 * Math.pow(channel, 1 / 2.4) - 0.055;
  }
}

/**
 * Parse OKLCH color string and convert to RGB
 * @param oklchString - OKLCH color string like "oklch(0.757 0.12 173.7)"
 * @returns RGB values or null if parsing fails
 */
export function parseOklchToRgb(oklchString: string): RGB | null {
  const match = oklchString.match(/oklch\(([\d.]+)%?\s+([\d.]+)\s+([\d.]+)\)/);
  if (!match) {
    return null;
  }

  const [, lightness, chroma, hue] = match.map(Number);
  return oklchToRgb(lightness, chroma, hue);
}
