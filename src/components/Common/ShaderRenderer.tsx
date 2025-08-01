import { useEffect, useRef, useState } from "react";

export interface UniformValue {
  type: "1f" | "2f" | "3f" | "1i" | "2i" | "3i";
  value: number | number[];
}

interface ShaderRendererProps {
  fragmentShader: string | string[];
  className?: string;
  style?: React.CSSProperties;
  showComments?: boolean;
  uniforms?: Record<string, UniformValue>;
}

// Parse shader comments from the top of the file
function parseShaderComments(shader: string): string | null {
  const lines = shader.split("\n");
  let comments: string[] = [];
  let inMultilineComment = false;

  for (const line of lines) {
    const trimmed = line.trim();

    // Handle multi-line comments
    if (inMultilineComment) {
      const endIndex = trimmed.indexOf("*/");
      if (endIndex !== -1) {
        comments.push(trimmed.substring(0, endIndex).trim());
        inMultilineComment = false;
      } else {
        comments.push(trimmed);
      }
      continue;
    }

    // Check for single-line comments
    if (trimmed.startsWith("//")) {
      comments.push(trimmed.substring(2).trim());
    } else if (trimmed.startsWith("/*")) {
      inMultilineComment = true;
      const endIndex = trimmed.indexOf("*/", 2);
      if (endIndex !== -1) {
        comments.push(trimmed.substring(2, endIndex).trim());
        inMultilineComment = false;
      } else {
        comments.push(trimmed.substring(2).trim());
      }
    } else if (trimmed === "" && comments.length > 0) {
      // Continue collecting empty lines between comments
      continue;
    } else if (trimmed !== "") {
      // Stop at first non-comment, non-empty line
      break;
    }
  }

  return comments.length > 0 ? comments.join(" ") : null;
}

// Render text with clickable links
function renderTextWithLinks(text: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);

  return parts.map((part, index) => {
    if (part.match(urlRegex)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-white/90"
        >
          {part}
        </a>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

// WebGL helper functions
function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Shader compile error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function createProgram(
  gl: WebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader,
): WebGLProgram | null {
  const program = gl.createProgram();
  if (!program) return null;

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Program link error:", gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }

  return program;
}

export default function ShaderRenderer({
  fragmentShader,
  className = "absolute inset-0 w-full h-full",
  style = { touchAction: "none" },
  showComments = false,
  uniforms = {},
}: ShaderRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0 });

  // Handle multiple shaders
  const shaders = Array.isArray(fragmentShader) ? fragmentShader : [fragmentShader];
  const [activeShaderIndex, setActiveShaderIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const activeShader = shaders[activeShaderIndex];

  // Parse comments from active shader
  const shaderComment = parseShaderComments(activeShader);

  // Auto-progression
  useEffect(() => {
    if (shaders.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setActiveShaderIndex((prev) => (prev + 1) % shaders.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [shaders.length, isPaused]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (shaders.length <= 1) return;

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          setActiveShaderIndex((prev) => (prev - 1 + shaders.length) % shaders.length);
          setIsPaused(true);
          break;
        case "ArrowRight":
          e.preventDefault();
          setActiveShaderIndex((prev) => (prev + 1) % shaders.length);
          setIsPaused(true);
          break;
        case " ":
          e.preventDefault();
          setIsPaused((prev) => !prev);
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [shaders.length]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl");
    if (!gl) {
      console.error("WebGL not supported");
      return;
    }

    // Enable extensions if needed
    gl.getExtension("OES_standard_derivatives");

    // Vertex shader source - standard full screen quad
    const vertexShaderSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    // Create and compile shaders
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShaderCompiled = createShader(gl, gl.FRAGMENT_SHADER, activeShader);

    if (!vertexShader || !fragmentShaderCompiled) return;

    // Create program
    const program = createProgram(gl, vertexShader, fragmentShaderCompiled);
    if (!program) return;

    // Set up geometry (full screen quad)
    const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    // Get attribute and uniform locations
    const positionLocation = gl.getAttribLocation(program, "a_position");
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const timeLocation = gl.getUniformLocation(program, "u_time");
    const mouseLocation = gl.getUniformLocation(program, "u_mouse");

    // Get custom uniform locations
    const customUniformLocations: Record<string, WebGLUniformLocation | null> = {};
    for (const uniformName in uniforms) {
      customUniformLocations[uniformName] = gl.getUniformLocation(program, uniformName);
    }

    // Resize canvas
    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Mouse event handlers - listen at document level to capture events over overlaid elements
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = canvas.height - (e.clientY - rect.top); // Flip Y coordinate
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        mouseRef.current.x = touch.clientX - rect.left;
        mouseRef.current.y = canvas.height - (touch.clientY - rect.top); // Flip Y coordinate
      }
    };

    // Listen at document level to capture mouse events even when over overlaid elements
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("touchmove", handleTouchMove, { passive: true });

    // Animation loop
    const startTime = Date.now();
    const render = () => {
      const currentTime = (Date.now() - startTime) * 0.001; // Convert to seconds

      gl.useProgram(program);

      // Set uniforms
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(timeLocation, currentTime);
      gl.uniform2f(mouseLocation, mouseRef.current.x, mouseRef.current.y);

      // Set custom uniforms
      for (const [uniformName, uniformData] of Object.entries(uniforms)) {
        const location = customUniformLocations[uniformName];
        if (location) {
          const { type, value } = uniformData;
          switch (type) {
            case "1f":
              gl.uniform1f(location, value as number);
              break;
            case "2f":
              gl.uniform2f(location, ...(value as [number, number]));
              break;
            case "3f":
              gl.uniform3f(location, ...(value as [number, number, number]));
              break;
            case "1i":
              gl.uniform1i(location, value as number);
              break;
            case "2i":
              gl.uniform2i(location, ...(value as [number, number]));
              break;
            case "3i":
              gl.uniform3i(location, ...(value as [number, number, number]));
              break;
          }
        }
      }

      // Set up attribute
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

      // Draw
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      animationFrameRef.current = requestAnimationFrame(render);
    };
    render();

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("touchmove", handleTouchMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [activeShader, uniforms]);

  return (
    <div className="relative w-full h-full">
      <canvas ref={canvasRef} className={className} style={style} data-testid="shader-canvas" />
      {showComments && shaderComment && (
        <div className="absolute bottom-4 left-4 w-2/3 text-white/70 text-sm">
          {renderTextWithLinks(shaderComment)}
        </div>
      )}
      {shaders.length > 1 && (
        <div className="absolute bottom-4 right-4 flex items-center gap-3">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="text-white/70 hover:text-white transition-colors"
            aria-label={isPaused ? "Resume auto-progression" : "Pause auto-progression"}
          >
            {isPaused ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 4v12l10-6z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 4h3v12H5V4zm7 0h3v12h-3V4z" />
              </svg>
            )}
          </button>
          <div className="flex gap-2">
            {shaders.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setActiveShaderIndex(index);
                  setIsPaused(true);
                }}
                className={`w-4 h-4 rounded-full transition-all ${
                  index === activeShaderIndex
                    ? "bg-white scale-110"
                    : "bg-white/50 hover:bg-white/70"
                }`}
                aria-label={`Switch to shader ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
