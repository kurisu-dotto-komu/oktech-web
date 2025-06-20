import React from 'react';

const Hologram: React.FC = () => {
  const text = "Osaka Kansai Web Development Meetup Group • ";
  const radius = 120;
  const angleStep = 360 / text.length;

  return (
    <div className="relative w-80 h-80 mx-auto">
      {/* Holographic gradient background */}
      <div className="absolute inset-0 rounded-full overflow-hidden">
        <div className="absolute inset-0 animate-holographic-shift">
          <div className="absolute inset-0 bg-gradient-conic from-red-500 via-yellow-500 via-green-500 via-cyan-500 via-blue-500 via-purple-500 to-red-500 opacity-40 blur-xl"></div>
        </div>
        <div className="absolute inset-0 bg-gradient-radial from-transparent to-base-100/50"></div>
      </div>

      {/* Central circular logo */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-40 h-40">
          {/* Holographic effect layer */}
          <div className="absolute inset-0 rounded-full overflow-hidden animate-holographic-float">
            <div className="absolute inset-0 bg-gradient-conic from-primary via-secondary via-accent via-primary to-primary animate-holographic-spin"></div>
            <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-base-100/20"></div>
          </div>
          
          {/* Logo container */}
          <div className="absolute inset-2 rounded-full bg-base-100/10 backdrop-blur-md border-2 border-primary/30 flex items-center justify-center overflow-hidden">
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-linear animate-holographic-sweep opacity-30"></div>
            
            {/* OK text */}
            <span className="text-5xl font-bold text-base-100 relative z-10 drop-shadow-lg">
              OK
            </span>
          </div>
        </div>
      </div>

      {/* Rotating text */}
      <div className="absolute inset-0 animate-text-rotate">
        {text.split('').map((char, i) => {
          const angle = i * angleStep;
          const x = radius * Math.cos((angle * Math.PI) / 180);
          const y = radius * Math.sin((angle * Math.PI) / 180);
          
          return (
            <span
              key={i}
              className="absolute left-1/2 top-1/2 text-sm font-medium text-primary/80"
              style={{
                transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${angle + 90}deg)`,
                transformOrigin: 'center',
              }}
            >
              {char}
            </span>
          );
        })}
      </div>

      <style jsx>{`
        @keyframes holographic-shift {
          0% { transform: rotate(0deg) scale(1.5); }
          100% { transform: rotate(360deg) scale(1.5); }
        }

        @keyframes holographic-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes holographic-float {
          0%, 100% { transform: scale(1) translateY(0); }
          50% { transform: scale(1.05) translateY(-5px); }
        }

        @keyframes holographic-sweep {
          0% { 
            background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.5) 50%, transparent 70%);
            transform: translateX(-100%) translateY(-100%);
          }
          100% { 
            background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.5) 50%, transparent 70%);
            transform: translateX(100%) translateY(100%);
          }
        }

        @keyframes text-rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .animate-holographic-shift {
          animation: holographic-shift 8s linear infinite;
        }

        .animate-holographic-spin {
          animation: holographic-spin 3s linear infinite;
        }

        .animate-holographic-float {
          animation: holographic-float 4s ease-in-out infinite;
        }

        .animate-holographic-sweep {
          animation: holographic-sweep 3s ease-in-out infinite;
        }

        .animate-text-rotate {
          animation: text-rotate 20s linear infinite;
        }

        .bg-gradient-conic {
          background: conic-gradient(from 0deg, var(--tw-gradient-stops));
        }

        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }

        .bg-gradient-linear {
          background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.5) 50%, transparent 70%);
          background-size: 200% 200%;
        }
      `}</style>
    </div>
  );
};

export default Hologram;