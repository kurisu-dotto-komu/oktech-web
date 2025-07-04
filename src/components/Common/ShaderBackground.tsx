'use client';

import { useRef, useEffect, useMemo, useCallback } from 'react';

interface ShaderBackgroundProps {
  className?: string;
  variant?: 'dots' | 'waves' | 'grid';
  intensity?: number;
  color?: string;
  backgroundColor?: string;
  interactive?: boolean;
}

export default function ShaderBackground({ 
  className = '', 
  variant = 'dots',
  intensity = 0.6,
  color = '#ffffff',
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
    uniform vec3 u_backgroundColor;
    
    // SDF circle function
    float sdCircle(vec2 p, float r) {
      return length(p) - r;
    }
    
    // Smooth minimum function for blending
    float smin(float a, float b, float k) {
      float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
      return mix(b, a, h) - k * h * (1.0 - h);
    }
    
    // Noise function
    float noise(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }
    
    void main() {
      vec2 uv = gl_FragCoord.xy / u_resolution.xy;
      vec2 aspectRatio = vec2(u_resolution.x / u_resolution.y, 1.0);
      vec2 correctedUv = (uv - 0.5) * aspectRatio;
      
      // Grid parameters
      float gridSize = ${variant === 'dots' ? '20.0' : variant === 'waves' ? '15.0' : '25.0'};
      float dotRadius = ${variant === 'dots' ? '0.15' : variant === 'waves' ? '0.12' : '0.18'};
      
      // Create grid coordinates
      vec2 gridUv = fract(correctedUv * gridSize + 0.5) - 0.5;
      vec2 gridId = floor(correctedUv * gridSize + 0.5);
      
      // Mouse influence
      vec2 mouseUv = (u_mouse / u_resolution.xy - 0.5) * aspectRatio;
      float mouseDistance = length(correctedUv - mouseUv);
      float mouseInfluence = smoothstep(0.3, 0.0, mouseDistance);
      
      // Time-based animation
      float timeOffset = u_time * 0.5;
      float cellNoise = noise(gridId * 0.1);
      float pulsePhase = timeOffset + cellNoise * 6.28318;
      float pulse = sin(pulsePhase) * 0.5 + 0.5;
      
      // Distance from center for radial gradient
      float centerDistance = length(correctedUv);
      float radialMask = smoothstep(0.8, 0.3, centerDistance);
      
      ${variant === 'waves' ? `
      // Wave distortion
      float wave = sin(correctedUv.x * 10.0 + u_time) * 0.1;
      gridUv.y += wave;
      ` : ''}
      
      ${variant === 'grid' ? `
      // Grid line effect
      vec2 gridLines = abs(gridUv);
      float lineWidth = 0.02;
      float lines = 1.0 - smoothstep(lineWidth, lineWidth + 0.01, min(gridLines.x, gridLines.y));
      ` : ''}
      
      // Create dot/shape
      float shape = sdCircle(gridUv, dotRadius);
      float smoothShape = 1.0 - smoothstep(0.0, 0.02, shape);
      
      ${variant === 'grid' ? `
      smoothShape = max(smoothShape, lines);
      ` : ''}
      
      // Apply mouse interaction and animation
      float finalIntensity = smoothShape * radialMask * u_intensity;
      finalIntensity += mouseInfluence * 0.3;
      finalIntensity += pulse * 0.1 * radialMask;
      
      // Color mixing
      vec3 finalColor = mix(u_backgroundColor, u_color, finalIntensity);
      
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
    const resolvedBgColor = backgroundColor === 'transparent' ? 'transparent' : 
                           backgroundColor.startsWith('var(') ? getCSSProperty(backgroundColor.slice(4, -1)) : backgroundColor;
    
    const colorRgb = hexToRgb(resolvedColor);
    const bgColorRgb = resolvedBgColor === 'transparent' ? [0, 0, 0] : hexToRgb(resolvedBgColor);
    
    gl.uniform3f(uniforms.u_color, colorRgb[0], colorRgb[1], colorRgb[2]);
    gl.uniform3f(uniforms.u_backgroundColor, bgColorRgb[0], bgColorRgb[1], bgColorRgb[2]);
    
    // Draw
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    
    // Continue animation
    animationRef.current = requestAnimationFrame(() => render(gl, program, uniforms));
  }, [intensity, color, backgroundColor]);

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
        className={`absolute inset-0 w-full h-full pointer-events-none opacity-20 ${className}`}
        style={{
          background: `radial-gradient(circle at 50% 50%, ${color}20 0%, transparent 50%), 
                      repeating-linear-gradient(0deg, transparent, transparent 20px, ${color}10 21px, transparent 22px),
                      repeating-linear-gradient(90deg, transparent, transparent 20px, ${color}10 21px, transparent 22px)`,
          animation: 'subtle-pulse 4s ease-in-out infinite alternate',
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
        @keyframes subtle-pulse {
          from { opacity: 0.1; }
          to { opacity: 0.3; }
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