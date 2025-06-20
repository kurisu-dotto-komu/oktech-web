import React from 'react';

interface BrandProps {
  compact?: boolean;
}

const Brand: React.FC<BrandProps> = ({ compact = false }) => {
  return (
    <div className={`flex items-center gap-2 ${compact ? 'text-base' : 'text-xl'}`}>
      <div className="relative">
        <div className={`${compact ? 'w-8 h-8' : 'w-12 h-12'} bg-gradient-to-br from-primary to-secondary rounded-lg shadow-lg flex items-center justify-center`}>
          <span className={`font-bold text-base-100 ${compact ? 'text-sm' : 'text-lg'}`}>OK</span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 blur-xl rounded-lg"></div>
      </div>
      {!compact && (
        <span className="font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Tech
        </span>
      )}
    </div>
  );
};

export default Brand;