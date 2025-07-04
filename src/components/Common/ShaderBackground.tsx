'use client';

import { useRef, useEffect, useMemo, useCallback } from 'react';

interface ShaderBackgroundProps {
  className?: string;
  variant?: 'dots' | 'waves' | 'grid';
  intensity?: number;
  color?: string;
  secondaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  interactive?: boolean;
}

export default function ShaderBackground({ 
  className = '', 
  variant = 'dots',
  intensity = 0.6,
  color = '#ffffff',
  secondaryColor = '#888888',
  accentColor = '#ffaa00',
  backgroundColor = 'transparent',
  interactive = true
}: ShaderBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const mouseRef = useRef({ x: 0, y: 0, prevX: 0, prevY: 0 });
  const timeRef = useRef(0);

  // Vertex shader - simple fullscreen quad
  const vertexShader = `
    attribute vec2 position;
    void main() {
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `;

  // Fragment shader for dot grid effect
  const fragmentShader = useMemo(() => `
    precision highp float;
    
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;
    uniform float u_time;
    uniform float u_intensity;
    uniform vec3 u_color;
    uniform vec3 u_secondaryColor;
    uniform vec3 u_accentColor;
    uniform vec3 u_backgroundColor;
    
    // SDF circle function
    float sdCircle(vec2 p, float r) {
      return length(p) - r;
    }
    
    // Enhanced noise function
    float noise(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }
    
    // Multi-octave noise for more complex patterns
    float fbm(vec2 p) {
      float value = 0.0;
      float amplitude = 0.5;
      for (int i = 0; i < 3; i++) {
        value += amplitude * noise(p);
        p *= 2.0;
        amplitude *= 0.5;
      }
      return value;
    }
    
    void main() {
      vec2 uv = gl_FragCoord.xy / u_resolution.xy;
      vec2 aspectRatio = vec2(u_resolution.x / u_resolution.y, 1.0);
      vec2 correctedUv = (uv - 0.5) * aspectRatio;
      
      // Grid parameters - smaller dots
      float gridSize = ${variant === 'dots' ? '25.0' : variant === 'waves' ? '20.0' : '30.0'};
      float baseDotRadius = ${variant === 'dots' ? '0.08' : variant === 'waves' ? '0.06' : '0.10'};
      
      // Create grid coordinates
      vec2 gridUv = fract(correctedUv * gridSize + 0.5) - 0.5;
      vec2 gridId = floor(correctedUv * gridSize + 0.5);
      vec2 cellCenter = (gridId + 0.5) / gridSize;
      
      // Mouse influence with proximity scaling
      vec2 mouseUv = (u_mouse / u_resolution.xy - 0.5) * aspectRatio;
      float cellToMouseDistance = length(cellCenter - mouseUv);
      float mouseInfluence = smoothstep(0.4, 0.0, cellToMouseDistance);
      
      // Mouse proximity scaling - dots get bigger when mouse is near
      float scaleFromMouse = 1.0 + mouseInfluence * 1.5;
      float dynamicDotRadius = baseDotRadius * scaleFromMouse;
      
             // Enhanced subtle sparkling animation
       float timeOffset = u_time * 0.6;
       float cellNoise = noise(gridId * 0.1);
       float sparkleNoise = fbm(gridId * 0.03 + u_time * 0.05);
       
       // Primary gentle pulse animation
       float pulsePhase = timeOffset + cellNoise * 6.28318;
       float pulse = sin(pulsePhase) * 0.3 + 0.7; // More gentle pulse
       
       // Subtle secondary sparkle animation with smooth fade
       float sparklePhase = timeOffset * 0.7 + cellNoise * 4.0;
       float sparkleBase = sin(sparklePhase) * 0.5 + 0.5;
       
       // Smooth fade in/out sparkle effect
       float sparkleChance = smoothstep(0.8, 0.9, sparkleNoise);
       float sparkleFade = smoothstep(0.0, 0.3, sparkleBase) * smoothstep(1.0, 0.7, sparkleBase);
       float sparkle = sparkleFade * sparkleChance * 0.8; // More subtle intensity
       
       // Accent color background animation
       float accentPhase = u_time * 0.3 + cellNoise * 2.0;
       float accentPulse = sin(accentPhase) * 0.2 + 0.8;
      
      // Distance from center for radial gradient
      float centerDistance = length(correctedUv);
      float radialMask = smoothstep(0.8, 0.2, centerDistance);
      
      ${variant === 'waves' ? `
      // Wave distortion
      float wave = sin(correctedUv.x * 10.0 + u_time) * 0.1;
      gridUv.y += wave;
      ` : ''}
      
      ${variant === 'grid' ? `
      // Grid line effect
      vec2 gridLines = abs(gridUv);
      float lineWidth = 0.015;
      float lines = 1.0 - smoothstep(lineWidth, lineWidth + 0.01, min(gridLines.x, gridLines.y));
      ` : ''}
      
      // Create dot/shape with dynamic radius
      float shape = sdCircle(gridUv, dynamicDotRadius);
      float smoothShape = 1.0 - smoothstep(0.0, 0.02, shape);
      
      ${variant === 'grid' ? `
      smoothShape = max(smoothShape, lines);
      ` : ''}
      
             // Calculate intensities for all color layers
       float baseIntensity = smoothShape * radialMask * u_intensity;
       float primaryIntensity = baseIntensity * pulse;
       float secondaryIntensity = baseIntensity * sparkle * 0.4; // More subtle sparkle
       
       // Add mouse interaction boost with subtle glow
       float mouseGlow = smoothstep(0.6, 0.0, cellToMouseDistance) * 0.2;
       primaryIntensity += mouseInfluence * 0.3 + mouseGlow;
       secondaryIntensity += mouseInfluence * sparkle * 0.2 + mouseGlow * sparkle * 0.5;
       
       // Accent color for background ambience (very subtle)
       float accentIntensity = (1.0 - smoothShape) * radialMask * accentPulse * 0.1;
       
       // Lighter background mixing
       vec3 lightBackground = mix(u_backgroundColor, u_accentColor, 0.05); // Very subtle accent tint
       
       // Color composition with multiple layers
       vec3 primaryContribution = u_color * primaryIntensity;
       vec3 secondaryContribution = u_secondaryColor * secondaryIntensity;
       vec3 accentContribution = u_accentColor * accentIntensity;
       
       vec3 dotColors = primaryContribution + secondaryContribution;
       vec3 finalColor = mix(lightBackground, dotColors + accentContribution, 
                            min(primaryIntensity + secondaryIntensity + accentIntensity, 1.0));
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `, [variant]);

  const createShader = useCallback((gl: WebGLRenderingContext, type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    
    return shader;
  }, []);

  const createProgram = useCallback((gl: WebGLRenderingContext) => {
    const vertShader = createShader(gl, gl.VERTEX_SHADER, vertexShader);
    const fragShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShader);
    
    if (!vertShader || !fragShader) return null;
    
    const program = gl.createProgram();
    if (!program) return null;
    
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program linking error:', gl.getProgramInfoLog(program));
      return null;
    }
    
    return program;
  }, [createShader, vertexShader, fragmentShader]);

  const setupGeometry = useCallback((gl: WebGLRenderingContext, program: WebGLProgram) => {
    const vertices = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
       1,  1,
    ]);
    
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    
    const positionLocation = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    
    return buffer;
  }, []);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    mouseRef.current.prevX = mouseRef.current.x;
    mouseRef.current.prevY = mouseRef.current.y;
    mouseRef.current.x = event.clientX - rect.left;
    mouseRef.current.y = rect.height - (event.clientY - rect.top); // Flip Y
  }, []);

  const render = useCallback((
    gl: WebGLRenderingContext, 
    program: WebGLProgram, 
    uniforms: Record<string, WebGLUniformLocation>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Update time
    timeRef.current += 0.016; // ~60fps

    // Set viewport
    gl.viewport(0, 0, canvas.width, canvas.height);
    
    // Clear
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    // Use program
    gl.useProgram(program);
    
    // Set uniforms
    gl.uniform2f(uniforms.u_resolution, canvas.width, canvas.height);
    gl.uniform2f(uniforms.u_mouse, mouseRef.current.x, mouseRef.current.y);
    gl.uniform1f(uniforms.u_time, timeRef.current);
    gl.uniform1f(uniforms.u_intensity, intensity);
    
    // Parse colors - handle CSS custom properties
    const resolvedColor = color.startsWith('var(') ? getCSSProperty(color.slice(4, -1)) : color;
    const resolvedSecondaryColor = secondaryColor.startsWith('var(') ? getCSSProperty(secondaryColor.slice(4, -1)) : secondaryColor;
    const resolvedAccentColor = accentColor.startsWith('var(') ? getCSSProperty(accentColor.slice(4, -1)) : accentColor;
    const resolvedBgColor = backgroundColor === 'transparent' ? 'transparent' : 
                           backgroundColor.startsWith('var(') ? getCSSProperty(backgroundColor.slice(4, -1)) : backgroundColor;
    
    const colorRgb = hexToRgb(resolvedColor);
    const secondaryColorRgb = hexToRgb(resolvedSecondaryColor);
    const accentColorRgb = hexToRgb(resolvedAccentColor);
    const bgColorRgb = resolvedBgColor === 'transparent' ? [0, 0, 0] : hexToRgb(resolvedBgColor);
    
    gl.uniform3f(uniforms.u_color, colorRgb[0], colorRgb[1], colorRgb[2]);
    gl.uniform3f(uniforms.u_secondaryColor, secondaryColorRgb[0], secondaryColorRgb[1], secondaryColorRgb[2]);
    gl.uniform3f(uniforms.u_accentColor, accentColorRgb[0], accentColorRgb[1], accentColorRgb[2]);
    gl.uniform3f(uniforms.u_backgroundColor, bgColorRgb[0], bgColorRgb[1], bgColorRgb[2]);
    
    // Draw
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    
    // Continue animation
    animationRef.current = requestAnimationFrame(() => render(gl, program, uniforms));
  }, [intensity, color, secondaryColor, accentColor, backgroundColor]);

  const hexToRgb = (hex: string): [number, number, number] => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16) / 255,
      parseInt(result[2], 16) / 255,
      parseInt(result[3], 16) / 255
    ] : [1, 1, 1];
  };

  const getCSSProperty = (property: string): string => {
    if (typeof window === 'undefined') return '#ffffff';
    const computed = getComputedStyle(document.documentElement);
    return computed.getPropertyValue(property).trim();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl') as WebGLRenderingContext | null || 
               canvas.getContext('experimental-webgl') as WebGLRenderingContext | null;
    if (!gl) {
      console.warn('WebGL not supported, falling back to CSS animation');
      document.documentElement.classList.add('no-webgl');
      return;
    }
    
    // WebGL is supported, ensure fallback is hidden
    document.documentElement.classList.remove('no-webgl');

    const program = createProgram(gl);
    if (!program) return;

    setupGeometry(gl, program);

    // Get uniform locations
    const uniforms = {
      u_resolution: gl.getUniformLocation(program, 'u_resolution')!,
      u_mouse: gl.getUniformLocation(program, 'u_mouse')!,
      u_time: gl.getUniformLocation(program, 'u_time')!,
      u_intensity: gl.getUniformLocation(program, 'u_intensity')!,
      u_color: gl.getUniformLocation(program, 'u_color')!,
      u_secondaryColor: gl.getUniformLocation(program, 'u_secondaryColor')!,
      u_accentColor: gl.getUniformLocation(program, 'u_accentColor')!,
      u_backgroundColor: gl.getUniformLocation(program, 'u_backgroundColor')!,
    };

    // Resize handler
    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    // Start render loop
    render(gl, program, uniforms);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [createProgram, setupGeometry, handleMouseMove, render, interactive]);

  return (
    <>
      {/* CSS Fallback for unsupported browsers */}
      <div 
        className={`absolute inset-0 w-full h-full pointer-events-none opacity-15 ${className}`}
        style={{
          background: `radial-gradient(circle at 50% 50%, ${accentColor}08 0%, ${color}15 40%, ${secondaryColor}08 70%, transparent 90%), 
                      repeating-linear-gradient(0deg, transparent, transparent 30px, ${color}06 31px, transparent 32px),
                      repeating-linear-gradient(90deg, transparent, transparent 30px, ${secondaryColor}04 31px, transparent 32px)`,
          animation: 'subtle-sparkle 8s ease-in-out infinite',
          display: 'var(--webgl-fallback, block)',
        }}
      />
      
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
        style={{
          backgroundColor: backgroundColor === 'transparent' ? 'transparent' : backgroundColor,
          display: 'var(--webgl-active, block)',
        }}
      />
      
      <style>{`
        @keyframes subtle-sparkle {
          0%, 100% { opacity: 0.08; transform: scale(1); }
          20% { opacity: 0.12; transform: scale(1.01); }
          50% { opacity: 0.18; transform: scale(1); }
          80% { opacity: 0.10; transform: scale(0.99); }
        }
        :root {
          --webgl-fallback: none;
          --webgl-active: block;
        }
        :root.no-webgl {
          --webgl-fallback: block;
          --webgl-active: none;
        }
      `}</style>
    </>
  );
}