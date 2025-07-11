"use client";

// WORK IN PROGRESS! This is just an AI generated far from final.

import { useEffect, useRef, useState } from "react";

// Type declaration for Gyroscope API
interface Gyroscope extends EventTarget {
  x: number;
  y: number;
  z: number;
  start(): void;
  stop(): void;
}

interface GyroscopeConstructor {
  new (options: { frequency: number }): Gyroscope;
}

declare global {
  interface Window {
    Gyroscope?: GyroscopeConstructor;
  }
}

export default function Hologram() {
  const text = "Osaka Kansai Web Development Meetup Group • ";
  const radius = 85; // Reduced from 120 to bring text closer
  const angleStep = 360 / text.length;

  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [hue, setHue] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    let gyroAvailable = false;

    // Try to use gyroscope if available
    if ("Gyroscope" in window && "permissions" in navigator) {
      navigator.permissions
        .query({ name: "gyroscope" as PermissionName })
        .then((result) => {
          if (result.state === "granted") {
            try {
              const sensor = new window.Gyroscope!({ frequency: 60 });
              sensor.addEventListener("reading", () => {
                setRotation({ x: sensor.x * 10, y: sensor.y * 10 });
                const angle = (Math.atan2(sensor.y, sensor.x) * 180) / Math.PI;
                setHue((angle + 360) % 360);
              });
              sensor.start();
              gyroAvailable = true;
            } catch (error) {
              // Gyroscope not available, fall back to mouse
            }
          }
        })
        .catch(() => {
          // Permissions API not available, fall back to mouse
        });
    }

    // Mouse movement handler
    const handleMouseMove = (e: MouseEvent) => {
      if (gyroAvailable) return;

      // Use window dimensions for full-screen tracking
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      // Calculate position relative to screen center
      const deltaX = (e.clientX - centerX) / centerX;
      const deltaY = (e.clientY - centerY) / centerY;

      // Update mouse position for light direction
      setMousePos({ x: deltaX, y: deltaY });

      // Simulate gyroscope-like rotation values (-30 to 30 degrees)
      const rotX = deltaY * 30;
      const rotY = deltaX * 30;

      setRotation({ x: rotX, y: rotY });

      // Map position to HSB hue (0-360)
      const angle = (Math.atan2(deltaY, deltaX) * 180) / Math.PI;
      const normalizedAngle = (angle + 360) % 360;
      setHue(normalizedAngle);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mounted]);

  // Render static placeholder during SSR
  if (!mounted) {
    return (
      <div className="relative w-64 h-64 mx-auto">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-40 h-40">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-secondary opacity-20" />
            <div className="absolute inset-2 rounded-full bg-base-100/10 backdrop-blur-md border border-primary/30 flex items-center justify-center">
              <span className="text-5xl font-bold text-primary/50">OK</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-64 h-64 mx-auto perspective-1000"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hover tooltip */}
      {isHovered && (
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-50 px-3 py-2 bg-base-300 text-base-content text-sm rounded-lg shadow-lg border border-primary/20 whitespace-nowrap">
          This is an AI generated one-shot attempt, far from complete!
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-base-300"></div>
        </div>
      )}

      {/* 3D transformed container */}
      <div
        className="relative w-full h-full transform-gpu transition-transform duration-100 ease-out"
        style={{
          transform: `rotateX(${-rotation.x}deg) rotateY(${rotation.y}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Central circular logo with holographic effect */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="relative w-40 h-40 transform-gpu"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Holographic mask layer */}
            <div className="absolute inset-0 rounded-full overflow-hidden">
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(${hue + 45}deg, 
                    hsl(${hue}, 80%, 60%) 0%, 
                    hsl(${(hue + 60) % 360}, 80%, 50%) 25%,
                    hsl(${(hue + 120) % 360}, 80%, 60%) 50%,
                    hsl(${(hue + 180) % 360}, 80%, 50%) 75%,
                    hsl(${(hue + 240) % 360}, 80%, 60%) 100%)`,
                  animation: "holographic-shift 4s linear infinite",
                }}
              />

              {/* Glass effect overlay */}
              <div className="absolute inset-0 bg-gradient-radial from-white/20 via-transparent to-transparent" />

              {/* Logo container with backdrop */}
              <div className="absolute inset-2 rounded-full bg-base-100/5 backdrop-blur-md border border-white/20 flex items-center justify-center overflow-hidden">
                {/* Animated light sweep based on mouse position */}
                <div
                  className="absolute inset-0 opacity-50"
                  style={{
                    background: `radial-gradient(circle at ${50 + mousePos.x * 30}% ${50 + mousePos.y * 30}%, rgba(255,255,255,0.8) 0%, transparent 50%)`,
                  }}
                />

                {/* OK text with holographic shimmer */}
                <span
                  className="text-5xl font-bold relative z-10 drop-shadow-lg"
                  style={{
                    backgroundImage: `linear-gradient(${hue}deg, 
                      hsl(${hue}, 90%, 80%) 0%, 
                      hsl(${(hue + 180) % 360}, 90%, 80%) 100%)`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    filter: "drop-shadow(0 0 20px rgba(255,255,255,0.5))",
                  }}
                >
                  OK
                </span>
              </div>
            </div>

            {/* 3D depth layers */}
            <div
              className="absolute inset-4 rounded-full border border-primary/20"
              style={{ transform: "translateZ(-20px)" }}
            />
            <div
              className="absolute inset-6 rounded-full border border-secondary/20"
              style={{ transform: "translateZ(-40px)" }}
            />
          </div>
        </div>

        {/* Rotating text with 3D effect */}
        <div
          className="absolute inset-0 animate-text-rotate"
          style={{ transformStyle: "preserve-3d" }}
        >
          {text.split("").map((char, i) => {
            const angle = i * angleStep;
            const x = radius * Math.cos((angle * Math.PI) / 180);
            const y = radius * Math.sin((angle * Math.PI) / 180);

            return (
              <span
                key={i}
                className="absolute left-1/2 top-1/2 text-xs font-semibold"
                style={{
                  transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${angle + 90}deg) translateZ(10px)`,
                  transformOrigin: "center",
                  color: `hsl(${(hue + angle) % 360}, 70%, 60%)`,
                  textShadow: "0 0 8px rgba(255,255,255,0.4)",
                  letterSpacing: "-0.05em",
                }}
              >
                {char}
              </span>
            );
          })}
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .perspective-1000 {
          perspective: 1000px;
        }

        @keyframes holographic-shift {
          0% {
            filter: hue-rotate(0deg) brightness(1) contrast(1.2);
          }
          100% {
            filter: hue-rotate(360deg) brightness(1.2) contrast(1);
          }
        }

        @keyframes slow-spin {
          0% {
            transform: rotate(0deg) scale(1.2);
          }
          100% {
            transform: rotate(360deg) scale(1.2);
          }
        }

        @keyframes text-rotate {
          0% {
            transform: rotateZ(0deg);
          }
          100% {
            transform: rotateZ(360deg);
          }
        }

        .animate-slow-spin {
          animation: slow-spin 20s linear infinite;
        }

        .animate-text-rotate {
          animation: text-rotate 15s linear infinite;
        }

        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
      `,
        }}
      />
    </div>
  );
}
