import { useEffect, useMemo, useState } from "react";

import clsx from "clsx";

import asanohaThemedShader from "@/shaders/asanoha-themed.frag?raw";
import { parseOklchToRgb } from "@/utils/colorConversion";

import ShaderRenderer from "./ShaderRenderer";
import type { UniformValue } from "./ShaderRenderer";

interface AsanohaShaderProps {
  className?: string;
  showComments?: boolean;
}

// Shader configuration - tweak these values
const SHADER_CONFIG = {
  // Dark mode settings
  dark: {
    baseBrightness: 0, // Base brightness (0-1)
    lightMultiplier: 0.2, // How much the lighting affects brightness
    baseColorMultiplier: 0.1, // Overall color intensity
    vignetteStrength: 0.8, // CSS vignette opacity (0-1)
    // Mouse spotlight settings for dark mode
    mouseSpotlight: {
      intensity: 0.6, // Mouse spotlight brightness
      radius: 6, // Size of spotlight (in UV space units)
      falloff: 4, // How quickly spotlight fades (higher = softer edge)
    },
    // Center spotlight settings for dark mode
    centerSpotlight: {
      intensity: 0, // Center spotlight brightness
      radius: 5.0, // Size of center spotlight (in UV space units)
      falloff: 2.0, // How quickly spotlight fades (higher = softer edge)
    },
  },
  // Light mode settings
  light: {
    baseBrightness: 0.2, // Base brightness (0-1)
    lightMultiplier: 0.5, // How much the lighting affects brightness
    baseColorMultiplier: 0.8, // Overall color intensity
    whitePoint: 0, // White point adjustment (0-1)
    vignetteStrength: 0.8, // CSS vignette opacity (0-1)
    // Mouse spotlight settings for light mode
    mouseSpotlight: {
      intensity: 1.2, // Mouse spotlight brightness
      radius: 7.0, // Size of spotlight (in UV space units)
      falloff: 4, // How quickly spotlight fades (higher = softer edge)
    },
    // Center spotlight settings for light mode
    centerSpotlight: {
      intensity: 0.6, // Center spotlight brightness
      radius: 9.0, // Size of center spotlight (in UV space units)
      falloff: 10, // How quickly spotlight fades (higher = softer edge)
    },
  },
  // Pattern settings
  pattern: {
    scale: 1.7, // Overall pattern scale (larger = smaller triangles)
    resizeScale: 0.5, // 0 = no adjustment, 1 = maximum adjustment based on aspect ratio
  },
};

export default function AsanohaShader({ showComments }: AsanohaShaderProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Initial theme detection
    const checkTheme = () => {
      const theme = document.documentElement.getAttribute("data-theme");
      setIsDarkMode(theme === "dark");
    };

    checkTheme();

    // Watch for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  // Get primary color from CSS variables
  const [primaryColor, setPrimaryColor] = useState({ r: 0.3, g: 1.0, b: 0.4 });

  useEffect(() => {
    const getPrimaryColor = () => {
      const styles = getComputedStyle(document.documentElement);
      const primaryColorStr = styles.getPropertyValue("--color-primary").trim();

      const rgb = parseOklchToRgb(primaryColorStr);
      if (rgb) {
        setPrimaryColor(rgb);
      } else {
        setPrimaryColor({ r: 0.3, g: 1.0, b: 0.4 });
      }
    };

    getPrimaryColor();
  }, [isDarkMode]); // Recalculate when theme changes

  // Create uniforms for the shader
  const shaderUniforms = useMemo(() => {
    const config = isDarkMode ? SHADER_CONFIG.dark : SHADER_CONFIG.light;

    const uniforms: Record<string, UniformValue> = {
      u_isDark: { type: "1f", value: isDarkMode ? 1.0 : 0.0 },
      u_baseBrightness: { type: "1f", value: config.baseBrightness },
      u_lightMultiplier: { type: "1f", value: config.lightMultiplier },
      u_baseColorMultiplier: { type: "1f", value: config.baseColorMultiplier },
      u_mouseSpotlightIntensity: { type: "1f", value: config.mouseSpotlight.intensity },
      u_centerSpotlightIntensity: { type: "1f", value: config.centerSpotlight.intensity },
      u_whitePoint: { type: "1f", value: isDarkMode ? 0 : SHADER_CONFIG.light.whitePoint },
      u_mouseSpotRadius: { type: "1f", value: config.mouseSpotlight.radius },
      u_mouseSpotFalloff: { type: "1f", value: config.mouseSpotlight.falloff },
      u_centerSpotRadius: { type: "1f", value: config.centerSpotlight.radius },
      u_centerSpotFalloff: { type: "1f", value: config.centerSpotlight.falloff },
      u_primaryColor: { type: "3f", value: [primaryColor.r, primaryColor.g, primaryColor.b] },
      u_patternScale: { type: "1f", value: SHADER_CONFIG.pattern.scale },
      u_resizeScale: { type: "1f", value: SHADER_CONFIG.pattern.resizeScale },
    };

    return uniforms;
  }, [isDarkMode, primaryColor]);

  const vignetteStrength = isDarkMode
    ? SHADER_CONFIG.dark.vignetteStrength
    : SHADER_CONFIG.light.vignetteStrength;

  return (
    <div className={clsx("absolute inset-0 z-0 overflow-hidden")}>
      {/* Shader layer */}
      <ShaderRenderer
        fragmentShader={asanohaThemedShader}
        style={{
          opacity: isDarkMode ? 1 : 0.9,
        }}
        showComments={showComments}
        uniforms={shaderUniforms}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          boxShadow: isDarkMode
            ? `inset 0 0 150px rgba(0,0,0,${0.8 * vignetteStrength}), inset 0 0 300px rgba(0,0,0,${0.5 * vignetteStrength})`
            : `inset 0 0 200px rgba(0,0,0,${0.4 * vignetteStrength}), inset 0 0 400px rgba(0,0,0,${0.2 * vignetteStrength})`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: isDarkMode
            ? `radial-gradient(ellipse at center, transparent 0%, transparent 40%, rgba(0,0,0,${0.4 * vignetteStrength}) 100%)`
            : `radial-gradient(ellipse at center, transparent 0%, transparent 30%, rgba(0,0,0,${0.3 * vignetteStrength}) 100%)`,
        }}
      />
    </div>
  );
}
