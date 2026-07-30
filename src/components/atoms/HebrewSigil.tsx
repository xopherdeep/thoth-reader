import React from 'react';
import { HebrewLetter } from '../../types';

export interface HebrewSigilProps {
  hebrew: HebrewLetter | null;
  size?: 'sm' | 'md' | 'lg';
}

export const HebrewSigil: React.FC<HebrewSigilProps> = ({ hebrew, size = 'md' }) => {
  if (!hebrew) return null;

  const sizeMap = {
    sm: 'text-sm',
    md: 'text-xl',
    lg: 'text-3xl',
  };

  return (
    <div className="inline-flex items-center gap-1.5 bg-[#050505] px-2 py-0.5 rounded border border-[#c5a059]/40 font-mono">
      <span className={`font-serif font-bold text-[#c5a059] ${sizeMap[size]}`}>
        {hebrew.letter}
      </span>
      <span className="text-[10px] text-stone-300">
        {hebrew.name} ({hebrew.value})
      </span>
    </div>
  );
};
