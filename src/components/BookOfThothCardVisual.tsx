import React, { useState, useEffect } from 'react';
import { ThothCard } from '../types';
import { getThothCardImageUrl } from '../utils/cardImageUrls';

interface BookOfThothCardVisualProps {
  card: ThothCard;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showDetailsOverlay?: boolean;
}

export const BookOfThothCardVisual: React.FC<BookOfThothCardVisualProps> = ({
  card,
  className = '',
  size = 'md',
  showDetailsOverlay = true,
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const imageUrl = getThothCardImageUrl(card);

  useEffect(() => {
    setImageError(false);
    setImageLoaded(false);
  }, [card.id, imageUrl]);

  // Elemental color gradient palette based on Thoth Atziluth/Briah/Yetzirah/Assiah scales
  const getThothPalette = () => {
    const suitOrElement = card.suit || card.alchemy?.element || 'Air';
    switch (suitOrElement) {
      case 'Wands':
      case 'Fire':
        return {
          bg: 'from-[#2a0805] via-[#140404] to-[#050101]',
          border: 'border-amber-500/80',
          accent: '#f97316',
          gold: '#c5a059',
          glow: 'rgba(249, 115, 22, 0.35)',
          elementSymbol: '🜂',
        };
      case 'Cups':
      case 'Water':
        return {
          bg: 'from-[#051829] via-[#030e1a] to-[#01050a]',
          border: 'border-cyan-500/80',
          accent: '#38bdf8',
          gold: '#c5a059',
          glow: 'rgba(56, 189, 248, 0.35)',
          elementSymbol: '🜄',
        };
      case 'Swords':
      case 'Air':
        return {
          bg: 'from-[#211f08] via-[#121104] to-[#050501]',
          border: 'border-yellow-400/80',
          accent: '#eab308',
          gold: '#c5a059',
          glow: 'rgba(234, 179, 8, 0.35)',
          elementSymbol: '🜁',
        };
      case 'Disks':
      case 'Earth':
      default:
        return {
          bg: 'from-[#061d12] via-[#030f09] to-[#010503]',
          border: 'border-emerald-500/80',
          accent: '#10b981',
          gold: '#c5a059',
          glow: 'rgba(16, 185, 129, 0.35)',
          elementSymbol: '🜃',
        };
    }
  };

  const palette = getThothPalette();


  return (
    <div
      className={`relative w-full h-full overflow-hidden bg-[#050505] flex flex-col justify-between select-none ${className}`}
    >
      {/* FULL BLEED CARD FACE (MATCHES CLASSIC CARD LAYOUT) */}
      {imageUrl && !imageError ? (
        <div className="relative w-full h-full overflow-hidden flex-1">
          <img
            src={imageUrl}
            alt={card.name}
            referrerPolicy="no-referrer"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover opacity-95 group-hover:opacity-100 transition-all duration-300 group-hover:scale-105"
          />
          {/* Top & Bottom Ambient Vignette Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40 pointer-events-none" />

          {/* Floating Top Header Info Badges */}
          <div className="absolute top-1.5 left-1.5 right-1.5 z-20 flex items-center justify-between pointer-events-none">
            <div className="px-1.5 py-0.5 rounded-sm bg-[#050505]/85 border border-[#c5a059]/50 text-[#c5a059] font-mono text-[9px] font-bold shadow-md backdrop-blur-sm">
              {card.atuNumber !== null ? `ATU ${card.atuNumber}` : card.suit || 'THOTH'}
            </div>
            {card.astrology?.symbol || card.hebrewLetter?.letter ? (
              <div className="px-1.5 py-0.5 rounded-sm bg-[#050505]/85 border border-[#c5a059]/40 text-stone-200 font-mono text-[10px] font-bold shadow-md backdrop-blur-sm">
                {card.hebrewLetter?.letter || card.astrology?.symbol}
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        /* ART DECO BOOK OF THOTH CARD CANVAS FALLBACK */
        <div className={`relative w-full h-full p-4 bg-gradient-to-b ${palette.bg} flex flex-col justify-between items-center text-center border border-[#c5a059]/40`}>
          <div className="text-[10px] font-mono text-[#c5a059] font-bold uppercase tracking-widest">
            {card.atuNumber !== null ? `ATU ${card.atuNumber}` : card.suit || 'BOOK OF THOTH'}
          </div>

          {/* Central Symbol Emblem */}
          <div className="my-auto flex flex-col items-center justify-center space-y-1">
            <div
              className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-[#c5a059] bg-black/80 flex items-center justify-center shadow-lg"
              style={{ boxShadow: `0 0 18px ${palette.glow}` }}
            >
              <span className="text-3xl sm:text-4xl text-[#c5a059] font-serif">
                {card.hebrewLetter?.letter || card.astrology?.symbol || palette.elementSymbol}
              </span>
            </div>
            <div className="text-[11px] font-mono font-bold text-stone-100 uppercase tracking-wide">
              {card.hebrewLetter ? `${card.hebrewLetter.name} (${card.hebrewLetter.letter})` : card.name}
            </div>
          </div>

          <div className="text-[9px] font-mono text-[#c5a059]/90 italic truncate max-w-[90%]">
            "{card.thothTitle}"
          </div>
        </div>
      )}

      {/* BOTTOM TITLE OVERLAY BAR (IDENTICAL TO CLASSIC CARD) */}
      {showDetailsOverlay && (
        <div className="relative z-20 p-2 bg-[#050505]/95 border-t border-white/10 backdrop-blur-sm">
          <div className="atu-font font-bold text-stone-100 truncate text-[11px] tracking-wide group-hover:text-[#c5a059] transition">
            {card.name}
          </div>
          <div className="text-[9px] text-[#c5a059]/80 font-sans italic truncate -mt-0.5">
            "{card.thothTitle}"
          </div>
        </div>
      )}
    </div>
  );
};
