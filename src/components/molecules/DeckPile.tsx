import React from 'react';
import { CardBack } from '../atoms/CardBack';

export interface DeckPileProps {
  id: string;
  name: string;
  tetragrammaton: string;
  element: string;
  cardCount: number;
  isSelected?: boolean;
  onClick?: () => void;
}

export const DeckPile: React.FC<DeckPileProps> = ({
  id,
  name,
  tetragrammaton,
  element,
  cardCount,
  isSelected = false,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`group relative bg-[#0e0e11] p-4 rounded-sm border transition cursor-pointer flex flex-col items-center justify-between text-center space-y-3 ${
        isSelected
          ? 'border-[#c5a059] bg-[#c5a059]/15 shadow-xl ring-2 ring-[#c5a059]'
          : 'border-white/10 hover:border-[#c5a059]/60 hover:bg-[#121218]'
      }`}
    >
      <div className="w-full flex items-center justify-between font-mono text-[10px]">
        <span className="text-[#c5a059] font-bold uppercase bg-[#050505] px-2 py-0.5 rounded border border-[#c5a059]/30">
          {tetragrammaton}
        </span>
        <span className="text-stone-400">{element}</span>
      </div>

      <div className="relative my-2">
        {/* Layered Stack Effect */}
        <div className="absolute top-1 left-1 w-20 h-32 bg-[#050505] border border-white/10 rounded-sm" />
        <div className="absolute top-0.5 left-0.5 w-20 h-32 bg-[#08080c] border border-white/20 rounded-sm" />
        <CardBack size="sm" className="w-20 h-32 relative z-10" />
      </div>

      <div>
        <h4 className="atu-font text-sm font-bold text-stone-100 group-hover:text-[#c5a059]">
          {name}
        </h4>
        <div className="text-[11px] font-mono text-stone-400">{cardCount} Cards</div>
      </div>
    </div>
  );
};
