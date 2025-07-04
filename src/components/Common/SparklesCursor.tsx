import { useEffect, useRef, useState } from 'react';

interface Sparkle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  hue: number;
}

export default function SparklesCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparklesRef = useRef<Sparkle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      setIsVisible(true);
      
      // Create new sparkles
      for (let i = 0; i < 3; i++) {
        if (Math.random() < 0.7) { // 70% chance to create sparkle
          const sparkle: Sparkle = {
            id: Date.now() + Math.random(),
            x: e.clientX + (Math.random() - 0.5) * 20,
            y: e.clientY + (Math.random() - 0.5) * 20,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            life: 60,
            maxLife: 60,
            size: Math.random() * 4 + 2,
            hue: Math.random() * 360,
          };
          sparklesRef.current.push(sparkle);
        }
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw sparkles
      sparklesRef.current = sparklesRef.current.filter(sparkle => {
        sparkle.life--;
        sparkle.x += sparkle.vx;
        sparkle.y += sparkle.vy;
        sparkle.vx *= 0.99; // Slight friction
        sparkle.vy *= 0.99;
        sparkle.vy += 0.1; // Gravity

        if (sparkle.life <= 0) return false;

        // Draw sparkle
        const alpha = sparkle.life / sparkle.maxLife;
        const size = sparkle.size * alpha;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(sparkle.x, sparkle.y);
        
        // Create a star shape
        ctx.beginPath();
        ctx.fillStyle = `hsl(${sparkle.hue}, 100%, 70%)`;
        
        // Draw a 4-pointed star
        for (let i = 0; i < 4; i++) {
          ctx.save();
          ctx.rotate((i * Math.PI) / 2);
          ctx.beginPath();
          ctx.moveTo(0, -size);
          ctx.lineTo(size * 0.3, -size * 0.3);
          ctx.lineTo(size, 0);
          ctx.lineTo(size * 0.3, size * 0.3);
          ctx.lineTo(0, size);
          ctx.lineTo(-size * 0.3, size * 0.3);
          ctx.lineTo(-size, 0);
          ctx.lineTo(-size * 0.3, -size * 0.3);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }

        // Add a glow effect
        ctx.shadowColor = `hsl(${sparkle.hue}, 100%, 70%)`;
        ctx.shadowBlur = size * 2;
        ctx.fill();
        
        ctx.restore();

        return true;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ 
        mixBlendMode: 'screen',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s ease-out'
      }}
    />
  );
}