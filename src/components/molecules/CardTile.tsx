import React from 'react';
import { ThothCard } from '../../types';
import { Badge } from '../atoms/Badge';
import { getThothCardImageUrl } from '../../utils/cardImageUrls';

export interface CardTileProps {
  card: ThothCard;
  onClick?: () => void;
  isSelected?: boolean;
  showDetails?: boolean;
}

export const CardTile: React.FC<CardTileProps> = ({
  card,
  onClick,
  isSelected = false,
  showDetails = true,
}) => {
  const imageUrl = getThothCardImageUrl(card);

  return (
    <div
      onClick={onClick}
      className={`group relative bg-[#0e0e11] p-3 rounded-sm border transition cursor-pointer flex flex-col justify-between ${
        isSelected
          ? 'border-[#c5a059] bg-[#c5a059]/10 shadow-lg ring-1 ring-[#c5a059]'
          : 'border-white/10 hover:border-[#c5a059]/60 hover:bg-[#121218]'
      }`}
    >
      <div>
        <div className="flex items-center justify-between gap-1 mb-2">
          <Badge variant={card.type === 'major' ? 'major' : card.type === 'court' ? 'court' : 'minor'}>
            {card.type === 'major' ? `ATU ${card.atuNumber ?? 0}` : card.suit || card.category}
          </Badge>
          {card.hebrewLetter && (
            <span className="text-xs font-serif font-bold text-[#c5a059] bg-[#050505] px-1.5 py-0.5 rounded border border-[#c5a059]/30">
              {card.hebrewLetter.letter}
            </span>
          )}
        </div>

        <div className="aspect-[3/4] rounded-sm bg-[#050505] border border-white/5 overflow-hidden relative mb-2 flex items-center justify-center">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={card.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            />
          ) : (
            <div className="text-center p-2">
              <span className="atu-font text-stone-400 text-xs">{card.name}</span>
            </div>
          )}
        </div>

        <h4 className="atu-font text-sm font-bold text-stone-100 group-hover:text-[#c5a059] transition line-clamp-1">
          {card.name}
        </h4>
        <div className="text-[11px] font-mono text-[#c5a059] italic line-clamp-1">
          "{card.thothTitle}"
        </div>
      </div>

      {showDetails && (
        <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-stone-400">
          <span>{card.astrology?.name || card.alchemy.element}</span>
          <span className="text-stone-300">{card.treeOfLife.sephiraOrPath}</span>
        </div>
      )}
    </div>
  );
};
