import React, { useEffect, useRef, useState } from 'react';

const Hologram: React.FC = () => {
  const text = "Osaka Kansai Web Development Meetup Group • ";
  const radius = 120;
  const angleStep = 360 / text.length;
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [hue, setHue] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate rotation based on mouse position relative to center
      const deltaX = (e.clientX - centerX) / (rect.width / 2);
      const deltaY = (e.clientY - centerY) / (rect.height / 2);
      
      // Simulate gyroscope-like rotation values (-45 to 45 degrees)
      const rotX = deltaY * 45;
      const rotY = deltaX * 45;
      
      setRotation({ x: rotX, y: rotY });
      
      // Map position to HSB hue (0-360)
      const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
      const normalizedAngle = (angle + 360) % 360;
      setHue(normalizedAngle);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Convert HSL to color stops for conic gradient
  const generateGradientStops = () => {
    const stops = [];
    for (let i = 0; i < 6; i++) {
      const angle = (hue + i * 60) % 360;
      stops.push(`hsl(${angle}, 70%, 50%)`);
    }
    return stops.join(', ');
  };

  return (
    <div ref={containerRef} className="relative w-80 h-80 mx-auto perspective-1000">
      {/* 3D transformed container */}
      <div 
        className="relative w-full h-full transform-gpu transition-transform duration-75"
        style={{
          transform: `rotateX(${-rotation.x}deg) rotateY(${rotation.y}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Dynamic holographic gradient background */}
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <div 
            className="absolute inset-0 animate-slow-spin"
            style={{
              background: `conic-gradient(from ${hue}deg, ${generateGradientStops()})`,
              filter: 'blur(40px)',
              opacity: 0.6,
            }}
          />
          <div className="absolute inset-0 bg-gradient-radial from-transparent to-base-100/50" />
        </div>

        {/* Central circular logo with holographic effect */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-40 h-40 transform-gpu" style={{ transformStyle: 'preserve-3d' }}>
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
                  animation: 'holographic-shift 4s linear infinite',
                }}
              />
              
              {/* Glass effect overlay */}
              <div className="absolute inset-0 bg-gradient-radial from-white/20 via-transparent to-transparent" />
              
              {/* Logo container with backdrop */}
              <div className="absolute inset-2 rounded-full bg-base-100/5 backdrop-blur-md border border-white/20 flex items-center justify-center overflow-hidden">
                {/* Animated light sweep */}
                <div 
                  className="absolute inset-0 opacity-40"
                  style={{
                    background: `linear-gradient(${-hue}deg, transparent 30%, rgba(255,255,255,0.8) 50%, transparent 70%)`,
                    transform: `translateX(${Math.sin(hue * Math.PI / 180) * 50}%) translateY(${Math.cos(hue * Math.PI / 180) * 50}%)`,
                  }}
                />
                
                {/* OK text with holographic shimmer */}
                <span 
                  className="text-5xl font-bold relative z-10 drop-shadow-lg"
                  style={{
                    background: `linear-gradient(${hue}deg, 
                      hsl(${hue}, 90%, 80%) 0%, 
                      hsl(${(hue + 180) % 360}, 90%, 80%) 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.5))',
                  }}
                >
                  OK
                </span>
              </div>
            </div>
            
            {/* 3D depth layers */}
            <div 
              className="absolute inset-4 rounded-full border border-primary/20"
              style={{ transform: 'translateZ(-20px)' }}
            />
            <div 
              className="absolute inset-6 rounded-full border border-secondary/20"
              style={{ transform: 'translateZ(-40px)' }}
            />
          </div>
        </div>

        {/* Rotating text with 3D effect */}
        <div 
          className="absolute inset-0 animate-text-rotate"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {text.split('').map((char, i) => {
            const angle = i * angleStep;
            const x = radius * Math.cos((angle * Math.PI) / 180);
            const y = radius * Math.sin((angle * Math.PI) / 180);
            
            return (
              <span
                key={i}
                className="absolute left-1/2 top-1/2 text-sm font-medium"
                style={{
                  transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${angle + 90}deg) translateZ(20px)`,
                  transformOrigin: 'center',
                  color: `hsl(${(hue + angle) % 360}, 70%, 60%)`,
                  textShadow: '0 0 10px rgba(255,255,255,0.3)',
                }}
              >
                {char}
              </span>
            );
          })}
        </div>
      </div>

      <style jsx>{`
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
          0% { transform: rotate(0deg) scale(1.2); }
          100% { transform: rotate(360deg) scale(1.2); }
        }

        @keyframes text-rotate {
          0% { transform: rotateZ(0deg); }
          100% { transform: rotateZ(360deg); }
        }

        .animate-slow-spin {
          animation: slow-spin 20s linear infinite;
        }

        .animate-text-rotate {
          animation: text-rotate 30s linear infinite;
        }

        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  );
};

export default Hologram;