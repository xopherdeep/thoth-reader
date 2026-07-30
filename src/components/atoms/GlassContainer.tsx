import React from 'react';

interface GlassContainerProps {
  children: React.ReactNode;
  className?: string;
  withOrnament?: boolean;
}

export const GlassContainer: React.FC<GlassContainerProps> = ({ 
  children, 
  className = '', 
  withOrnament = false 
}) => {
  return (
    <div 
      className={`relative bg-[#0a0a0e]/95 backdrop-blur-2xl border border-[#c5a059]/20 rounded-2xl p-7 sm:p-10 shadow-[0_16px_60px_rgba(0,0,0,0.9),_0_0_0_1px_rgba(197,160,89,0.08)] overflow-hidden ${withOrnament ? 'corner-ornament' : ''} ${className}`}
    >
      {children}
    </div>
  );
};
