import React from 'react';

const Hologram: React.FC = () => {
  return (
    <div className="relative w-64 h-64 mx-auto">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-secondary/30 to-accent/30 blur-3xl animate-pulse"></div>
      
      <div className="relative w-full h-full perspective-1000">
        <div className="relative w-full h-full transform-gpu animate-float">
          <div className="absolute inset-4 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl backdrop-blur-sm border border-primary/30 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary/10 to-transparent animate-shimmer"></div>
          </div>
          
          <div className="absolute inset-8 bg-gradient-to-br from-secondary/20 to-accent/20 rounded-xl backdrop-blur-sm border border-secondary/30 shadow-xl transform rotate-6">
            <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-secondary/10 to-transparent animate-shimmer-delayed"></div>
          </div>
          
          <div className="absolute inset-12 bg-gradient-to-br from-accent/20 to-primary/20 rounded-lg backdrop-blur-sm border border-accent/30 shadow-lg transform -rotate-3">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/10 to-transparent animate-shimmer-slow"></div>
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl font-bold bg-gradient-to-br from-primary via-secondary to-accent bg-clip-text text-transparent animate-gradient">
              OK
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0) rotateX(0) rotateY(0); }
          25% { transform: translateY(-10px) rotateX(5deg) rotateY(5deg); }
          50% { transform: translateY(0) rotateX(-5deg) rotateY(-5deg); }
          75% { transform: translateY(10px) rotateX(5deg) rotateY(-5deg); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        
        @keyframes shimmer-delayed {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        
        @keyframes shimmer-slow {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-shimmer {
          animation: shimmer 3s ease-in-out infinite;
        }
        
        .animate-shimmer-delayed {
          animation: shimmer-delayed 3s ease-in-out infinite;
          animation-delay: 1s;
        }
        
        .animate-shimmer-slow {
          animation: shimmer-slow 3s ease-in-out infinite;
          animation-delay: 2s;
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 4s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default Hologram;