import React from 'react';

export interface CardBackProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const CardBack: React.FC<CardBackProps> = ({ className = '', size = 'md' }) => {
  const dimensions = {
    sm: 'w-16 h-28',
    md: 'w-28 h-48',
    lg: 'w-48 h-80',
  };

  return (
    <div
      className={`relative rounded-sm overflow-hidden border border-[#c5a059]/60 bg-[#0a0a0d] shadow-xl flex items-center justify-center ${dimensions[size]} ${className}`}
    >
      {/* Outer Diamond Pattern */}
      <div className="absolute inset-1 border border-[#c5a059]/30 rounded-xs pointer-events-none" />
      <div className="absolute inset-2 border border-[#c5a059]/10 rounded-xs pointer-events-none" />

      {/* Central Sacred Geometry Rose Cross */}
      <div className="relative w-12 h-12 flex items-center justify-center">
        <div className="absolute w-10 h-10 border border-[#c5a059]/60 rotate-45" />
        <div className="absolute w-10 h-10 border border-[#c5a059]/40" />
        <div className="w-4 h-4 rounded-full bg-[#c5a059]/20 border border-[#c5a059] flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-[#c5a059]" />
        </div>
      </div>
    </div>
  );
};
